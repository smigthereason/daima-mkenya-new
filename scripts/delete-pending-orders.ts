// scripts/delete-pending-orders.ts
//
// Bulk-deletes stale, never-paid orders (paymentStatus === "pending") and
// restores the stock they locked away.
//
// WHY STOCK RESTORATION MATTERS:
// app/api/pesapal/register-order/route.ts decrements product stock the
// moment an order is created - BEFORE payment is confirmed. If a customer
// abandons checkout or the PesaPal payment never completes, the order sits
// forever as "pending" and the stock it reserved never comes back. Deleting
// these orders without restoring stock would permanently shrink your
// inventory for items nobody actually bought.
//
// SAFETY:
// - Runs as a DRY RUN by default. Nothing is deleted or changed unless you
//   pass --confirm.
// - Only touches orders older than --older-than-hours (default 24) so it
//   never deletes an order someone might be mid-payment on right now.
// - Pass --no-restore-stock if you specifically don't want stock touched.
//
// USAGE:
//   npm run cleanup:pending-orders                  (dry run, 24h+ old)
//   npm run cleanup:pending-orders -- --confirm      (actually delete)
//   npm run cleanup:pending-orders -- --confirm --older-than-hours=1
//   npm run cleanup:pending-orders -- --confirm --no-restore-stock
//
import { config } from "dotenv";
import { createClient } from "@sanity/client";
import path from "path";

config({ path: path.resolve(process.cwd(), ".env.local") });

if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
  console.error("❌ NEXT_PUBLIC_SANITY_PROJECT_ID is not set in .env.local");
  process.exit(1);
}
if (!process.env.SANITY_API_TOKEN) {
  console.error("❌ SANITY_API_TOKEN is not set in .env.local");
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

// ── CLI flags ────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const CONFIRM = args.includes("--confirm");
const RESTORE_STOCK = !args.includes("--no-restore-stock");
const olderThanArg = args.find((a) => a.startsWith("--older-than-hours="));
const OLDER_THAN_HOURS = olderThanArg
  ? Number(olderThanArg.split("=")[1])
  : 24;
// ─────────────────────────────────────────────────────────────────────

type PendingOrder = {
  _id: string;
  orderNumber?: string;
  amount?: number;
  _createdAt: string;
  items?: {
    quantity: number;
    product: { _id: string; name: string; stock: number } | null;
  }[];
};

async function deletePendingOrders() {
  const cutoff = new Date(
    Date.now() - OLDER_THAN_HOURS * 60 * 60 * 1000,
  ).toISOString();

  const orders: PendingOrder[] = await client.fetch(
    `*[_type == "order" && paymentStatus == "pending" && _createdAt < $cutoff] | order(_createdAt asc) {
      _id, orderNumber, amount, _createdAt,
      items[] { quantity, "product": product-> { _id, name, stock } }
    }`,
    { cutoff },
  );

  if (orders.length === 0) {
    console.log(
      `✅ No pending orders older than ${OLDER_THAN_HOURS}h found. Nothing to do.`,
    );
    return;
  }

  const totalValue = orders.reduce((sum, o) => sum + (o.amount || 0), 0);

  console.log(
    `\n${CONFIRM ? "🗑️  DELETING" : "🔍 DRY RUN - would delete"} ${orders.length} pending order(s) older than ${OLDER_THAN_HOURS}h (total KES ${totalValue.toLocaleString()}):\n`,
  );

  for (const order of orders) {
    console.log(
      `  - ${order.orderNumber || order._id} | ${new Date(order._createdAt).toLocaleString()} | KES ${(order.amount || 0).toLocaleString()}`,
    );
  }

  if (!CONFIRM) {
    console.log(
      `\nThis was a dry run - nothing was deleted. Re-run with --confirm to actually delete these orders${RESTORE_STOCK ? " and restore their stock" : ""}.`,
    );
    return;
  }

  console.log("");

  let deletedCount = 0;
  let restoredItemCount = 0;
  let errorCount = 0;

  for (const order of orders) {
    try {
      if (RESTORE_STOCK && order.items?.length) {
        for (const item of order.items) {
          if (!item.product?._id) continue; // product was deleted separately, skip
          const newStock = (item.product.stock || 0) + (item.quantity || 0);
          await client
            .patch(item.product._id)
            .set({ stock: newStock })
            .commit();
          restoredItemCount++;
        }
      }

      await client.delete(order._id);
      deletedCount++;
      console.log(`  ✅ Deleted ${order.orderNumber || order._id}`);
    } catch (error) {
      errorCount++;
      console.error(
        `  ❌ Failed on ${order.orderNumber || order._id}:`,
        error,
      );
    }
  }

  console.log(
    `\nDone. Deleted ${deletedCount}/${orders.length} order(s).${
      RESTORE_STOCK ? ` Restored stock for ${restoredItemCount} item line(s).` : ""
    }${errorCount ? ` ${errorCount} failed - see errors above.` : ""}`,
  );
}

deletePendingOrders().catch((err) => {
  console.error("❌ Script failed:", err);
  process.exit(1);
});
