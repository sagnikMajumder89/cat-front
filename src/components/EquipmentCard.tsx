import { format } from "date-fns";
import { QRCodeCanvas } from "qrcode.react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import api from "@/api/axios";

interface EquipmentItem {
  lineItemId: string;
  equipment: {
    equipmentType: {
      name: string;
    };
    status: string;
  };
  startDate: string;
  endDate: string;
}

interface EquipmentCardProps {
  item: EquipmentItem;
  overdue: boolean;
}

const EquipmentCard = ({ item, overdue }: EquipmentCardProps) => {
  const [loading, setLoading] = useState(false);

  const checkOut = async () => {
    try {
      setLoading(true);
      await api.post("/contract/checkout", {
        lineItemId: item.lineItemId,
      });
      toast.success("Equipment checked out successfully");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      toast.error("Error checking out equipment");
    } finally {
      setLoading(false);
    }
  };

  const checkIn = async () => {
    try {
      setLoading(true);
      await api.post("/contract/checkin", {
        lineItemId: item.lineItemId,
      });
      toast.success("Equipment checked in successfully");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      toast.error("Error checking in equipment");
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = () => {
    if (!item.startDate) return <CheckCircle className="h-4 w-4" />;
    if (item.startDate && !item.endDate && !overdue)
      return <Clock className="h-4 w-4" />;
    if (overdue) return <AlertTriangle className="h-4 w-4" />;
    return <XCircle className="h-4 w-4" />;
  };

  const getStatusVariant = () => {
    if (!item.startDate) return "secondary";
    if (item.startDate && !item.endDate && !overdue) return "default";
    if (overdue) return "destructive";
    return "outline";
  };

  const getStatusText = () => {
    if (!item.startDate) return "Ready for Checkout";
    if (item.startDate && !item.endDate && !overdue) return "Checked Out";
    if (overdue) return "Overdue";
    return "Returned";
  };

  return (
    <Card
      key={item.lineItemId}
      className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 overflow-hidden transition-all hover:shadow-lg"
    >
      <CardHeader className="pb-3 bg-amber-200/30">
        <div className="flex justify-between items-start">
          <CardTitle className="text-amber-900 text-lg flex items-center gap-2">
            {item.equipment.equipmentType.name}
            <Badge
              variant={getStatusVariant()}
              className="flex items-center gap-1"
            >
              {getStatusIcon()}
              {getStatusText()}
            </Badge>
          </CardTitle>
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <QRCodeCanvas
              value={item.lineItemId}
              size={60}
              className="rounded"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Equipment Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-800">
              <Calendar className="h-4 w-4 text-amber-600" />
              <span className="text-sm">
                {format(new Date(item.startDate), "dd MMM yyyy")} -{" "}
                {format(new Date(item.endDate), "dd MMM yyyy")}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-amber-500/10 text-amber-700 border-amber-300"
              >
                ID: {item.lineItemId.slice(0, 8)}...
              </Badge>
              <Badge
                variant="outline"
                className="bg-amber-500/10 text-amber-700 border-amber-300"
              >
                {item.equipment.status}
              </Badge>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            {/* If not checked out yet */}
            {!item.startDate && (
              <Button
                className="bg-amber-600 hover:bg-amber-700 text-white w-full flex items-center gap-2"
                onClick={checkOut}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Check Out
                  </>
                )}
              </Button>
            )}

            {/* If checked out but not checked in */}
            {item.startDate && !item.endDate && !overdue && (
              <Button
                className="bg-amber-800 hover:bg-amber-900 text-white w-full flex items-center gap-2"
                onClick={checkIn}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <XCircle className="h-4 w-4" />
                    Check In
                  </>
                )}
              </Button>
            )}

            {/* If overdue */}
            {overdue && (
              <>
                <Button
                  variant="destructive"
                  className="w-full flex items-center gap-2"
                >
                  <AlertTriangle className="h-4 w-4" />
                  Notify Client (Overdue)
                </Button>
                <Button
                  variant="outline"
                  className="text-amber-700 border-amber-300 hover:bg-amber-200"
                >
                  Extend Rental
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EquipmentCard;
