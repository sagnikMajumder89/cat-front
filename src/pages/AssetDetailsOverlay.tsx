import React from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

interface Asset {
  id: number;
  type: string;
  startDate: string;
  endDate: string;
  totalEngineHours: number;
  downtimeHours: number;
  fuelUsage: number;
  operatingDays: number;
  lastOperator: string;
}

interface Props {
  asset: Asset | null;
  onClose: () => void;
}

const COLORS = ["#f59e0b", "#b45309", "#d97706"]; // amber shades

const AssetDetailsOverlay: React.FC<Props> = ({ asset, onClose }) => {
  if (!asset) return null;

  const pieData = [
    { name: "Downtime (hrs)", value: asset.downtimeHours },
    { name: "Fuel Usage (L)", value: asset.fuelUsage },
    { name: "Operating Days", value: asset.operatingDays },
  ];

  const barData = [
    { name: "Engine Hours", value: asset.totalEngineHours },
    { name: "Downtime", value: asset.downtimeHours },
    { name: "Operating Days", value: asset.operatingDays },
  ];

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="bg-white rounded-xl shadow-lg p-6 max-w-4xl w-full overflow-y-auto max-h-[90vh]"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-amber-900">
            {asset.type} (ID: {asset.id})
          </h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-amber-700 text-xl font-bold"
          >
            ✕
          </button>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 border rounded-lg bg-amber-50">
            <p>
              <span className="font-semibold">Start Date:</span>{" "}
              {asset.startDate}
            </p>
            <p>
              <span className="font-semibold">End Date:</span> {asset.endDate}
            </p>
            <p>
              <span className="font-semibold">Last Operator:</span>{" "}
              {asset.lastOperator}
            </p>
          </div>
          <div className="p-4 border rounded-lg bg-amber-50">
            <p>
              <span className="font-semibold">Total Engine Hours:</span>{" "}
              {asset.totalEngineHours}
            </p>
            <p>
              <span className="font-semibold">Downtime Hours:</span>{" "}
              {asset.downtimeHours}
            </p>
            <p>
              <span className="font-semibold">Fuel Usage:</span>{" "}
              {asset.fuelUsage} L
            </p>
            <p>
              <span className="font-semibold">Operating Days:</span>{" "}
              {asset.operatingDays}
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="w-full h-64">
            <h3 className="text-lg font-semibold text-amber-800 mb-2">
              Resource Distribution
            </h3>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={80}
                  fill="#f59e0b"
                  label
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="w-full h-64">
            <h3 className="text-lg font-semibold text-amber-800 mb-2">
              Performance Metrics
            </h3>
            <ResponsiveContainer>
              <BarChart data={barData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#d97706" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AssetDetailsOverlay;
