import { X } from "lucide-react";

interface EquipmentMetric {
  equipmentId: string;
  status: string;
  equipmentTypeId: string;
  equipmentType: {
    name: string;
  };
  lineItems: Array<{
    lineItemId: string;
    startDate: string;
    endDate: string;
    totalEngineHours: number | null;
    fuelUsage: number | null;
    downtimeHours: number | null;
    operatingDays: number | null;
    contractId: string;
    equipmentId: string;
    lastOperatorId: string;
    usage: {
      id: string;
      totalEngineHours: number;
      totalIdleHours: number;
      fuelConsumed: number;
      workingHours: number;
      workingToIdleRatio: number;
      fuelBurnRate: number;
      distanceTraveled: number;
      payloadMovedTonnes: number;
      avgCycleTimeSeconds: number;
      lineItemId: string;
    } | null;
  }>;
}

interface AssetDetailsOverlayProps {
  asset: EquipmentMetric;
  onClose: () => void;
}

const AssetDetailsOverlay: React.FC<AssetDetailsOverlayProps> = ({
  asset,
  onClose,
}) => {
  const activeLineItem = asset.lineItems.find((li) => li.usage !== null);
  const usage = activeLineItem?.usage;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-amber-900">
            Equipment Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-amber-800">
              Basic Information
            </h3>
            <div className="space-y-1">
              <p>
                <span className="font-medium">Equipment ID:</span>{" "}
                {asset.equipmentId}
              </p>
              <p>
                <span className="font-medium">Type:</span>{" "}
                {asset.equipmentType.name}
              </p>
              <p>
                <span className="font-medium">Status:</span> {asset.status}
              </p>
              {activeLineItem && (
                <>
                  <p>
                    <span className="font-medium">Contract ID:</span>{" "}
                    {activeLineItem.contractId}
                  </p>
                  <p>
                    <span className="font-medium">Line Item ID:</span>{" "}
                    {activeLineItem.lineItemId}
                  </p>
                  <p>
                    <span className="font-medium">Last Operator:</span>{" "}
                    {activeLineItem.lastOperatorId}
                  </p>
                </>
              )}
            </div>
          </div>

          {activeLineItem && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-amber-800">
                Rental Period
              </h3>
              <div className="space-y-1">
                <p>
                  <span className="font-medium">Start Date:</span>{" "}
                  {formatDate(activeLineItem.startDate)}
                </p>
                <p>
                  <span className="font-medium">End Date:</span>{" "}
                  {formatDate(activeLineItem.endDate)}
                </p>
                <p>
                  <span className="font-medium">Duration:</span>{" "}
                  {Math.ceil(
                    (new Date(activeLineItem.endDate).getTime() -
                      new Date(activeLineItem.startDate).getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}{" "}
                  days
                </p>
              </div>
            </div>
          )}
        </div>

        {usage ? (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-amber-800">
              Usage Metrics
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-amber-600 text-sm">Total Engine Hours</p>
                <p className="text-2xl font-bold text-amber-800">
                  {usage.totalEngineHours.toFixed(1)}
                </p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-amber-600 text-sm">Idle Hours</p>
                <p className="text-2xl font-bold text-amber-800">
                  {usage.totalIdleHours.toFixed(1)}
                </p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-amber-600 text-sm">Working Hours</p>
                <p className="text-2xl font-bold text-amber-800">
                  {usage.workingHours.toFixed(1)}
                </p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-amber-600 text-sm">Fuel Consumed</p>
                <p className="text-2xl font-bold text-amber-800">
                  {usage.fuelConsumed.toFixed(1)} L
                </p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-amber-600 text-sm">Working to Idle Ratio</p>
                <p className="text-2xl font-bold text-amber-800">
                  {usage.workingToIdleRatio.toFixed(1)}%
                </p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-amber-600 text-sm">Fuel Burn Rate</p>
                <p className="text-2xl font-bold text-amber-800">
                  {usage.fuelBurnRate.toFixed(1)} L/h
                </p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-amber-600 text-sm">Payload Moved</p>
                <p className="text-2xl font-bold text-amber-800">
                  {usage.payloadMovedTonnes.toFixed(1)} tonnes
                </p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-amber-600 text-sm">Distance Traveled</p>
                <p className="text-2xl font-bold text-amber-800">
                  {usage.distanceTraveled.toFixed(1)} km
                </p>
              </div>
              <div className="bg-amber-50 p-4 rounded-lg">
                <p className="text-amber-600 text-sm">Avg Cycle Time</p>
                <p className="text-2xl font-bold text-amber-800">
                  {usage.avgCycleTimeSeconds.toFixed(1)}s
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-amber-600">
            <p>No usage data available for this equipment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetDetailsOverlay;
