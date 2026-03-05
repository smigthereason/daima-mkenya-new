// components/admin/RevenueChart.tsx
"use client";

import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronDown } from "lucide-react";

type Timeframe = "daily" | "weekly" | "monthly";

export default function RevenueChart({ orders }: { orders: any[] }) {
  const [timeframe, setTimeframe] = useState<Timeframe>("daily");

  const generateData = () => {
    const now = new Date();

    if (timeframe === "daily") {
      // Last 7 Individual Days
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(now.getDate() - i);
        return date.toISOString().split("T")[0];
      }).reverse();

      return last7Days.map((date) => {
        const revenue = orders
          .filter(
            (o) =>
              o._createdAt?.split("T")[0] === date &&
              o.paymentStatus === "paid",
          )
          .reduce((sum, o) => sum + (o.amount || 0), 0);

        return {
          label: new Date(date).toLocaleDateString("en-US", {
            weekday: "short",
          }),
          revenue,
        };
      });
    }

    if (timeframe === "weekly") {
      // Last 4 Weeks
      return Array.from({ length: 4 }, (_, i) => {
        const start = new Date();
        start.setDate(now.getDate() - (i + 1) * 7);
        const end = new Date();
        end.setDate(now.getDate() - i * 7);

        const revenue = orders
          .filter((o) => {
            const orderDate = new Date(o._createdAt);
            return (
              orderDate >= start &&
              orderDate <= end &&
              o.paymentStatus === "paid"
            );
          })
          .reduce((sum, o) => sum + (o.amount || 0), 0);

        return {
          label: `Week ${4 - i}`,
          revenue,
        };
      }).reverse();
    }

    if (timeframe === "monthly") {
      // Last 6 Months
      return Array.from({ length: 6 }, (_, i) => {
        const date = new Date();
        date.setMonth(now.getMonth() - i);
        const monthStr = date.toLocaleString("en-US", { month: "short" });
        const yearNum = date.getFullYear();

        const revenue = orders
          .filter((o) => {
            const orderDate = new Date(o._createdAt);
            return (
              orderDate.getMonth() === date.getMonth() &&
              orderDate.getFullYear() === yearNum &&
              o.paymentStatus === "paid"
            );
          })
          .reduce((sum, o) => sum + (o.amount || 0), 0);

        return {
          label: monthStr,
          revenue,
        };
      }).reverse();
    }

    return [];
  };

  const chartData = generateData();

  return (
    <div className="w-full">
      {/* Header & Filter */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 mb-1">
            Revenue Performance
          </h3>
          <p className="text-2xl font-serif italic font-black uppercase tracking-tighter">
            Financial <span className="text-[#be1e2d]">Overview</span>
          </p>
        </div>

        <div className="relative group">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as Timeframe)}
            className="appearance-none bg-white border border-neutral-200 px-6 py-2 pr-10 text-[10px] font-black uppercase tracking-widest cursor-pointer focus:outline-none focus:border-black transition-colors"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400"
            size={14}
          />
        </div>
      </div>

      {/* Chart Container */}
      <div className="w-full h-[300px] md:h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="0"
              stroke="#f5f5f5"
              vertical={false}
            />
            <XAxis
              dataKey="label"
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
              tickFormatter={(value) =>
                `Ksh ${value >= 1000 ? value / 1000 + "k" : value}`
              }
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
              // FIXED: Handle potential undefined values for production build
              formatter={(value: number | any) => [
                `KES ${Number(value || 0).toLocaleString()}`,
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
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
