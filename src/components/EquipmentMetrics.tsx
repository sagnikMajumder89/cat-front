import { ArrowLeft, BarChart3, Fuel, Clock, Calendar } from "lucide-react";

interface EquipmentMetricsProps {
  equipment: {
    equipmentTypeId: string;
    equipmentTypeName: string;
    totalCount: number;
    rentedCount: number;
    idleCount: number;
    totalRuntimeHours: number;
    totalIdleHours: number;
    totalFuelUsage: number;
  };
  onBack: () => void;
}

export default function EquipmentMetrics({
  equipment,
  onBack,
}: EquipmentMetricsProps) {
  const utilizationRate =
    equipment.totalCount > 0
      ? Math.round((equipment.rentedCount / equipment.totalCount) * 100)
      : 0;

  const availabilityRate =
    equipment.totalCount > 0
      ? Math.round(
          ((equipment.totalCount - equipment.rentedCount) /
            equipment.totalCount) *
            100
        )
      : 0;

  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with back button */}
        <div className="mb-6 flex items-center">
          <button
            onClick={onBack}
            className="flex items-center text-amber-700 hover:text-amber-900 mr-4"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-amber-900">
            {equipment.equipmentTypeName} Analytics
          </h1>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-amber-200">
            <div className="flex items-center mb-2">
              <BarChart3 className="h-5 w-5 text-amber-600 mr-2" />
              <p className="text-amber-600 text-sm">Total Units</p>
            </div>
            <p className="text-2xl font-bold text-amber-800">
              {equipment.totalCount}
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-amber-200">
            <div className="flex items-center mb-2">
              <Calendar className="h-5 w-5 text-amber-600 mr-2" />
              <p className="text-amber-600 text-sm">Rented Units</p>
            </div>
            <p className="text-2xl font-bold text-amber-800">
              {equipment.rentedCount}
            </p>
            <p className="text-xs text-amber-600">
              {utilizationRate}% utilization
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-amber-200">
            <div className="flex items-center mb-2">
              <Clock className="h-5 w-5 text-amber-600 mr-2" />
              <p className="text-amber-600 text-sm">Idle Units</p>
            </div>
            <p className="text-2xl font-bold text-amber-800">
              {equipment.idleCount}
            </p>
            <p className="text-xs text-amber-600">
              {availabilityRate}% available
            </p>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-amber-200">
            <div className="flex items-center mb-2">
              <Fuel className="h-5 w-5 text-amber-600 mr-2" />
              <p className="text-amber-600 text-sm">Total Fuel Usage</p>
            </div>
            <p className="text-2xl font-bold text-amber-800">
              {equipment.totalFuelUsage} L
            </p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Utilization Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-200">
            <h2 className="text-lg font-semibold text-amber-900 mb-4">
              Utilization Distribution
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-amber-700">Rented</span>
                <span className="text-sm font-medium text-amber-800">
                  {equipment.rentedCount} units
                </span>
              </div>
              <div className="w-full bg-amber-200 rounded-full h-4">
                <div
                  className="bg-amber-600 h-4 rounded-full transition-all duration-700"
                  style={{ width: `${utilizationRate}%` }}
                ></div>
              </div>

              <div className="flex justify-between items-center mt-4">
                <span className="text-sm text-amber-700">Available</span>
                <span className="text-sm font-medium text-amber-800">
                  {equipment.idleCount} units
                </span>
              </div>
              <div className="w-full bg-amber-200 rounded-full h-4">
                <div
                  className="bg-amber-400 h-4 rounded-full transition-all duration-700 delay-300"
                  style={{ width: `${availabilityRate}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Runtime vs Idle Time */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-200">
            <h2 className="text-lg font-semibold text-amber-900 mb-4">
              Operating Hours
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-amber-700">Runtime Hours</span>
                  <span className="text-sm font-medium text-amber-800">
                    {equipment.totalRuntimeHours}h
                  </span>
                </div>
                <div className="w-full bg-amber-200 rounded-full h-3">
                  <div
                    className="bg-amber-600 h-3 rounded-full transition-all duration-700"
                    style={{
                      width: equipment.totalRuntimeHours > 0 ? "70%" : "0%",
                    }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-amber-700">Idle Hours</span>
                  <span className="text-sm font-medium text-amber-800">
                    {equipment.totalIdleHours}h
                  </span>
                </div>
                <div className="w-full bg-amber-200 rounded-full h-3">
                  <div
                    className="bg-amber-400 h-3 rounded-full transition-all duration-700 delay-300"
                    style={{
                      width: equipment.totalIdleHours > 0 ? "30%" : "0%",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-amber-200">
          <h2 className="text-lg font-semibold text-amber-900 mb-4">
            Performance Metrics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-amber-50 rounded-lg">
              <p className="text-amber-600 text-sm">Average Runtime per Unit</p>
              <p className="text-xl font-bold text-amber-800">
                {equipment.rentedCount > 0
                  ? Math.round(
                      equipment.totalRuntimeHours / equipment.rentedCount
                    )
                  : 0}{" "}
                hours
              </p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg">
              <p className="text-amber-600 text-sm">Average Fuel Consumption</p>
              <p className="text-xl font-bold text-amber-800">
                {equipment.rentedCount > 0
                  ? Math.round(equipment.totalFuelUsage / equipment.rentedCount)
                  : 0}{" "}
                L per unit
              </p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg">
              <p className="text-amber-600 text-sm">Fuel Efficiency</p>
              <p className="text-xl font-bold text-amber-800">
                {equipment.totalRuntimeHours > 0
                  ? Math.round(
                      (equipment.totalFuelUsage / equipment.totalRuntimeHours) *
                        100
                    ) / 100
                  : 0}{" "}
                L/hour
              </p>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg">
              <p className="text-amber-600 text-sm">Availability Rate</p>
              <p className="text-xl font-bold text-amber-800">
                {availabilityRate}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
