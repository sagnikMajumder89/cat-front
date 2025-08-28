import React, { useState, useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import api from "../api/axios";

interface EquipmentType {
  id: string;
  name: string;
}

interface Asset {
  equipmentId: string;
  status: string;
  equipmentTypeId: string;
  equipmentType: EquipmentType;
}

const AssetPage: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/equipment");
      setAssets(response.data.equipmentList);
    } catch (err) {
      console.error("Error fetching assets:", err);
      setError("Failed to load assets. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-amber-900 mb-4">Asset Status</h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
          <span className="ml-4 text-amber-700">Loading assets...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
                <button
                  onClick={fetchAssets}
                  className="ml-2 bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200 text-sm"
                >
                  Retry
                </button>
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-amber-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase">
                  Equipment ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase">
                  Type
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-amber-900 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-amber-900 uppercase">
                  Equipment Type
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {assets.length > 0 ? (
                assets.map((asset) => (
                  <tr
                    key={asset.equipmentId}
                    className="hover:bg-amber-50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-amber-900">
                      {asset.equipmentId}
                    </td>
                    <td className="px-4 py-3">{asset.equipmentType.name}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          asset.status === "rented"
                            ? "bg-green-100 text-green-800"
                            : asset.status !== "maintenance"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {asset.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {asset.equipmentTypeId}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No assets found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AssetPage;
