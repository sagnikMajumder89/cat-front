import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Fuel,
  Gauge,
  MapPin,
  Wrench,
  Zap,
  Filter,
  X,
  BarChart3,
  Navigation,
} from "lucide-react";
import api from "@/api/axios";

// Types based on your schema
const AnomalyStatus = {
  UNRESOLVED: "UNRESOLVED",
  RESOLVED: "RESOLVED",
} as const;
type AnomalyStatus = (typeof AnomalyStatus)[keyof typeof AnomalyStatus];

const AnomalyType = {
  POOR_WORKING_TO_IDLE_RATIO: "POOR_WORKING_TO_IDLE_RATIO",
  HIGH_FUEL_BURN_RATE: "HIGH_FUEL_BURN_RATE",
  SLOW_CYCLE_TIME: "SLOW_CYCLE_TIME",
  GEOFENCE_BREACH: "GEOFENCE_BREACH",
  AFTER_HOURS_OPERATION: "AFTER_HOURS_OPERATION",
  SUDDEN_FUEL_DROP: "SUDDEN_FUEL_DROP",
  HIGH_ENGINE_TEMP: "HIGH_ENGINE_TEMP",
  FREQUENT_DIAGNOSTIC_ERRORS: "FREQUENT_DIAGNOSTIC_ERRORS",
  MISSED_MAINTENANCE_WINDOW: "MISSED_MAINTENANCE_WINDOW",
} as const;
type AnomalyType = (typeof AnomalyType)[keyof typeof AnomalyType];

const AnomalySeverity = {
  LOW: "LOW",
  MEDIUM: "MEDIUM",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
} as const;
type AnomalySeverity = (typeof AnomalySeverity)[keyof typeof AnomalySeverity];

interface AnomalyLog {
  id: string;
  timestamp: string;
  anomalyType: AnomalyType;
  severity: AnomalySeverity;
  status: AnomalyStatus;
  details: any;
  lineItemId: string;
}

const AnomalyDashboard = () => {
  const [anomalies, setAnomalies] = useState<AnomalyLog[]>([]);
  const [filteredAnomalies, setFilteredAnomalies] = useState<AnomalyLog[]>([]);
  const [selectedSeverity, setSelectedSeverity] = useState<
    AnomalySeverity | "ALL"
  >("ALL");
  const [selectedType, setSelectedType] = useState<AnomalyType | "ALL">("ALL");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnomalies = async () => {
      setIsLoading(true);
      try {
        const res = await api.get("/anomalies/fetch-unresolved");
        setAnomalies(res.data);
        setFilteredAnomalies(res.data);
      } catch (error) {
        toast.error("Failed to fetch anomalies");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnomalies();
  }, []);

  useEffect(() => {
    let filtered = anomalies;

    if (selectedSeverity !== "ALL") {
      filtered = filtered.filter(
        (anomaly) => anomaly.severity === selectedSeverity
      );
    }

    if (selectedType !== "ALL") {
      filtered = filtered.filter(
        (anomaly) => anomaly.anomalyType === selectedType
      );
    }

    setFilteredAnomalies(filtered);
  }, [selectedSeverity, selectedType, anomalies]);

  const resolveAnomaly = async (id: string) => {
    try {
      await api.put(`/anomalies/mark-resolved/${id}`);
      setAnomalies((prev) =>
        prev.map((anomaly) =>
          anomaly.id === id
            ? { ...anomaly, status: AnomalyStatus.RESOLVED }
            : anomaly
        )
      );
      toast.success("Anomaly marked as resolved");
    } catch (error) {
      toast.error("Failed to resolve anomaly");
    }
  };

  const getAnomalyIcon = (type: AnomalyType) => {
    switch (type) {
      case AnomalyType.POOR_WORKING_TO_IDLE_RATIO:
        return <BarChart3 className="h-5 w-5" />;
      case AnomalyType.HIGH_FUEL_BURN_RATE:
        return <Fuel className="h-5 w-5" />;
      case AnomalyType.SLOW_CYCLE_TIME:
        return <Clock className="h-5 w-5" />;
      case AnomalyType.GEOFENCE_BREACH:
        return <MapPin className="h-5 w-5" />;
      case AnomalyType.AFTER_HOURS_OPERATION:
        return <Clock className="h-5 w-5" />;
      case AnomalyType.SUDDEN_FUEL_DROP:
        return <Fuel className="h-5 w-5" />;
      case AnomalyType.HIGH_ENGINE_TEMP:
        return <Zap className="h-5 w-5" />;
      case AnomalyType.FREQUENT_DIAGNOSTIC_ERRORS:
        return <Gauge className="h-5 w-5" />;
      case AnomalyType.MISSED_MAINTENANCE_WINDOW:
        return <Wrench className="h-5 w-5" />;
      default:
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getSeverityColor = (severity: AnomalySeverity) => {
    switch (severity) {
      case AnomalySeverity.LOW:
        return "bg-blue-100 text-blue-800 border-blue-200";
      case AnomalySeverity.MEDIUM:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case AnomalySeverity.HIGH:
        return "bg-orange-100 text-orange-800 border-orange-200";
      case AnomalySeverity.CRITICAL:
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getAnomalyTypeLabel = (type: AnomalyType) => {
    return type
      .split("_")
      .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
      .join(" ");
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d ago`;
    if (diffHours > 0) return `${diffHours}h ago`;
    return `${diffMins}m ago`;
  };

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openGoogleMaps = (lat: number, long: number) => {
    window.open(`https://www.google.com/maps?q=${lat},${long}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
          <span className="ml-4 text-amber-700">Loading anomalies...</span>
        </div>
      </div>
    );
  }

  const unresolvedAnomalies = anomalies.filter(
    (a) => a.status === AnomalyStatus.UNRESOLVED
  );
  const highSeverityCount = unresolvedAnomalies.filter(
    (a) =>
      a.severity === AnomalySeverity.HIGH ||
      a.severity === AnomalySeverity.CRITICAL
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-amber-900 flex items-center gap-3">
            <AlertTriangle className="h-8 w-8" />
            Anomaly Detection Dashboard
          </h1>
          <p className="text-amber-700 mt-2">
            Monitor and resolve equipment performance issues in real-time
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm">Total Anomalies</p>
                <p className="text-2xl font-bold text-amber-800">
                  {unresolvedAnomalies.length}
                </p>
              </div>
              <div className="p-3 bg-amber-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm">High Priority</p>
                <p className="text-2xl font-bold text-amber-800">
                  {highSeverityCount}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm">Geofence Breaches</p>
                <p className="text-2xl font-bold text-amber-800">
                  {
                    unresolvedAnomalies.filter(
                      (a) => a.anomalyType === AnomalyType.GEOFENCE_BREACH
                    ).length
                  }
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <MapPin className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-600 text-sm">Equipment Issues</p>
                <p className="text-2xl font-bold text-amber-800">
                  {
                    unresolvedAnomalies.filter((a) =>
                      (
                        [
                          AnomalyType.HIGH_ENGINE_TEMP,
                          AnomalyType.SUDDEN_FUEL_DROP,
                          AnomalyType.FREQUENT_DIAGNOSTIC_ERRORS,
                        ] as AnomalyType[]
                      ).includes(a.anomalyType)
                    ).length
                  }
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Gauge className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-amber-200 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-amber-600" />
              <span className="text-amber-800 font-medium">Filters:</span>
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={selectedSeverity}
                onChange={(e) =>
                  setSelectedSeverity(e.target.value as AnomalySeverity | "ALL")
                }
                className="px-3 py-2 border border-amber-200 rounded-lg text-amber-800 bg-amber-50"
              >
                <option value="ALL">All Severities</option>
                <option value={AnomalySeverity.LOW}>Low</option>
                <option value={AnomalySeverity.MEDIUM}>Medium</option>
                <option value={AnomalySeverity.HIGH}>High</option>
                <option value={AnomalySeverity.CRITICAL}>Critical</option>
              </select>

              <select
                value={selectedType}
                onChange={(e) =>
                  setSelectedType(e.target.value as AnomalyType | "ALL")
                }
                className="px-3 py-2 border border-amber-200 rounded-lg text-amber-800 bg-amber-50"
              >
                <option value="ALL">All Types</option>
                {Object.values(AnomalyType).map((type) => (
                  <option key={type} value={type}>
                    {getAnomalyTypeLabel(type)}
                  </option>
                ))}
              </select>

              {(selectedSeverity !== "ALL" || selectedType !== "ALL") && (
                <button
                  onClick={() => {
                    setSelectedSeverity("ALL");
                    setSelectedType("ALL");
                  }}
                  className="flex items-center gap-1 px-3 py-2 text-amber-600 hover:text-amber-800"
                >
                  <X className="h-4 w-4" />
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Anomalies List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-amber-900 mb-4">
            Unresolved Anomalies (
            {
              filteredAnomalies.filter(
                (a) => a.status === AnomalyStatus.UNRESOLVED
              ).length
            }
            )
          </h2>

          {filteredAnomalies.filter(
            (a) => a.status === AnomalyStatus.UNRESOLVED
          ).length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center border border-amber-200">
              <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-amber-800 mb-2">
                No unresolved anomalies!
              </h3>
              <p className="text-amber-600">
                All issues have been resolved. Great job!
              </p>
            </div>
          ) : (
            filteredAnomalies
              .filter((anomaly) => anomaly.status === AnomalyStatus.UNRESOLVED)
              .map((anomaly) => (
                <div
                  key={anomaly.id}
                  className="bg-white rounded-xl p-6 shadow-lg border-l-4 border-amber-400 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Icon and Severity */}
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-amber-100 rounded-full">
                        {getAnomalyIcon(anomaly.anomalyType)}
                      </div>
                      <div>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(
                            anomaly.severity
                          )} border`}
                        >
                          {anomaly.severity}
                        </span>
                        <p className="text-sm text-amber-600 mt-1">
                          {formatTimeAgo(anomaly.timestamp)}
                        </p>
                        <p className="text-xs text-amber-500">
                          {formatDateTime(anomaly.timestamp)}
                        </p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-amber-900 mb-2">
                        {getAnomalyTypeLabel(anomaly.anomalyType)}
                      </h3>

                      <div className="mb-4">
                        <p className="text-sm text-amber-600">Line Item ID</p>
                        <p className="font-medium text-amber-800">
                          {anomaly.lineItemId}
                        </p>
                      </div>

                      {/* Details based on anomaly type */}
                      <div className="bg-amber-50 rounded-lg p-4 mb-4">
                        <h4 className="text-sm font-medium text-amber-800 mb-2">
                          Details
                        </h4>
                        <div className="text-sm text-amber-700 space-y-2">
                          {anomaly.anomalyType ===
                            AnomalyType.GEOFENCE_BREACH && (
                            <>
                              <p>
                                Site:{" "}
                                <span className="font-bold">
                                  {anomaly.details.site}
                                </span>
                              </p>
                              <div className="flex items-center gap-2">
                                <p>Location: </p>
                                <button
                                  onClick={() =>
                                    openGoogleMaps(
                                      anomaly.details.lastKnownLocation.lat,
                                      anomaly.details.lastKnownLocation.long
                                    )
                                  }
                                  className="flex items-center gap-1 text-amber-700 hover:text-amber-900 font-medium"
                                >
                                  <Navigation className="h-4 w-4" />
                                  {anomaly.details.lastKnownLocation.lat.toFixed(
                                    4
                                  )}
                                  ° N,
                                  {anomaly.details.lastKnownLocation.long.toFixed(
                                    4
                                  )}
                                  ° W
                                </button>
                              </div>
                            </>
                          )}
                          {anomaly.anomalyType ===
                            AnomalyType.AFTER_HOURS_OPERATION && (
                            <>
                              <p>
                                Event Time:{" "}
                                <span className="font-bold">
                                  {formatDateTime(anomaly.details.eventTime)}
                                </span>
                              </p>
                              <p>
                                Detected:{" "}
                                <span className="font-bold">
                                  {formatTimeAgo(anomaly.details.eventTime)}
                                </span>
                              </p>
                            </>
                          )}
                          {anomaly.anomalyType ===
                            AnomalyType.SUDDEN_FUEL_DROP && (
                            <>
                              <p>
                                Fuel Drop:{" "}
                                <span className="font-bold">
                                  {anomaly.details.fromLevel}L →{" "}
                                  {anomaly.details.toLevel}L
                                </span>
                              </p>
                              <p>
                                Drop Percentage:{" "}
                                <span className="font-bold">
                                  {(
                                    ((anomaly.details.fromLevel -
                                      anomaly.details.toLevel) /
                                      anomaly.details.fromLevel) *
                                    100
                                  ).toFixed(1)}
                                  %
                                </span>
                              </p>
                            </>
                          )}
                          {anomaly.anomalyType ===
                            AnomalyType.HIGH_ENGINE_TEMP && (
                            <>
                              <p>
                                Current Temperature:{" "}
                                <span className="font-bold text-red-600">
                                  {anomaly.details.temperature}°C
                                </span>
                              </p>
                              <p>
                                Threshold:{" "}
                                <span className="font-bold">
                                  {anomaly.details.threshold}°C
                                </span>
                              </p>
                              <p>
                                Exceeded by:{" "}
                                <span className="font-bold">
                                  {anomaly.details.temperature -
                                    anomaly.details.threshold}
                                  °C
                                </span>
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center justify-center lg:justify-end">
                      <button
                        onClick={() => resolveAnomaly(anomaly.id)}
                        className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-lg transition-colors"
                      >
                        <CheckCircle className="h-5 w-5" />
                        Mark as Resolved
                      </button>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AnomalyDashboard;
