"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

interface PendingNurse {
  id: number;
  specialization: string;
  location: string;
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

  useEffect(() => {
    if (!authLoading && user && user.role === "ADMIN") {
      fetch("/api/admin/pending-nurses")
        .then(res => res.json())
        .then(data => {
          setPendingNurses(data);
          setLoading(false);
        });
    }
  }, [authLoading, user]);

  const handleApprove = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/approve-nurse/${id}`, { method: "PATCH" });
      if (!res.ok) throw new Error("Failed to approve");
      toast.success("Nurse approved.");
      setPendingNurses(nurses => nurses.filter(n => n.id !== id));
    } catch (e) {
      toast.error("Could not approve nurse");
    }
  };

  const handleReject = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/reject-nurse/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to reject");
      toast.success("Nurse rejected.");
      setPendingNurses(nurses => nurses.filter(n => n.id !== id));
    } catch (e) {
      toast.error("Could not reject nurse");
    }
  };

  if (authLoading || (!user && !authLoading)) {
    return <div className="py-20 text-center">Loading...</div>;
  }
  // No need to render further, we redirect if not admin
  if (!user || user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <h1 className="text-3xl font-bold mt-8 mb-6">Admin Dashboard</h1>
      <h2 className="text-xl mb-4">Pending Nurse Approvals</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="w-full border mt-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Specialization</th>
              <th className="p-2 text-left">Location</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingNurses.map((nurse) => (
              <tr key={nurse.id} className="border-b">
                <td className="p-2">{nurse.user?.name}</td>
                <td className="p-2">{nurse.user?.email}</td>
                <td className="p-2">{nurse.specialization}</td>
                <td className="p-2">{nurse.location}</td>
                <td className="p-2">
                  <Button onClick={() => handleApprove(nurse.id)} size="sm" className="mr-2">
                    Approve
                  </Button>
                  <Button onClick={() => handleReject(nurse.id)} size="sm" variant="outline">
                    Reject
                  </Button>
                </td>
              </tr>
            ))}
            {pendingNurses.length === 0 && (
              <tr><td colSpan={5} className="p-4 text-center">No pending nurses.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}
