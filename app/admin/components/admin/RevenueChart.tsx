// components/admin/RevenueChart.tsx
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function RevenueChart({ orders }: { orders: any[] }) {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split("T")[0];
  }).reverse();

  const data = last7Days.map((date) => {
    const dayOrders = orders.filter(
      (o: any) =>
        o._createdAt?.split("T")[0] === date && o.paymentStatus === "paid",
    );
    const revenue = dayOrders.reduce(
      (sum: number, o: any) => sum + (o.amount || 0),
      0,
    );

    return {
      date: new Date(date).toLocaleDateString("en-US", { weekday: "short" }),
      revenue,
    };
  });

  return (
    <div className="w-full h-[300px] md:h-[400px] lg:h-[450px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="0"
            stroke="#f0f0f0"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            stroke="#a3a3a3"
            fontSize={10}
            tick={{ fontWeight: 800, letterSpacing: "0.1em" }}
            dy={15}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            stroke="#a3a3a3"
            fontSize={10}
            tick={{ fontWeight: 800 }}
          />
          <Tooltip
            cursor={{ stroke: "#be1e2d", strokeWidth: 1 }}
            contentStyle={{
              backgroundColor: "black",
              border: "none",
              borderRadius: "0px",
              padding: "12px",
            }}
            itemStyle={{
              color: "white",
              fontSize: "10px",
              fontWeight: "900",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
            }}
            labelStyle={{ display: "none" }}
            // FIX: Handle possible undefined value for TypeScript
            formatter={(value: number | undefined) => [
              `KES ${value ? value.toLocaleString() : "0"}`,
              "REVENUE",
            ]}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#171717"
            strokeWidth={3}
            dot={{ fill: "#171717", strokeWidth: 2, r: 4, stroke: "#fff" }}
            activeDot={{
              r: 6,
              fill: "#be1e2d",
              stroke: "#fff",
              strokeWidth: 2,
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
