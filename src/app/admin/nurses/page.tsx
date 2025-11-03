'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import {
  CheckCircleIcon,
  XCircleIcon,
  UserCircleIcon,
  MapPinIcon,
  ClockIcon,
  StarIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

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

export default function NursesManagement() {
  const [pendingNurses, setPendingNurses] = useState<PendingNurse[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [selectedNurse, setSelectedNurse] = useState<PendingNurse | null>(null);

  useEffect(() => {
    fetchPendingNurses();
  }, []);

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

  const handleApprove = async (id: number) => {
    try {
      setActionLoading(id);
      await api.patch(`/nurses/${id}/approve`);
      toast.success('Nurse approved successfully!');
      setPendingNurses(nurses => nurses.filter(n => n.id !== id));
      setSelectedNurse(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to approve nurse');
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
      toast.success('Nurse application rejected');
      setPendingNurses(nurses => nurses.filter(n => n.id !== id));
      setSelectedNurse(null);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reject nurse');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nurse Management</h1>
          <p className="text-gray-500 mt-1">Review and approve nurse applications</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg font-semibold">
            {pendingNurses.length} Pending Approvals
          </span>
        </div>
      </div>

      {/* Pending Nurses */}
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : pendingNurses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">All Caught Up!</h3>
          <p className="text-gray-500">No pending nurse applications at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {pendingNurses.map((nurse) => (
            <div
              key={nurse.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <UserCircleIcon className="w-10 h-10" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{nurse.user.name}</h3>
                      <p className="text-blue-100 text-sm">{nurse.user.email}</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-semibold">
                    Pending
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-4">
                {/* Specializations */}
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Specializations
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {nurse.specialization.map((spec, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPinIcon className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">{nurse.location}</span>
                </div>

                {/* Hourly Rate */}
                <div className="flex items-center gap-2 text-gray-700">
                  <StarIcon className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium">₹{nurse.hourlyRate}/hour</span>
                </div>

                {/* Availability */}
                {nurse.availability && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <ClockIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-sm">Available for bookings</span>
                  </div>
                )}
              </div>

              {/* Card Actions */}
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-200">
                <button
                  onClick={() => handleReject(nurse.id)}
                  disabled={actionLoading === nurse.id}
                  className="px-6 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <XCircleIcon className="w-5 h-5" />
                  Reject
                </button>
                <button
                  onClick={() => handleApprove(nurse.id)}
                  disabled={actionLoading === nurse.id}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {actionLoading === nurse.id ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircleIcon className="w-5 h-5" />
                      Approve
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
