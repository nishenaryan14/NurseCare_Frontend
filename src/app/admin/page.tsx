"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import api from "@/lib/api";
import { CheckCircleIcon, XCircleIcon, UserCircleIcon, MapPinIcon, ClockIcon } from "@heroicons/react/24/outline";

interface PendingNurse {
  id: number;
  specialization: string[];
  location: string;
  hourlyRate: number;
  availability?: any;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [pendingNurses, setPendingNurses] = useState<PendingNurse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNurse, setSelectedNurse] = useState<PendingNurse | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  // Admin auth/authorization route protection
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.replace("/auth/login");
      } else if (user.role !== "ADMIN") {
        router.replace("/");
      }
    }
  }, [user, authLoading, router]);

  const fetchPendingNurses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/nurses/pending');
      setPendingNurses(response.data);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch pending nurses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user && user.role === "ADMIN") {
      fetchPendingNurses();
    }
  }, [authLoading, user]);

  const handleApprove = async (id: number) => {
    try {
      setActionLoading(id);
      await api.patch(`/nurses/${id}/approve`);
      toast.success("Nurse approved successfully!");
      setPendingNurses(nurses => nurses.filter(n => n.id !== id));
      setSelectedNurse(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to approve nurse");
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: number) => {
    if (!confirm('Are you sure you want to reject this nurse application?')) {
      return;
    }
    try {
      setActionLoading(id);
      await api.delete(`/nurses/${id}/reject`);
      toast.success("Nurse application rejected");
      setPendingNurses(nurses => nurses.filter(n => n.id !== id));
      setSelectedNurse(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to reject nurse");
    } finally {
      setActionLoading(null);
    }
  };

  if (authLoading || (!user && !authLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage nurse applications and approvals</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                <UserCircleIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-gray-900">{pendingNurses.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pending Nurses List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Pending Nurse Applications</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading applications...</p>
            </div>
          ) : pendingNurses.length === 0 ? (
            <div className="p-12 text-center">
              <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
              <p className="text-gray-600">No pending nurse applications at the moment.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {pendingNurses.map((nurse) => (
                <div key={nurse.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                          <UserCircleIcon className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{nurse.user?.name}</h3>
                          <p className="text-sm text-gray-600">{nurse.user?.email}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="flex items-start gap-2">
                          <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Location</p>
                            <p className="text-sm text-gray-600">{nurse.location}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <ClockIcon className="h-5 w-5 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-700">Hourly Rate</p>
                            <p className="text-sm text-gray-600">₹{nurse.hourlyRate}/hour</p>
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">Specializations</p>
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(nurse.specialization) ? (
                            nurse.specialization.map((spec, idx) => (
                              <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                {spec}
                              </span>
                            ))
                          ) : (
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                              {nurse.specialization}
                            </span>
                          )}
                        </div>
                      </div>

                    </div>

                    <div className="flex flex-col gap-2 ml-6">
                      <Button
                        onClick={() => handleApprove(nurse.id)}
                        disabled={actionLoading === nurse.id}
                        className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                        size="sm"
                      >
                        <CheckCircleIcon className="h-4 w-4" />
                        {actionLoading === nurse.id ? 'Approving...' : 'Approve'}
                      </Button>
                      <Button
                        onClick={() => handleReject(nurse.id)}
                        disabled={actionLoading === nurse.id}
                        variant="outline"
                        className="border-red-300 text-red-600 hover:bg-red-50 flex items-center gap-2"
                        size="sm"
                      >
                        <XCircleIcon className="h-4 w-4" />
                        {actionLoading === nurse.id ? 'Rejecting...' : 'Reject'}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
