"use client";

import { useEffect, useState } from "react";
import api from "../api/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

interface Client {
  clientId: string;
  name: string;
  email: string;
  phone: string;
}

interface EquipmentType {
  id: string;
  name: string;
}

interface Equipment {
  equipmentId: string;
  status: string;
  equipmentTypeId: string;
  equipmentType: EquipmentType;
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
  equipment: Equipment;
}

interface Contract {
  contractId: string;
  siteId: string;
  startDate: string;
  endDate: string;
  clientId: string;
  client: Client;
  lineItems: LineItem[];
}

export default function ContractsPage() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    fetchContracts();
  }, [page]);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      const res = await api.get<Contract[]>("/contract");
      // simulate backend pagination by slicing
      const start = (page - 1) * 10;
      const end = start + 10;
      setContracts(res.data.slice(start, end));
    } catch (err) {
      console.error("Failed to fetch contracts:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Contracts</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contracts.map((contract) => (
            <Card
              key={contract.contractId}
              className="shadow-md cursor-pointer hover:shadow-lg transition"
              onClick={() => {
                navigate(`/contract/${contract.contractId}`);
              }}
            >
              <CardHeader>
                <CardTitle>
                  Contract #{contract.contractId} — {contract.siteId}
                </CardTitle>
                <p className="text-sm text-gray-500">
                  {new Date(contract.startDate).toLocaleDateString()} →{" "}
                  {new Date(contract.endDate).toLocaleDateString()}
                </p>
              </CardHeader>
              <CardContent>
                <div className="mb-2">
                  <strong>Client:</strong> {contract.client.name} (
                  {contract.client.email})
                </div>
                <div>
                  <strong>Equipments:</strong>
                  <ul className="list-disc ml-5">
                    {contract.lineItems.map((li) => (
                      <li key={li.lineItemId}>
                        {li.equipment.equipmentType.name} — Status:{" "}
                        {li.equipment.status}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-between mt-6">
        <Button
          variant="outline"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span className="self-center">Page {page}</span>
        <Button
          variant="outline"
          onClick={() => setPage((p) => p + 1)}
          disabled={contracts.length < 10}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
