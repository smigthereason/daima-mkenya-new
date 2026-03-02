// components/admin/CategoryPieChart.tsx
"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#171717", "#be1e2d", "#404040", "#737373", "#a3a3a3"];

export default function CategoryPieChart({ orders }: { orders: any[] }) {
  // DEBUGGING: Check what orders are being passed from page.tsx
  console.log("Orders received in PieChart:", orders);

  const categorySales = new Map();

  // Ensure orders exist and is an array
  if (orders && Array.isArray(orders)) {
    orders.forEach((order: any) => {
      // 1. Verify "paymentStatus" matches this exact string
      if (order.paymentStatus === "paid" && order.items) {
        order.items.forEach((item: any) => {
          // Ensure nested product data exists
          const category = item.product?.category || "Other";
          const revenue = (item.price || 0) * (item.quantity || 1);
          categorySales.set(
            category,
            (categorySales.get(category) || 0) + revenue,
          );
        });
      }
    });
  }

  const data = Array.from(categorySales.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // DEBUGGING: Check calculated data
  console.log("Calculated pie data:", data);

  // 2. UI: Handle Empty State
  if (data.length === 0) {
    return (
      <div className="w-full h-[300px] flex flex-col items-center justify-center border border-neutral-100 rounded-none bg-neutral-50/50">
        <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
          No Sales Data
        </p>
        <p className="text-[9px] text-neutral-400 uppercase tracking-widest mt-1">
          Waiting for orders marked "paid"
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center max-w-md mx-auto">
      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="70%"
              outerRadius="95%"
              paddingAngle={4}
              dataKey="value"
              stroke="none"
              cornerRadius={0}
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "black",
                border: "none",
                borderRadius: "0px",
              }}
              itemStyle={{
                color: "white",
                fontSize: "10px",
                fontWeight: "900",
                textTransform: "uppercase",
              }}
              // FIX: Handle possible undefined value for TypeScript
              formatter={(value: number | undefined) => [
                `KES ${value ? value.toLocaleString() : "0"}`,
                "Revenue",
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 2-Column Grid Legend */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-12 w-full">
        {data.map((entry, index) => (
          <div
            key={entry.name}
            className="flex items-center gap-3 border-l-2 pl-3 border-neutral-100"
          >
            <div
              className="w-1.5 h-1.5 shrink-0"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400 truncate">
              {entry.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
