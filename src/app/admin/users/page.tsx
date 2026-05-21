"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Loader2, Trash2 } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface UserType {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: string;
}

export default function AdminReservationsPage() {
  const [data, setData] = useState<UserType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);

  // Naya state: Delete loading ko individual track karne ke liye
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  // 1. Initial Load: Fetch users
  const loadReservations = async () => {
    setIsFetching(true);
    try {
      const res = await fetch(`/api/auth/users`);
      if (res.ok) {
        const json = await res.json();
        setData(json || []);
      } else {
        toast.error("Failed to fetch users.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Network error occurred.");
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  // 2. Client-side Filter Logic (Bina API Request Ke)
  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return data;

    const lowerSearch = searchQuery.toLowerCase().trim();
    return data.filter((user) => {
      return (
        user.name?.toLowerCase().includes(lowerSearch) ||
        user.email?.toLowerCase().includes(lowerSearch) ||
        user.role?.toLowerCase().includes(lowerSearch)
      );
    });
  }, [searchQuery, data]);

  // 3. Smooth Role Change with Optimistic Updates & Revert Logic
  const handleChangeRole = async (id: string, newRole: string, currentRole: string) => {
    setUpdatingUserId(id);

    // Frontend par instant update
    setData((prevData) =>
      prevData.map((user) => (user.id === id ? { ...user, role: newRole } : user))
    );

    try {
      const res = await fetch(`/api/auth/users`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, role: newRole }),
      });

      if (!res.ok) throw new Error("Failed to update role on server.");
      toast.success("Role updated successfully!");
    } catch (e) {
      console.error(e);
      toast.error("Could not update role. Reverting back.");

      // Fail hone par revert
      setData((prevData) =>
        prevData.map((user) => (user.id === id ? { ...user, role: currentRole } : user))
      );
    } finally {
      setUpdatingUserId(null);
    }
  };

  // 4. Perfect Optimistic Delete with Auto-Revert Logic
  const handleDeleteUser = async (userToDelete: UserType) => {
    if (!confirm(`Are you sure you want to delete ${userToDelete.name}? This action cannot be undone.`)) {
      return;
    }

    const targetId = userToDelete.id;
    setDeletingUserId(targetId);

    // Step A: Frontend state se user ko foran remove kar do (Optimistic Update)
    setData((prevData) => prevData.filter((user) => user.id !== targetId));

    try {
      const res = await fetch(`/api/auth/users/${targetId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete user from server.");

      toast.success("User deleted successfully!");
    } catch (e) {
      console.error(e);
      toast.error("Could not delete user. Reverting state.");

      // Step B: Agar API fail ho jaye, toh user ko uski purani jagah wapas le aao
      setData((prevData) => [...prevData, userToDelete]);
    } finally {
      setDeletingUserId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          href="/admin"
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-3xl font-bold">All Users</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Search Users</CardTitle>
          <div className="flex gap-4 mt-4 max-w-sm">
            <Input
              placeholder="Search by name, email, or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="w-[100px] text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isFetching ? (
                  <TableRow>
                    {/* Fixed colSpan to 4 */}
                    <TableCell colSpan={4} className="h-24 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                        <span>Loading users...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredData.length === 0 ? (
                  <TableRow>
                    {/* Fixed colSpan to 4 */}
                    <TableCell colSpan={4} className="h-24 text-center text-gray-500">
                      No matching users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((res) => (
                    <TableRow key={res.id}>
                      <TableCell className="font-medium text-[#477023]">
                        {res.name}
                      </TableCell>
                      <TableCell>{res.email}</TableCell>
                      <TableCell className="min-w-[140px]">
                        <div className="flex items-center gap-2">
                          <Select
                            value={res.role}
                            disabled={updatingUserId === res.id || deletingUserId === res.id}
                            onValueChange={(value) =>
                              handleChangeRole(res.id, value, res.role)
                            }
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                            <SelectContent>
                              {["admin", "user"].map((cat) => (
                                <SelectItem key={cat} value={cat}>
                                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>

                          {updatingUserId === res.id && (
                            <Loader2 className="w-4 h-4 animate-spin text-primary" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="destructive"
                          size="sm"
                          className="gap-1.5"
                          disabled={deletingUserId === res.id}
                          onClick={() => handleDeleteUser(res)}
                        >
                          {deletingUserId === res.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                          <span>Delete</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}