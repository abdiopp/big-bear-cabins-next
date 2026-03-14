"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { useReservations } from "@/hooks/useReservations";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ReservationWithMeta {
  confirmation_id: number;
  unit_id: number;
  property_name?: string;
  status: string;
  email: string;
  startdate: string;
  enddate: string;
  guest_name?: string;
  guest_first_name?: string;
  guest_last_name?: string;
  total: number;
  heardAboutUs?: string; // Appended from backend
}

export default function AdminReservationsPage() {
  const { fetchReservations, loading } = useReservations();
  const [data, setData] = useState<ReservationWithMeta[]>([]);
  const [emailFilter, setEmailFilter] = useState("");
  const [isFetching, setIsFetching] = useState(true);

  const loadReservations = async (email?: string) => {
    setIsFetching(true);
    // Note: To fetch the heardAboutUs marketing survey, we'll hit our own API. 
    // Wait, the API doesn't currently inject the meta data. I will modify the api/reservations route to include it.
    // For now, let's fetch normal ones, then we'll map meta.
    try {
      const res = await fetch(`/api/admin/reservations-meta${email ? `?email=${email}` : ''}`);
      if (res.ok) {
        const json = await res.json();
        setData(json.data);
      }
    } catch (e) {
      console.error(e);
    }
    setIsFetching(false);
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadReservations(emailFilter);
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
        <h1 className="text-3xl font-bold">Reservations & Survey Data</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <form onSubmit={handleSearch} className="flex gap-4 mt-4 max-w-sm">
            <Input
              placeholder="Search by Email..."
              value={emailFilter}
              onChange={(e) => setEmailFilter(e.target.value)}
            />
            <Button type="submit" disabled={isFetching}>
              {isFetching ? "Searching..." : "Search"}
            </Button>
          </form>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Conf ID</TableHead>
                  <TableHead>Guest</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total Paid</TableHead>
                  <TableHead>How Did They Hear About Us?</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isFetching ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Loading reservations...
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No matching reservations found.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((res) => (
                    <TableRow key={res.confirmation_id}>
                      <TableCell className="font-medium text-[#477023]">
                        {res.confirmation_id}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">
                          {res.guest_name || `${res.guest_first_name} ${res.guest_last_name}`}
                        </div>
                        <div className="text-sm text-gray-500">{res.email}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {res.startdate} to {res.enddate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            res.status === "CONFIRMED"
                              ? "default"
                              : res.status === "CANCELLED"
                              ? "destructive"
                              : "secondary"
                          }
                          className={res.status === "CONFIRMED" ? "bg-green-600" : ""}
                        >
                          {res.status}
                        </Badge>
                      </TableCell>
                      <TableCell>${res.total?.toFixed(2) || "0.00"}</TableCell>
                      <TableCell>
                        {res.heardAboutUs ? (
                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700">
                            {res.heardAboutUs}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">Not provided</span>
                        )}
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
