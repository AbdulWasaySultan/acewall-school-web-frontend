import React, { useEffect, useState } from "react";
import {
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  Area,
  ResponsiveContainer,
} from "recharts";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Loader } from "lucide-react";

export default function BandedChart({ userId }) {
  const [data, setData] = useState([]);
  const [period, setPeriod] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    let isMounted = true; // prevent memory leaks

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axiosInstance.get(
          `loginactivity/getLoginActivityofStudent/${userId}?period=${period}`
        );

        if (isMounted) {
          setData(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err) {
        console.error("Login activity error:", err);
        if (isMounted) {
          setError("Failed to load activity data");
          setData([]);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [userId, period]);

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <p>
          <Loader className="animate-spin" />
        </p>
      </div>
    );
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div className="mt-4">
      {/* Period Filter */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ marginRight: 8 }}>Select Period:</label>
        <select
          value={period}
          className="border px-4 py-2 rounded-lg"
          onChange={(e) => setPeriod(Number(e.target.value))}
        >
          <option value={30}>Last 30 Days</option>
          <option value={60}>Last 60 Days</option>
          <option value={90}>Last 90 Days</option>
        </select>
      </div>

      {/* Chart Container */}
      <div style={{ width: "100%", height: "400px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 20, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            {/* Date on X-axis */}
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />

            {/* Fixed width prevents reflow loops */}
            <YAxis width={40} allowDecimals={false} />

            <Tooltip />
            <Legend />

            {/* Login count */}
            <Line
              type="monotone"
              dataKey="b"
              stroke="#4808e9"
              strokeWidth={2}
              dot={false}
              name="Logins"
            />

            {/* Activity background */}
            {/* <Area
              type="monotone"
              dataKey="a"
              fill="#e5e7eb"
              stroke="none"
              dot={false}
              name="Activity"
            /> */}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
