"use client";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../api/axios";
import { toast } from "react-toastify";

const clientSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  address: z.string().optional(),
});

type ClientFormData = z.infer<typeof clientSchema>;

interface Client {
  clientId: string;
  name: string;
  email: string;
  phone: string;
}

export default function Clients() {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
  });

  // Fetch clients on component mount
  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await api.get("/client");
      setClients(response.data);
      setFetchError("");
    } catch (error: any) {
      toast.error("Failed to load clients. Please try again.");
      console.error("Error fetching clients:", error);
      setFetchError("Failed to load clients. Please try again.");
    }
  };

  const onSubmit = async (data: ClientFormData) => {
    setLoading(true);
    setSuccessMsg("");
    try {
      await api.post("/client", data);
      toast.success("Client added successfully!");

      reset();
      setIsFormOpen(false);
      // Refresh the client list
      fetchClients();
    } catch (error: any) {
      console.error("Error adding client:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Client Management</h2>

      {/* Collapsible Add Client Form */}
      <div className="mb-8 bg-white shadow-md rounded-xl overflow-hidden">
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="w-full p-4 bg-blue-600 text-white font-medium text-left flex justify-between items-center"
        >
          <span>
            {isFormOpen ? "Collapse Add Client Form" : "Add New Client"}
          </span>
          <span>{isFormOpen ? "−" : "+"}</span>
        </button>

        {isFormOpen && (
          <div className="p-6">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block font-medium">Name</label>
                <input
                  type="text"
                  {...register("name")}
                  className="w-full border rounded-lg p-2 mt-1"
                />
                {errors.name && (
                  <p className="text-red-500 text-sm">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block font-medium">Email</label>
                <input
                  type="email"
                  {...register("email")}
                  className="w-full border rounded-lg p-2 mt-1"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block font-medium">Phone</label>
                <input
                  type="text"
                  {...register("phone")}
                  className="w-full border rounded-lg p-2 mt-1"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone.message}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <label className="block font-medium">Address</label>
                <textarea
                  {...register("address")}
                  className="w-full border rounded-lg p-2 mt-1"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Saving..." : "Add Client"}
              </button>
            </form>

            {successMsg && <p className="text-green-600 mt-4">{successMsg}</p>}
          </div>
        )}
      </div>

      {/* Clients List */}
      <div className="bg-white shadow-md rounded-xl p-6">
        <h3 className="text-xl font-bold mb-4">Client List</h3>

        {fetchError && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
            {fetchError}
            <button
              onClick={fetchClients}
              className="ml-2 bg-red-100 px-2 py-1 rounded hover:bg-red-200"
            >
              Retry
            </button>
          </div>
        )}

        {clients.length === 0 && !fetchError ? (
          <p className="text-gray-500">
            No clients found. Add your first client above.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left border-b">Name</th>
                  <th className="p-3 text-left border-b">Email</th>
                  <th className="p-3 text-left border-b">Phone</th>
                  <th className="p-3 text-left border-b">ID</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr
                    key={client.clientId}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-3">{client.name}</td>
                    <td className="p-3">{client.email}</td>
                    <td className="p-3">{client.phone}</td>
                    <td className="p-3 font-mono text-sm text-gray-500">
                      {client.clientId}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
