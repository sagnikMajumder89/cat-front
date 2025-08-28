import React, { useState } from "react";
import AssetDetailsOverlay from "./AssetDetailsOverlay";

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

const sampleAssets: Asset[] = [
  {
    id: 1,
    type: "Excavator",
    startDate: "2025-08-01",
    endDate: "2025-08-20",
    totalEngineHours: 120,
    downtimeHours: 10,
    fuelUsage: 450,
    operatingDays: 15,
    lastOperator: "OP-101",
  },
  {
    id: 2,
    type: "Bulldozer",
    startDate: "2025-07-10",
    endDate: "2025-08-05",
    totalEngineHours: 90,
    downtimeHours: 5,
    fuelUsage: 300,
    operatingDays: 12,
    lastOperator: "OP-202",
  },
];

const AssetTable: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  return (
    <div className="container mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-amber-900 mb-4">
        Asset Status Overview
      </h2>
      <div className="overflow-x-auto shadow-lg rounded-xl border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-amber-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                Start Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                End Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                Engine Hours
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                Downtime (hrs)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                Fuel Usage (L)
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                Operating Days
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">
                Last Operator
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {sampleAssets.map((asset) => (
              <tr
                key={asset.id}
                className="hover:bg-amber-50 transition-colors"
                onClick={() => setSelectedAsset(asset)}
              >
                <td className="px-4 py-3 whitespace-nowrap text-gray-800">
                  {asset.id}
                </td>
                <td className="px-4 py-3 whitespace-nowrap font-medium text-amber-900">
                  {asset.type}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  {asset.startDate}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">{asset.endDate}</td>
                <td className="px-4 py-3 text-center">
                  {asset.totalEngineHours}
                </td>
                <td className="px-4 py-3 text-center">{asset.downtimeHours}</td>
                <td className="px-4 py-3 text-center">{asset.fuelUsage}</td>
                <td className="px-4 py-3 text-center">{asset.operatingDays}</td>
                <td className="px-4 py-3 text-center">{asset.lastOperator}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
