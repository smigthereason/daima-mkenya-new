// "use client";

// import {
//   PieChart,
//   Pie,
//   Cell,
//   ResponsiveContainer,
//   Tooltip,
// } from "recharts";

// const CATEGORY_COLORS: Record<string, string> = {
//   Accessories: "#BE1E2D",
//   Streetwear: "#171717",
//   Sets: "#006241",
//   Shirts: "#C89B3C",
//   Tops: "#8B5E3C",
//   Skirts: "#A65F73",
//   Dresses: "#7D3C98",
//   Jackets: "#34495E",
//   Trousers: "#5D6D7E",
//   Knitwear: "#B7950B",
//   Pants: "#566573",
//   Uncategorized: "#D4D4D4",
// };

// const DEFAULT_CATEGORY_COLOR = "#D4D4D4";

// interface Product {
//   _id?: string;
//   name?: string;
//   categories?: string[];
// }

// interface OrderItem {
//   productName?: string;
//   quantity?: number;
//   price?: number | string;
//   product?: Product | null;
// }

// interface Order {
//   paymentStatus?: string;
//   items?: OrderItem[];
// }

// interface CategoryData {
//   name: string;
//   value: number;
// }

// const parsePrice = (
//   price: number | string | undefined,
// ): number => {
//   if (typeof price === "number") {
//     return Number.isFinite(price) ? price : 0;
//   }

//   if (typeof price === "string") {
//     const parsed = parseFloat(
//       price.replace(/[^0-9.]/g, ""),
//     );

//     return Number.isFinite(parsed) ? parsed : 0;
//   }

//   return 0;
// };

// const getCategoryColor = (category: string): string => {
//   return (
//     CATEGORY_COLORS[category] ||
//     DEFAULT_CATEGORY_COLOR
//   );
// };

// export default function CategoryPieChart({
//   orders,
// }: {
//   orders: Order[];
// }) {
//   const categorySales = new Map<string, number>();

//   if (Array.isArray(orders)) {
//     orders.forEach((order) => {
//       /**
//        * Only include successfully paid orders.
//        */
//       if (order.paymentStatus !== "paid") {
//         return;
//       }

//       if (!Array.isArray(order.items)) {
//         return;
//       }

//       order.items.forEach((item) => {
//         const price = parsePrice(item.price);

//         const quantity =
//           typeof item.quantity === "number" &&
//           item.quantity > 0
//             ? item.quantity
//             : 1;

//         const revenue = price * quantity;

//         if (revenue <= 0) {
//           return;
//         }

//         /**
//          * Sanity stores product categories as:
//          *
//          * categories: string[]
//          */
//         const categories = Array.isArray(
//           item.product?.categories,
//         )
//           ? item.product.categories.filter(
//               (
//                 category,
//               ): category is string =>
//                 typeof category === "string" &&
//                 category.trim().length > 0,
//             )
//           : [];

//         /**
//          * Use the first category as the primary category
//          * to avoid double-counting revenue when a product
//          * belongs to multiple categories.
//          */
//         const primaryCategory =
//           categories.length > 0
//             ? categories[0]
//             : "Uncategorized";

//         categorySales.set(
//           primaryCategory,
//           (categorySales.get(primaryCategory) ||
//             0) + revenue,
//         );
//       });
//     });
//   }

//   const data: CategoryData[] = Array.from(
//     categorySales.entries(),
//   )
//     .map(([name, value]) => ({
//       name,
//       value,
//     }))
//     .sort((a, b) => b.value - a.value);

//   const totalRevenue = data.reduce(
//     (sum, item) => sum + item.value,
//     0,
//   );

//   /**
//    * EMPTY STATE
//    */
//   if (data.length === 0) {
//     return (
//       <div className="w-full h-[300px] flex flex-col items-center justify-center border border-neutral-100 bg-neutral-50/50">
//         <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
//           No Sales Data
//         </p>

//         <p className="text-[9px] text-neutral-400 uppercase tracking-widest mt-1">
//           Waiting for paid orders
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full flex flex-col items-center max-w-md mx-auto">
//       {/* =======================================================
//           PIE CHART
//       ======================================================= */}

//       <div className="w-full h-[300px] relative">
//         {/* CENTER TOTAL */}

//         <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
//           <span className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em]">
//             Total
//           </span>

//           <span className="text-lg font-serif font-black italic">
//             {totalRevenue >= 1000
//               ? `${(
//                   totalRevenue / 1000
//                 ).toFixed(1)}k`
//               : totalRevenue.toLocaleString()}
//           </span>

//           <span className="text-[7px] uppercase tracking-[0.2em] text-neutral-400 mt-1">
//             KES
//           </span>
//         </div>

//         <ResponsiveContainer
//           width="100%"
//           height="100%"
//         >
//           <PieChart>
//             <Pie
//               data={data}
//               cx="50%"
//               cy="50%"
//               innerRadius="72%"
//               outerRadius="95%"
//               paddingAngle={
//                 data.length > 1 ? 3 : 0
//               }
//               dataKey="value"
//               nameKey="name"
//               stroke="none"
//               animationBegin={0}
//               animationDuration={1200}
//             >
//               {data.map((entry) => (
//                 <Cell
//                   key={entry.name}
//                   fill={getCategoryColor(
//                     entry.name,
//                   )}
//                   className="hover:opacity-80 transition-opacity cursor-pointer"
//                 />
//               ))}
//             </Pie>

//             <Tooltip
//               contentStyle={{
//                 backgroundColor: "black",
//                 border: "none",
//                 borderRadius: "0px",
//                 padding: "12px",
//               }}
//               itemStyle={{
//                 color: "white",
//                 fontSize: "10px",
//                 fontWeight: "900",
//                 textTransform:
//                   "uppercase",
//                 letterSpacing: "0.1em",
//               }}
//               labelStyle={{
//                 color: "#a3a3a3",
//                 fontSize: "9px",
//                 fontWeight: "700",
//                 textTransform:
//                   "uppercase",
//               }}
//               formatter={(
//                 value: number | string,
//               ) => {
//                 const numericValue =
//                   Number(value) || 0;

//                 const percentage =
//                   totalRevenue > 0
//                     ? (
//                         (numericValue /
//                           totalRevenue) *
//                         100
//                       ).toFixed(1)
//                     : "0";

//                 return [
//                   `KES ${numericValue.toLocaleString()} (${percentage}%)`,
//                   "REVENUE",
//                 ];
//               }}
//             />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>

//       {/* =======================================================
//           CATEGORY LEGEND
//       ======================================================= */}

//       <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mt-8 w-full">
//         {data.map((entry) => {
//           const percentage =
//             totalRevenue > 0
//               ? (entry.value /
//                   totalRevenue) *
//                 100
//               : 0;

//           return (
//             <div
//               key={entry.name}
//               className="flex items-center justify-between border-b border-neutral-100 pb-3 gap-4"
//             >
//               <div className="flex items-center gap-3 min-w-0">
//                 <div
//                   className="w-1.5 h-1.5 shrink-0"
//                   style={{
//                     backgroundColor:
//                       getCategoryColor(
//                         entry.name,
//                       ),
//                   }}
//                 />

//                 <div className="min-w-0">
//                   <span className="block text-[9px] font-black uppercase tracking-[0.15em] text-neutral-500 truncate">
//                     {entry.name}
//                   </span>

//                   <span className="block text-[8px] text-neutral-400 mt-0.5">
//                     KES{" "}
//                     {entry.value.toLocaleString()}
//                   </span>
//                 </div>
//               </div>

//               <span className="text-[9px] font-black text-black shrink-0">
//                 {percentage.toFixed(
//                   percentage < 1 &&
//                     percentage > 0
//                     ? 1
//                     : 0,
//                 )}
//                 %
//               </span>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }
"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

/**
 * ============================================================
 * DEMO MODE
 * ============================================================
 *
 * true  = demo orders
 * false = real Sanity orders
 */
const DEMO_MODE = false;

/**
 * Permanent category colours.
 *
 * These are visual enhancements only.
 * Category information is ALSO displayed using text,
 * so the chart does not depend on colour alone.
 */
 const CATEGORY_COLORS: Record<string, string> = {
   Accessories: "#D71920",   // Red
   Streetwear: "#111111",    // Black
   Sets: "#007A4D",          // Green
   Shirts: "#E07A00",        // Orange
   Tops: "#8C564B",          // Brown
   Skirts: "#C2185B",        // Deep pink
   Dresses: "#7B2CBF",       // Purple
   Jackets: "#0057B8",       // Strong blue
   Trousers: "#00A6A6",      // Teal
   Knitwear: "#D4A017",      // Gold
   Pants: "#6B7280",         // Neutral grey
   Uncategorized: "#BDBDBD", // Light grey
 };

const DEFAULT_CATEGORY_COLOR = "#666666";

const SANITY_CATEGORIES = [
  "Accessories",
  "Streetwear",
  "Sets",
  "Shirts",
  "Tops",
  "Skirts",
  "Dresses",
  "Jackets",
  "Trousers",
  "Knitwear",
  "Pants",
] as const;

interface Product {
  _id?: string;
  name?: string;
  categories?: string[];
}

interface OrderItem {
  productName?: string;
  quantity?: number;
  price?: number | string;
  product?: Product | null;
}

interface Order {
  paymentStatus?: string;
  items?: OrderItem[];
}

interface CategoryData {
  name: string;
  value: number;
}

/**
 * ============================================================
 * DEMO DATA
 * ============================================================
 */

const CATEGORY_BASE_PRICES: Record<string, number> = {
  Accessories: 2500,
  Streetwear: 4200,
  Sets: 10000,
  Shirts: 1800,
  Tops: 2500,
  Skirts: 3000,
  Dresses: 7500,
  Jackets: 7000,
  Trousers: 10000,
  Knitwear: 5800,
  Pants: 10000,
};

const generateDemoOrders = (): Order[] => {
  const demoOrders: Order[] = [];

  SANITY_CATEGORIES.forEach((category, categoryIndex) => {
    const basePrice =
      CATEGORY_BASE_PRICES[category] ?? 3000;

    for (
      let orderIndex = 0;
      orderIndex < 12;
      orderIndex++
    ) {
      const priceVariation =
        orderIndex * 75 + categoryIndex * 50;

      const price =
        basePrice + priceVariation;

      const quantity =
        orderIndex % 5 === 0 ? 2 : 1;

      demoOrders.push({
        paymentStatus: "paid",

        items: [
          {
            productName: `${category} Demo Product ${
              orderIndex + 1
            }`,
            quantity,
            price,

            product: {
              _id: `demo-${category.toLowerCase()}-${orderIndex}`,
              name: `${category} Demo Product ${
                orderIndex + 1
              }`,
              categories: [category],
            },
          },
        ],
      });
    }
  });

  return demoOrders;
};

const DEMO_ORDERS = generateDemoOrders();

const parsePrice = (
  price: number | string | undefined,
): number => {
  if (typeof price === "number") {
    return Number.isFinite(price)
      ? price
      : 0;
  }

  if (typeof price === "string") {
    const parsed = parseFloat(
      price.replace(/[^0-9.]/g, ""),
    );

    return Number.isFinite(parsed)
      ? parsed
      : 0;
  }

  return 0;
};

const getCategoryColor = (
  category: string,
): string => {
  return (
    CATEGORY_COLORS[category] ||
    DEFAULT_CATEGORY_COLOR
  );
};

const formatCompactCurrency = (
  amount: number,
): string => {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}m`;
  }

  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(1)}k`;
  }

  return amount.toLocaleString();
};

export default function CategoryPieChart({
  orders,
}: {
  orders: Order[];
}) {
  const activeOrders = DEMO_MODE
    ? DEMO_ORDERS
    : orders;

  const categorySales =
    new Map<string, number>();

  /**
   * ============================================================
   * CALCULATE REVENUE BY CATEGORY
   * ============================================================
   */

  if (Array.isArray(activeOrders)) {
    activeOrders.forEach((order) => {
      if (
        order.paymentStatus !== "paid"
      ) {
        return;
      }

      if (!Array.isArray(order.items)) {
        return;
      }

      order.items.forEach((item) => {
        const price = parsePrice(
          item.price,
        );

        const quantity =
          typeof item.quantity ===
            "number" &&
          item.quantity > 0
            ? item.quantity
            : 1;

        const revenue =
          price * quantity;

        if (revenue <= 0) {
          return;
        }

        const categories =
          Array.isArray(
            item.product?.categories,
          )
            ? item.product.categories.filter(
                (
                  category,
                ): category is string =>
                  typeof category ===
                    "string" &&
                  category.trim().length >
                    0,
              )
            : [];

        const primaryCategory =
          categories.length > 0
            ? categories[0]
            : "Uncategorized";

        categorySales.set(
          primaryCategory,
          (categorySales.get(
            primaryCategory,
          ) || 0) + revenue,
        );
      });
    });
  }

  const data: CategoryData[] =
    Array.from(
      categorySales.entries(),
    )
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort(
        (a, b) =>
          b.value - a.value,
      );

  const totalRevenue = data.reduce(
    (sum, item) =>
      sum + item.value,
    0,
  );

  /**
   * Accessible text description of chart.
   */
  const chartDescription = data
    .map((entry) => {
      const percentage =
        totalRevenue > 0
          ? (
              (entry.value /
                totalRevenue) *
              100
            ).toFixed(1)
          : "0";

      return `${entry.name}: ${percentage}%`;
    })
    .join(", ");

  /**
   * ============================================================
   * EMPTY STATE
   * ============================================================
   */

  if (data.length === 0) {
    return (
      <div className="w-full min-h-[320px] flex flex-col items-center justify-center border border-neutral-200 bg-neutral-50">
        <p className="text-sm font-bold uppercase tracking-wider text-neutral-800">
          No Sales Data
        </p>

        <p className="text-xs text-neutral-600 mt-2">
          Waiting for paid orders
        </p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center max-w-md mx-auto">
      {/* =======================================================
          DEMO INDICATOR
      ======================================================= */}

      {DEMO_MODE && (
        <div className="w-full mb-3 flex items-center justify-center">
          <span className="text-[10px] tracking-[0.16em] uppercase font-bold text-red-700 border border-red-300 px-3 py-1.5">
            Demo Data · 132 Orders
          </span>
        </div>
      )}

      {/* =======================================================
          CHART
      ======================================================= */}

      <div
        className="w-full h-[300px] relative"
        role="img"
        aria-label={`Portfolio split. Total revenue KES ${totalRevenue.toLocaleString()}. ${chartDescription}`}
      >
        {/* CENTER TOTAL */}

        <div
          className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10"
          aria-hidden="true"
        >
          <span className="text-[11px] font-bold text-neutral-600 uppercase tracking-[0.16em]">
            Total
          </span>

          <span className="text-[24px] leading-none mt-1 font-serif font-black italic text-neutral-950">
            {formatCompactCurrency(
              totalRevenue,
            )}
          </span>

          <span className="text-[10px] uppercase tracking-[0.15em] font-semibold text-neutral-600 mt-2">
            KES
          </span>
        </div>

        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="70%"
              outerRadius="94%"
              paddingAngle={
                data.length > 1
                  ? 2
                  : 0
              }
              dataKey="value"
              nameKey="name"
              stroke="#FFFFFF"
              strokeWidth={3}
              animationBegin={0}
              animationDuration={1200}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={getCategoryColor(
                    entry.name,
                  )}
                />
              ))}
            </Pie>

            <Tooltip
              contentStyle={{
                backgroundColor: "#171717",
                border: "1px solid #404040",
                borderRadius: "2px",
                padding: "12px 14px",
              }}
              itemStyle={{
                color: "#FFFFFF",
                fontSize: "12px",
                fontWeight: "700",
              }}
              labelStyle={{
                color: "#FFFFFF",
                fontSize: "12px",
                fontWeight: "700",
                marginBottom: "4px",
              }}
              formatter={(value) => {
                const numericValue =
                  typeof value === "number"
                    ? value
                    : Number(value ?? 0);

                const safeValue = Number.isFinite(numericValue)
                  ? numericValue
                  : 0;

                const percentage =
                  totalRevenue > 0
                    ? ((safeValue / totalRevenue) * 100).toFixed(1)
                    : "0";

                return [
                  `KES ${safeValue.toLocaleString()} · ${percentage}%`,
                  "Revenue",
                ];
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* =======================================================
          ACCESSIBLE CATEGORY LEGEND
      ======================================================= */}

      <div className="w-full mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
          {data.map(
            (entry, index) => {
              const percentage =
                totalRevenue > 0
                  ? (entry.value /
                      totalRevenue) *
                    100
                  : 0;

              return (
                <div
                  key={entry.name}
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                    min-h-[64px]
                    py-3
                    border-b
                    border-neutral-200
                  "
                >
                  {/* CATEGORY */}

                  <div className="flex items-center gap-3 min-w-0">
                    {/* NUMBERED COLOUR INDICATOR */}

                    <div
                      className="
                        w-7
                        h-7
                        shrink-0
                        flex
                        items-center
                        justify-center
                        text-[11px]
                        font-black
                        text-white
                        border
                        border-black/20
                      "
                      style={{
                        backgroundColor:
                          getCategoryColor(
                            entry.name,
                          ),
                      }}
                      aria-hidden="true"
                    >
                      {index + 1}
                    </div>

                    <div className="min-w-0">
                      <span className="block text-[12px] leading-tight font-bold uppercase tracking-[0.08em] text-neutral-900">
                        {entry.name}
                      </span>

                      <span className="block text-[11px] font-medium text-neutral-600 mt-1.5">
                        KES{" "}
                        {entry.value.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* PERCENTAGE */}

                  <div className="shrink-0 text-right">
                    <span className="block text-[13px] leading-none font-black text-neutral-950">
                      {percentage.toFixed(
                        percentage <
                          1 &&
                          percentage >
                            0
                          ? 1
                          : 0,
                      )}
                      %
                    </span>
                  </div>
                </div>
              );
            },
          )}
        </div>
      </div>

      {/* =======================================================
          SCREEN READER DATA TABLE
      ======================================================= */}

      <table className="sr-only">
        <caption>
          Portfolio split by
          category
        </caption>

        <thead>
          <tr>
            <th>Category</th>
            <th>Revenue</th>
            <th>
              Percentage of total
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map((entry) => {
            const percentage =
              totalRevenue > 0
                ? (entry.value /
                    totalRevenue) *
                  100
                : 0;

            return (
              <tr key={entry.name}>
                <td>
                  {entry.name}
                </td>

                <td>
                  KES{" "}
                  {entry.value.toLocaleString()}
                </td>

                <td>
                  {percentage.toFixed(
                    1,
                  )}
                  %
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
