import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { useParams } from "react-router";
import { toast } from "react-toastify";
import api from "@/api/axios";
import EquipmentCard from "@/components/EquipmentCard";

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

const ContractDetails: React.FC = () => {
  const { id } = useParams();
  const [contract, setContract] = React.useState<Contract | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  const today = new Date();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get(`/contract/${id}`);
        setContract(res.data);
      } catch (err) {
        setError("Failed to fetch contract details.");
        toast.error("Failed to fetch contract details.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="text-red-500 w-full justify-center items-center">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Contract Info */}
      <Card className="bg-amber-50 border-amber-200">
        <CardHeader>
          <CardTitle className="text-amber-900">Contract Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-amber-800">
          <p>
            <strong>Contract ID:</strong> {contract!.contractId}
          </p>
          <p>
            <strong>Site ID:</strong> {contract!.siteId}
          </p>
          <p>
            <strong>Duration:</strong>{" "}
            {format(new Date(contract!.startDate), "dd MMM yyyy")} -{" "}
            {format(new Date(contract!.endDate), "dd MMM yyyy")}
          </p>
          <p>
            <strong>Client:</strong> {contract!.client.name} (
            {contract!.client.email}, {contract!.client.phone})
          </p>
        </CardContent>
      </Card>

      {/* Line Items */}
      <div className="space-y-4">
        {contract!.lineItems.map((item: any) => {
          const overdue = !item.endDate && new Date(contract!.endDate) < today;

          return (
            <EquipmentCard
              key={item.lineItemId}
              item={item}
              overdue={overdue}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ContractDetails;
