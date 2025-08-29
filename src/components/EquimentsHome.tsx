import api from "@/api/axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import EquipmentMetrics from "./EquipmentMetrics";

interface EquipmentConfig {
  emoji: string;
  color: string;
  bgColor: string;
}

interface EquipmentAnalytics {
  equipmentTypeId: string;
  equipmentTypeName: string;
  totalCount: number;
  rentedCount: number;
  idleCount: number;
  totalRuntimeHours: number;
  totalIdleHours: number;
  totalFuelUsage: number;
  avgFuelBurnRate: number;
  distanceTraveled: number;
}

// Equipment type configuration with emojis
const equipmentConfig: Record<string, EquipmentConfig> = {
  Excavator: { emoji: "🔍", color: "text-amber-700", bgColor: "bg-amber-100" },
  Bulldozer: { emoji: "🚜", color: "text-amber-700", bgColor: "bg-amber-100" },
  Crane: { emoji: "🏗️", color: "text-amber-700", bgColor: "bg-amber-100" },
  Loader: { emoji: "📦", color: "text-amber-700", bgColor: "bg-amber-100" },
  "Dump Truck": {
    emoji: "🚚",
    color: "text-amber-700",
    bgColor: "bg-amber-100",
  },
};

export default function EquipmentsHome() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<EquipmentAnalytics[]>([]);
  const [selectedEquipment, setSelectedEquipment] =
    useState<EquipmentAnalytics | null>(null);

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const res = await api.get("/equipment/analytics");
        if (res.data.success) {
          setAnalytics(res.data.data);
        } else {
          setError("Failed to fetch equipment analytics");
          toast.error("Failed to fetch equipment analytics");
        }
      } catch (err) {
        setError("Error fetching equipment analytics");
        toast.error("Error fetching equipment analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchEquipments();
  }, []);

  const handleEquipmentClick = (equipment: EquipmentAnalytics) => {
    setSelectedEquipment(equipment);
  };

  const handleBackClick = () => {
    setSelectedEquipment(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
          <span className="ml-4 text-amber-700">
            Loading equipment analytics...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-50 p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg max-w-2xl mx-auto">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-500 text-xl">⚠️</span>
            </div>
            <div className="ml-3">
              <p className="text-red-700">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If an equipment is selected, show its detailed metrics
  if (selectedEquipment) {
    return (
      <EquipmentMetrics
        equipment={selectedEquipment}
        onBack={handleBackClick}
      />
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-amber-900">
            Equipment Analytics Dashboard
          </h1>
          <p className="text-amber-700 mt-2">
            Select an equipment type to view detailed metrics and analytics
          </p>
        </div>

        {/* Summary Stats */}
        <div className="mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-amber-200">
            <p className="text-amber-600 text-sm">Total Equipment Types</p>
            <p className="text-2xl font-bold text-amber-800">
              {analytics.length}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-amber-200">
            <p className="text-amber-600 text-sm">Total Units</p>
            <p className="text-2xl font-bold text-amber-800">
              {analytics.reduce((sum, item) => sum + item.totalCount, 0)}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-amber-200">
            <p className="text-amber-600 text-sm">Rented Units</p>
            <p className="text-2xl font-bold text-amber-800">
              {analytics.reduce((sum, item) => sum + item.rentedCount, 0)}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-amber-200">
            <p className="text-amber-600 text-sm">Idle Units</p>
            <p className="text-2xl font-bold text-amber-800">
              {analytics.reduce((sum, item) => sum + item.idleCount, 0)}
            </p>
          </div>
        </div>

        {/* Equipment Tiles Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {analytics.map((equipment) => {
            const config = equipmentConfig[equipment.equipmentTypeName] || {
              emoji: "🏗️",
              color: "text-amber-700",
              bgColor: "bg-amber-100",
            };

            const utilizationRate =
              equipment.totalCount > 0
                ? Math.round(
                    (equipment.rentedCount / equipment.totalCount) * 100
                  )
                : 0;

            return (
              <div
                key={equipment.equipmentTypeId}
                className={`group cursor-pointer rounded-xl border border-amber-200 ${config.bgColor} p-6 text-center shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-105 hover:bg-amber-200`}
                onClick={() => handleEquipmentClick(equipment)}
              >
                <div className="text-4xl mb-4">{config.emoji}</div>
                <h3 className="font-semibold text-amber-900 text-lg mb-2">
                  {equipment.equipmentTypeName}
                </h3>

                {/* Quick Stats */}
                <div className="mb-3 space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-amber-600">Total:</span>
                    <span className="font-medium text-amber-800">
                      {equipment.totalCount}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-amber-600">Rented:</span>
                    <span className="font-medium text-amber-800">
                      {equipment.rentedCount}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-amber-600">Idle:</span>
                    <span className="font-medium text-amber-800">
                      {equipment.idleCount}
                    </span>
                  </div>
                </div>

                {/* Utilization Bar */}
                <div className="w-full bg-amber-200 rounded-full h-2 mb-2">
                  <div
                    className="bg-amber-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${utilizationRate}%` }}
                  ></div>
                </div>
                <p className="text-xs text-amber-700 mb-2">
                  {utilizationRate}% utilized
                </p>

                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="inline-block bg-amber-600 text-white text-xs px-2 py-1 rounded-full">
                    View Analytics →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
