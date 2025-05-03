"use client";

import React, { useEffect, useState } from "react";
import useAxios from "@/hooks/useAxios";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/common/Loader";
import Button from "@/components/ui/button/Button";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Admin } from "@/types";
import Badge from "@/components/ui/badge/Badge";

const HEADER_CELLS = [
  "No.",
  "Admin Name",
  "Email",
  "Is Assigned",
  "Action"
];

const TableAdmin = () => {
  const { authToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [isMounted, setIsMounted] = useState(false); // fix hydration

  const fetchAdmins = async () => {
    setIsLoading(true);
    try {
      const res = await useAxios.get("/user/admin", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setAdmins(res.data.admins);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true); // hydration fix
    if (authToken) fetchAdmins();
  }, [authToken]);

  if (!isMounted) return null; // prevent hydration mismatch

  // const handleRefresh = () => {
  //   fetchAdmins();
  // }

  const renderTableBody = () =>
    admins.map((admin, index) => (
      <TableRow key={admin.id}>
        <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
          {index + 1}
        </TableCell>
        <TableCell className="px-4 py-3 text-theme-sm text-gray-800 dark:text-white/90">
          {admin.name}
        </TableCell>
        <TableCell className="px-4 py-3 text-theme-sm text-gray-800 dark:text-white/90">
          {admin.email}
        </TableCell>
        <TableCell className="px-4 py-3 text-theme-sm text-gray-800 dark:text-white/90">
          <Badge color={admin.is_assigned == "assigned" ? "success" : "error"}>{admin.is_assigned}</Badge>
        </TableCell>
        <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
          <Button variant="outline" type="link" href={`/user/admin/${admin.id}`}>Detail</Button>
        </TableCell>
      </TableRow>
    ));

  const renderEmptyState = () => (
    <div className="w-full flex flex-col items-center justify-center p-12 gap-5">
      <div className="text-center">
        <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
          You havent added a admin
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Please create the first admin below!
        </p>
      </div>
      <Button type="link" href="/user/admin/create">
        Go to create
      </Button>
    </div>
  );

  return (
    <div className="overflow-hidden rounded-xl border bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      {/* <div className="control-table p-3">
        <RefreshButton onClick={handleRefresh} />
      </div> */}
      <div className="max-w-full overflow-x-auto">
        {isLoading && admins.length === 0 ? (
          <div className="w-full flex items-center justify-center p-10">
            <Loader />
          </div>
        ) : admins.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="min-w-[1000px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  {HEADER_CELLS.map((name, idx) => (
                    <TableCell
                      key={idx}
                      isHeader
                      className="px-5 py-3 font-medium text-theme-xs text-gray-500 text-start dark:text-gray-400"
                    >
                      {name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {renderTableBody()}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableAdmin;
