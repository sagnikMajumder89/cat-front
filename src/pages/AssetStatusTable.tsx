import React, { useEffect, useState } from "react";
import AssetDetailsOverlay from "./AssetDetailsOverlay";
import { toast } from "react-toastify";
import api from "@/api/axios";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Usage {
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
}

interface LineItem {
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
  usage: Usage | null;
}

interface EquipmentMetric {
  equipmentId: string;
  status: string;
  equipmentTypeId: string;
  equipmentType: {
    name: string;
  };
  lineItems: LineItem[];
}

interface ApiResponse {
  equipmentMetrics: EquipmentMetric[];
}

const AssetTable: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState<EquipmentMetric | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [equipmentMetrics, setEquipmentMetrics] = useState<EquipmentMetric[]>(
    []
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await api.get<ApiResponse>("/equipment/metrics");
        setEquipmentMetrics(res.data.equipmentMetrics);
      } catch (err) {
        toast.error("Failed to fetch asset data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Get current items for pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = equipmentMetrics.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(equipmentMetrics.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      available: { color: "bg-green-100 text-green-800", label: "Available" },
      rented: { color: "bg-blue-100 text-blue-800", label: "Rented" },
      maintenance: {
        color: "bg-yellow-100 text-yellow-800",
        label: "Maintenance",
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      color: "bg-gray-100 text-gray-800",
      label: status,
    };

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
          <span className="ml-4 text-amber-700">Loading asset metrics...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-amber-900 mb-4">Asset Metrics</h2>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-amber-200">
          <p className="text-amber-600 text-sm">Total Equipment</p>
          <p className="text-2xl font-bold text-amber-800">
            {equipmentMetrics.length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-amber-200">
          <p className="text-amber-600 text-sm">Rented</p>
          <p className="text-2xl font-bold text-amber-800">
            {equipmentMetrics.filter((eq) => eq.status === "rented").length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-amber-200">
          <p className="text-amber-600 text-sm">Available</p>
          <p className="text-2xl font-bold text-amber-800">
            {equipmentMetrics.filter((eq) => eq.status === "available").length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-amber-200">
          <p className="text-amber-600 text-sm">Maintenance</p>
          <p className="text-2xl font-bold text-amber-800">
            {
              equipmentMetrics.filter((eq) => eq.status === "maintenance")
                .length
            }
          </p>
        </div>
      </div>

      <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-amber-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                Equipment ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                Engine Hours
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                Idle Hours
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                Fuel Used (L)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                Working Ratio
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                Payload Moved (T)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                Last Operator
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {currentItems.map((equipment) => {
              const activeLineItem = equipment.lineItems.find(
                (li) => li.usage !== null
              );
              const usage = activeLineItem?.usage;

              return (
                <tr
                  key={equipment.equipmentId}
                  className="hover:bg-amber-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedAsset(equipment)}
                >
                  <td className="px-4 py-3 whitespace-nowrap text-gray-800 font-medium">
                    {equipment.equipmentId}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-amber-900">
                    {equipment.equipmentType.name}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {getStatusBadge(equipment.status)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {usage ? usage.totalEngineHours.toFixed(1) : "-"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {usage ? usage.totalIdleHours.toFixed(1) : "-"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {usage ? usage.fuelConsumed.toFixed(1) : "-"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {usage ? `${usage.workingToIdleRatio.toFixed(1)}%` : "-"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {usage ? usage.payloadMovedTonnes.toFixed(1) : "-"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {activeLineItem?.lastOperatorId || "-"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {equipmentMetrics.length > itemsPerPage && (
        <div className="flex justify-between items-center mt-4 bg-white p-4 rounded-lg border border-amber-200">
          <div className="text-sm text-amber-700">
            Showing {indexOfFirstItem + 1} to{" "}
            {Math.min(indexOfLastItem, equipmentMetrics.length)} of{" "}
            {equipmentMetrics.length} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg border border-amber-200 ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-amber-700 hover:bg-amber-50"
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <span className="text-sm text-amber-700">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg border border-amber-200 ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-amber-700 hover:bg-amber-50"
              }`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {selectedAsset && (
        <AssetDetailsOverlay
          asset={selectedAsset}
          onClose={() => setSelectedAsset(null)}
        />
      )}
    </div>
  );
};

export default AssetTable;
