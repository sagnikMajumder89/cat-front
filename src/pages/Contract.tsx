"use client";
import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import api from "../api/axios";

interface Client {
  clientId: string;
  name: string;
  email: string;
  phone: string;
}

interface Equipment {
  equipmentId: string;
  status: string;
  equipmentTypeId: string;
  equipmentType: {
    name: string;
  };
}

interface LineItem {
  equipmentType: string;
  quantity: number;
}

interface ContractForm {
  clientId: string;
  siteId: string;
  startDate: string;
  endDate: string;
  lineItems: LineItem[];
}

interface ContractLineItem {
  lineItemId: string;
  equipmentId: string;
  startDate: string;
  endDate: string;
  totalEngineHours: number | null;
  fuelUsage: number | null;
  downtimeHours: number | null;
  operatingDays: number | null;
  lastOperatorId: string | null;
}

interface Option {
  type: string;
  availableQuantity?: number;
  waitlistQuantity?: number;
}

// Define the response types
type ContractResponse =
  | {
      status: "CREATED";
      contract: {
        contractId: string;
        siteId: string;
        startDate: string;
        endDate: string;
        clientId: string;
        lineItems: ContractLineItem[];
      };
    }
  | {
      status: "PARTIALLY_AVAILABLE";
      message: string;
      options: Option[];
    }
  | {
      status: "UNAVAILABLE";
      message: string;
      suggestions: Array<{
        type: string;
        nextAvailableDate?: string;
      }>;
    };

const CreateContract: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [availableEquipment, setAvailableEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(false);
  const [clientSearch, setClientSearch] = useState("");
  const [showClientDropdown, setShowClientDropdown] = useState(false);
  const [contractResponse, setContractResponse] =
    useState<ContractResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [equipmentTypes, setEquipmentTypes] = useState<string[]>([]);
  const [proceedingWithPartial, setProceedingWithPartial] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
    getValues,
  } = useForm<ContractForm>({
    defaultValues: {
      siteId: "site_5678efgh", // Hardcoded as requested
      lineItems: [{ equipmentType: "", quantity: 1 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lineItems",
  });

  // Watch for changes to line items
  const lineItems = watch("lineItems");

  // Fetch clients and available equipment on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [clientsResponse, equipmentResponse] = await Promise.all([
          api.get("/client"),
          api.get("/equipment/available"),
        ]);

        setClients(clientsResponse.data);
        setAvailableEquipment(equipmentResponse.data.availableEquipment);

        // Extract unique equipment types
        const types = [
          ...new Set(
            equipmentResponse.data.availableEquipment.map(
              (eq: Equipment) => eq.equipmentType.name
            )
          ),
        ] as string[];
        setEquipmentTypes(types);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load initial data. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter clients based on search input
  useEffect(() => {
    if (clientSearch.trim() === "") {
      setFilteredClients([]);
    } else {
      const filtered = clients.filter((client) =>
        client.name.toLowerCase().includes(clientSearch.toLowerCase())
      );
      setFilteredClients(filtered);
    }
  }, [clientSearch, clients]);

  const handleClientSelect = (client: Client) => {
    setValue("clientId", client.clientId);
    setClientSearch(client.name);
    setShowClientDropdown(false);
  };

  const onSubmit = async (data: ContractForm) => {
    setLoading(true);
    setContractResponse(null);
    setError(null);
    setProceedingWithPartial(false);

    try {
      const response = await api.post("/contract", data);
      setContractResponse(response.data);
    } catch (error: any) {
      console.error("Error creating contract:", error);
      setError(error.response?.data?.error || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const proceedWithPartial = async () => {
    setLoading(true);
    setProceedingWithPartial(true);

    try {
      // Get the current form values
      const formData = getValues();

      // Modify the quantities based on available options
      if (
        contractResponse &&
        contractResponse.status === "PARTIALLY_AVAILABLE"
      ) {
        const option = contractResponse.options.find(
          (opt) => opt.type === "PROCEED_WITH_PARTIAL"
        );
        if (option && option.availableQuantity !== undefined) {
          // For simplicity, we'll assume the first line item is the one with partial availability
          // In a real application, you'd need to map this correctly based on the response
          formData.lineItems[0].quantity = option.availableQuantity;
        }
      }

      const response = await api.post("/contract", formData);
      setContractResponse(response.data);
    } catch (error: any) {
      console.error(
        "Error creating contract with partial availability:",
        error
      );
      setError(error.response?.data?.error || "An unexpected error occurred");
    } finally {
      setLoading(false);
      setProceedingWithPartial(false);
    }
  };

  const addLineItem = () => {
    append({ equipmentType: "", quantity: 1 });
  };

  const removeLineItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  const resetForm = () => {
    setContractResponse(null);
    setError(null);
    setProceedingWithPartial(false);
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <h2 className="text-2xl font-bold text-amber-900 mb-6">
        Create New Contract
      </h2>

      {loading && !proceedingWithPartial && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
          <span className="ml-4 text-amber-700">Processing...</span>
        </div>
      )}

      {proceedingWithPartial && (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-600"></div>
          <span className="ml-4 text-amber-700">
            Creating contract with partial availability...
          </span>
        </div>
      )}

      {!loading && !contractResponse && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white shadow-md rounded-xl p-6 space-y-6"
        >
          {/* Client Selection */}
          <div className="relative">
            <label className="block font-medium text-amber-900 mb-2">
              Client
            </label>
            <input
              type="text"
              value={clientSearch}
              onChange={(e) => {
                setClientSearch(e.target.value);
                setShowClientDropdown(true);
              }}
              onFocus={() => setShowClientDropdown(true)}
              placeholder="Search client by name"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
            />
            {showClientDropdown && filteredClients.length > 0 && (
              <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg max-h-60 overflow-y-auto">
                {filteredClients.map((client) => (
                  <div
                    key={client.clientId}
                    className="p-3 hover:bg-amber-50 cursor-pointer border-b border-gray-100"
                    onClick={() => handleClientSelect(client)}
                  >
                    <div className="font-medium">{client.name}</div>
                    <div className="text-sm text-gray-600">
                      {client.email} | {client.phone}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <input
              type="hidden"
              {...register("clientId", { required: "Client is required" })}
            />
            {errors.clientId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.clientId.message}
              </p>
            )}
          </div>

          {/* Site ID (hardcoded but visible) */}
          <div>
            <label className="block font-medium text-amber-900 mb-2">
              Site ID
            </label>
            <input
              type="text"
              {...register("siteId", { required: "Site ID is required" })}
              className="w-full border border-gray-300 rounded-lg p-2 bg-gray-100"
              readOnly
            />
            {errors.siteId && (
              <p className="text-red-500 text-sm mt-1">
                {errors.siteId.message}
              </p>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-amber-900 mb-2">
                Start Date
              </label>
              <input
                type="date"
                {...register("startDate", {
                  required: "Start date is required",
                })}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.startDate.message}
                </p>
              )}
            </div>
            <div>
              <label className="block font-medium text-amber-900 mb-2">
                End Date
              </label>
              <input
                type="date"
                {...register("endDate", { required: "End date is required" })}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
              {errors.endDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <label className="block font-medium text-amber-900">
                Equipment
              </label>
              <button
                type="button"
                onClick={addLineItem}
                className="bg-amber-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-amber-700"
              >
                Add Equipment
              </button>
            </div>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 border border-gray-200 rounded-lg"
              >
                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-1">
                    Type
                  </label>
                  <select
                    {...register(`lineItems.${index}.equipmentType` as const, {
                      required: "Equipment type is required",
                    })}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  >
                    <option value="">Select equipment type</option>
                    {equipmentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.lineItems?.[index]?.equipmentType && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lineItems[index]?.equipmentType?.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-900 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    {...register(`lineItems.${index}.quantity` as const, {
                      required: "Quantity is required",
                      min: { value: 1, message: "Minimum quantity is 1" },
                      valueAsNumber: true,
                    })}
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                  {errors.lineItems?.[index]?.quantity && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.lineItems[index]?.quantity?.message}
                    </p>
                  )}
                </div>

                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={() => removeLineItem(index)}
                    className="bg-red-100 text-red-700 px-3 py-2 rounded-lg text-sm hover:bg-red-200"
                    disabled={fields.length <= 1}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-600 text-white py-3 rounded-lg font-medium hover:bg-amber-700 disabled:opacity-50"
          >
            {loading ? "Creating Contract..." : "Create Contract"}
          </button>
        </form>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-6 p-6 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-xl font-bold text-red-800 mb-2">Error</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={resetForm}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Success Response Display - CREATED */}
      {contractResponse && contractResponse.status === "CREATED" && (
        <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-xl font-bold text-green-800 mb-4">
            Contract Created Successfully!
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-green-700 font-medium">Contract ID</p>
              <p className="text-green-900">
                {contractResponse.contract.contractId}
              </p>
            </div>
            <div>
              <p className="text-sm text-green-700 font-medium">Status</p>
              <p className="text-green-900">{contractResponse.status}</p>
            </div>
            <div>
              <p className="text-sm text-green-700 font-medium">Client ID</p>
              <p className="text-green-900">
                {contractResponse.contract.clientId}
              </p>
            </div>
            <div>
              <p className="text-sm text-green-700 font-medium">Site ID</p>
              <p className="text-green-900">
                {contractResponse.contract.siteId}
              </p>
            </div>
            <div>
              <p className="text-sm text-green-700 font-medium">Start Date</p>
              <p className="text-green-900">
                {new Date(
                  contractResponse.contract.startDate
                ).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-green-700 font-medium">End Date</p>
              <p className="text-green-900">
                {new Date(
                  contractResponse.contract.endDate
                ).toLocaleDateString()}
              </p>
            </div>
          </div>

          <h4 className="font-medium text-green-800 mb-3">
            Equipment Assigned:
          </h4>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-green-200">
              <thead className="bg-green-100">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-green-800 uppercase">
                    Line Item ID
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-green-800 uppercase">
                    Equipment ID
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-200 bg-white">
                {contractResponse.contract.lineItems.map((item) => (
                  <tr key={item.lineItemId}>
                    <td className="px-4 py-2 text-green-900">
                      {item.lineItemId}
                    </td>
                    <td className="px-4 py-2 text-green-900">
                      {item.equipmentId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={resetForm}
            className="mt-6 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            Create Another Contract
          </button>
        </div>
      )}

      {/* Partial Availability Response Display */}
      {contractResponse &&
        contractResponse.status === "PARTIALLY_AVAILABLE" && (
          <div className="mt-6 p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="text-xl font-bold text-yellow-800 mb-4">
              Partial Availability
            </h3>
            <p className="text-yellow-700 mb-4">{contractResponse.message}</p>

            <div className="mb-6">
              <h4 className="font-medium text-yellow-800 mb-3">Options:</h4>
              <ul className="space-y-2">
                {contractResponse.options.map((option, index) => (
                  <li key={index} className="text-yellow-700">
                    {option.type === "PROCEED_WITH_PARTIAL" && (
                      <div>
                        <p>
                          Proceed with {option.availableQuantity} available
                          equipment
                        </p>
                        <p>
                          {option.waitlistQuantity} equipment will be waitlisted
                        </p>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={proceedWithPartial}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700"
              >
                Proceed with Partial Availability
              </button>
              <button
                onClick={resetForm}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Modify Request
              </button>
            </div>
          </div>
        )}

      {/* Unavailable Response Display */}
      {contractResponse && contractResponse.status === "UNAVAILABLE" && (
        <div className="mt-6 p-6 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-xl font-bold text-red-800 mb-4">
            Equipment Unavailable
          </h3>
          <p className="text-red-700 mb-4">{contractResponse.message}</p>

          {contractResponse.suggestions &&
            contractResponse.suggestions.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-red-800 mb-3">Suggestions:</h4>
                <ul className="space-y-2">
                  {contractResponse.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-red-700">
                      {suggestion.type === "NEXT_AVAILABLE_DATE" &&
                        suggestion.nextAvailableDate && (
                          <p>
                            Next available date:{" "}
                            {new Date(
                              suggestion.nextAvailableDate
                            ).toLocaleDateString()}
                          </p>
                        )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

          <button
            onClick={resetForm}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Modify Request
          </button>
        </div>
      )}
    </div>
  );
};

export default CreateContract;
