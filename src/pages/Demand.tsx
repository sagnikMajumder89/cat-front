import api from "@/api/axios";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import {
  BarChart3,
  Calendar,
  TrendingUp,
  Download,
  Play,
  RefreshCw,
} from "lucide-react";

interface ForecastData {
  month: string;
  forecastedDemand: number;
}

interface EquipmentType {
  equipmentId: string;
  status: string;
  equipmentTypeId: string;
  equipmentType: {
    name: string;
  };
}

interface EquipmentConfig {
  emoji: string;
  color: string;
  bgColor: string;
  lineColor: string;
}

// Equipment type configuration
const equipmentConfig: Record<string, EquipmentConfig> = {
  Excavator: {
    emoji: "🔍",
    color: "text-amber-700",
    bgColor: "bg-amber-100",
    lineColor: "#f59e0b",
  },
  Bulldozer: {
    emoji: "🚜",
    color: "text-amber-700",
    bgColor: "bg-amber-100",
    lineColor: "#d97706",
  },
  Crane: {
    emoji: "🏗️",
    color: "text-amber-700",
    bgColor: "bg-amber-100",
    lineColor: "#b45309",
  },
  Loader: {
    emoji: "📦",
    color: "text-amber-700",
    bgColor: "bg-amber-100",
    lineColor: "#92400e",
  },
  "Dump Truck": {
    emoji: "🚚",
    color: "text-amber-700",
    bgColor: "bg-amber-100",
    lineColor: "#78350f",
  },
};

// Line Chart Component
const LineChart = ({
  data,
  color,
  height = 200,
}: {
  data: ForecastData[];
  color: string;
  height?: number;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const padding = 40;
    const chartWidth = canvas.width - padding * 2;
    const chartHeight = canvas.height - padding * 2;

    // Find min and max values
    const values = data.map((item) => item.forecastedDemand);
    const maxValue = Math.max(...values);
    const minValue = Math.min(...values);
    const valueRange = maxValue - minValue;

    // Draw axes
    ctx.strokeStyle = "#d1d5db";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, canvas.height - padding);
    ctx.lineTo(canvas.width - padding, canvas.height - padding);
    ctx.stroke();

    // Draw line
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.beginPath();

    data.forEach((item, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth;
      const y =
        canvas.height -
        padding -
        ((item.forecastedDemand - minValue) / valueRange) * chartHeight;

      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw points
    data.forEach((item, index) => {
      const x = padding + (index / (data.length - 1)) * chartWidth;
      const y =
        canvas.height -
        padding -
        ((item.forecastedDemand - minValue) / valueRange) * chartHeight;

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 5, 0, Math.PI * 2);
      ctx.fill();

      // Draw value labels
      ctx.fillStyle = "#78350f";
      ctx.font = "12px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(item.forecastedDemand.toString(), x, y - 10);

      // Draw month labels (only show some to avoid crowding)
      if (index % 2 === 0) {
        ctx.fillStyle = "#6b7280";
        ctx.font = "10px sans-serif";
        ctx.textAlign = "center";
        const month = new Date(item.month).toLocaleDateString("en-US", {
          month: "short",
        });
        ctx.fillText(month, x, canvas.height - padding + 20);
      }
    });
  }, [data, color]);

  return (
    <canvas ref={canvasRef} width={600} height={height} className="w-full" />
  );
};

export default function DemandForecasting() {
  const [loading, setLoading] = useState(true);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [equipmentTypes, setEquipmentTypes] = useState<EquipmentType[]>([]);
  const [forecastData, setForecastData] = useState<
    Record<string, ForecastData[]>
  >({});
  const [selectedEquipmentType, setSelectedEquipmentType] = useState<
    string | null
  >(null);

  useEffect(() => {
    fetchEquipmentTypes();
  }, []);

  const fetchEquipmentTypes = async () => {
    try {
      setLoading(true);
      const res = await api.get("/equipment/unique");
      setEquipmentTypes(res.data.uniqueEquipments);
    } catch (err) {
      setError("Error fetching equipment types");
      toast.error("Error fetching equipment types");
    } finally {
      setLoading(false);
    }
  };

  const runForecast = async () => {
    try {
      setForecastLoading(true);
      setError(null);

      // Get a sample equipment ID to run the forecast
      const sampleEquipmentId = equipmentTypes[0]?.equipmentId;
      if (!sampleEquipmentId) {
        throw new Error("No equipment available for forecasting");
      }

      const res = await api.post("/admin/run-forecast", {
        equipmentId: sampleEquipmentId,
      });

      if (res.data.success) {
        setForecastData(res.data.data);
        toast.success("Forecast completed successfully");
      } else {
        throw new Error(res.data.message || "Forecast failed");
      }
    } catch (err: any) {
      setError(err.message || "Error running forecast");
      toast.error(err.message || "Error running forecast");
    } finally {
      setForecastLoading(false);
    }
  };

  const getEquipmentTypeName = (typeId: string): string => {
    const equipment = equipmentTypes.find(
      (eq) => eq.equipmentTypeId === typeId
    );
    return equipment ? equipment.equipmentType.name : typeId;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const getMaxDemand = (data: ForecastData[]): number => {
    return Math.max(...data.map((item) => item.forecastedDemand), 0);
  };

  const getMinDemand = (data: ForecastData[]): number => {
    return Math.min(...data.map((item) => item.forecastedDemand), 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
          <span className="ml-4 text-amber-700">
            Loading equipment types...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-amber-900 flex items-center gap-3">
            <TrendingUp className="h-8 w-8" />
            Demand Forecasting
          </h1>
          <p className="text-amber-700 mt-2">
            Forecasted equipment demand for the next 12 months
          </p>
        </div>

        {/* Controls */}
        <div className="mb-8 bg-white rounded-xl p-6 shadow-sm border border-amber-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold text-amber-900 mb-2">
                Generate Forecast
              </h2>
              <p className="text-amber-600 text-sm">
                Run demand forecasting analysis for all equipment types
              </p>
            </div>
            <button
              onClick={runForecast}
              disabled={forecastLoading}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {forecastLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Running Forecast...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Run Forecast
                </>
              )}
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-500 text-xl">⚠️</span>
              </div>
              <div className="ml-3">
                <p className="text-red-700">{error}</p>
                <button
                  onClick={runForecast}
                  className="mt-2 bg-red-100 text-red-700 px-3 py-1 rounded text-sm hover:bg-red-200"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Forecast Results */}
        {Object.keys(forecastData).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(forecastData).map(([typeId, data]) => {
              const equipmentName = getEquipmentTypeName(typeId);
              const config = equipmentConfig[equipmentName] || {
                emoji: "🏗️",
                color: "text-amber-700",
                bgColor: "bg-amber-100",
                lineColor: "#f59e0b",
              };
              const maxDemand = getMaxDemand(data);
              const minDemand = getMinDemand(data);

              return (
                <div
                  key={typeId}
                  className="bg-white rounded-xl p-6 shadow-sm border border-amber-200"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{config.emoji}</span>
                      <h2 className="text-xl font-semibold text-amber-900">
                        {equipmentName}
                      </h2>
                    </div>
                    <div className="text-right">
                      <p className="text-amber-600 text-sm">Peak Demand</p>
                      <p className="text-2xl font-bold text-amber-800">
                        {maxDemand} units
                      </p>
                    </div>
                  </div>

                  {/* Line Chart */}
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-amber-800 mb-4 flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Monthly Demand Forecast Trend
                    </h3>
                    <div className="bg-amber-50 p-4 rounded-lg">
                      <LineChart
                        data={data}
                        color={config.lineColor}
                        height={250}
                      />
                    </div>
                  </div>

                  {/* Stats Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-amber-100 p-3 rounded-lg text-center">
                      <p className="text-amber-600 text-sm">Average Demand</p>
                      <p className="text-lg font-bold text-amber-800">
                        {Math.round(
                          data.reduce(
                            (sum, item) => sum + item.forecastedDemand,
                            0
                          ) / data.length
                        )}{" "}
                        units
                      </p>
                    </div>
                    <div className="bg-amber-100 p-3 rounded-lg text-center">
                      <p className="text-amber-600 text-sm">Minimum</p>
                      <p className="text-lg font-bold text-amber-800">
                        {minDemand} units
                      </p>
                    </div>
                    <div className="bg-amber-100 p-3 rounded-lg text-center">
                      <p className="text-amber-600 text-sm">Maximum</p>
                      <p className="text-lg font-bold text-amber-800">
                        {maxDemand} units
                      </p>
                    </div>
                    <div className="bg-amber-100 p-3 rounded-lg text-center">
                      <p className="text-amber-600 text-sm">Forecast Period</p>
                      <p className="text-lg font-bold text-amber-800">
                        {data.length} months
                      </p>
                    </div>
                  </div>

                  {/* Data Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-amber-100">
                          <th className="p-3 text-left text-xs font-medium text-amber-900 uppercase">
                            Month
                          </th>
                          <th className="p-3 text-right text-xs font-medium text-amber-900 uppercase">
                            Forecasted Demand
                          </th>
                          <th className="p-3 text-right text-xs font-medium text-amber-900 uppercase">
                            Trend
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((item, index) => {
                          const prevDemand =
                            index > 0 ? data[index - 1].forecastedDemand : null;
                          const trend =
                            prevDemand !== null
                              ? item.forecastedDemand > prevDemand
                                ? "↗️ Increasing"
                                : item.forecastedDemand < prevDemand
                                ? "↘️ Decreasing"
                                : "→ Stable"
                              : "-";

                          return (
                            <tr
                              key={index}
                              className="border-b border-amber-100 even:bg-amber-50"
                            >
                              <td className="p-3 text-amber-800">
                                {formatDate(item.month)}
                              </td>
                              <td className="p-3 text-right font-medium text-amber-900">
                                {item.forecastedDemand} units
                              </td>
                              <td className="p-3 text-right text-sm">
                                {trend}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-xl p-12 text-center border border-amber-200 border-dashed">
            <TrendingUp className="h-16 w-16 text-amber-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-amber-800 mb-2">
              No Forecast Data Available
            </h2>
            <p className="text-amber-600 mb-6">
              Run the forecast analysis to generate demand predictions for your
              equipment
            </p>
            <button
              onClick={runForecast}
              className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg mx-auto"
            >
              <Play className="h-5 w-5" />
              Generate Forecast
            </button>
          </div>
        )}

        {/* Equipment Types Summary */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-amber-900 mb-6 flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Equipment Types
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {equipmentTypes.map((equipment) => {
              const config = equipmentConfig[equipment.equipmentType.name] || {
                emoji: "🏗️",
                color: "text-amber-700",
                bgColor: "bg-amber-100",
                lineColor: "#f59e0b",
              };

              return (
                <div
                  key={equipment.equipmentId}
                  className={`rounded-lg border border-amber-200 ${config.bgColor} p-4 text-center`}
                >
                  <div className="text-2xl mb-2">{config.emoji}</div>
                  <h3 className="font-medium text-amber-900 text-sm">
                    {equipment.equipmentType.name}
                  </h3>
                  <p className="text-xs text-amber-600 mt-1">
                    {equipment.status}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
