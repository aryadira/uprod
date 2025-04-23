"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Image from "next/image";
import useAxios from "@/hooks/useAxios";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/common/Loader";
import RefreshButton from "@/components/common/RefreshButton";

interface Major {
  id: number;
  admin_id: number;
  slug: string;
  code: string;
  logo_path: string | null;
  banner_path: string | null;
  name: string;
  acronim: string;
  description: string;
  is_active: boolean;
  user: {
    id: number;
    name: string;
  };
}

const headerCell = [
  { id: 1, name: "No." },
  { id: 2, name: "Logo" },
  { id: 3, name: "Major Name" },
  { id: 4, name: "Acronim" },
  { id: 5, name: "User Admin" },
];

export default function TableMajor() {
  const { authToken } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [majors, setMajors] = useState<Major[]>([]);

  // Pindahkan ke luar agar bisa dipakai di tempat lain juga
  const fetchMajor = async () => {
    setIsLoading(true);
    try {
      const res = await useAxios.get("/major", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      const { major } = res.data;
      setMajors(major);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchMajor();
    }
  }, [authToken]);

  const handleRefresh = () => {
    fetchMajor();
  };

  return (
    <div className="overflow-hidden rounded-xl border bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="control-table p-3">
        <RefreshButton onClick={handleRefresh} />
      </div>
      <div className="max-w-full overflow-x-auto">
        {isLoading ? (
          <div className="w-full flex items-center justify-center p-10">
            <Loader />
          </div>
        ) : (
          <div className="min-w-[1000px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  {headerCell.map((cell) => (
                    <TableCell
                      key={cell.id}
                      isHeader
                      className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                    >
                      {cell.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {majors.map((major, index) => (
                  <TableRow key={major.id}>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {index + 1}
                    </TableCell>
                    <TableCell className="px-5 py-4 sm:px-6 text-start">
                      <div className="w-10 h-10 overflow-hidden rounded-md bg-gray-100">
                        {major.logo_path ? (
                          <Image
                            width={40}
                            height={40}
                            src={major.logo_path}
                            alt={major.name}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center p-3 justify-center text-xs text-gray-400">
                            No Logo
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-800 text-theme-sm dark:text-white/90">
                      {major.name}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-800 text-theme-sm dark:text-white/90">
                      {major.acronim}
                    </TableCell>
                    <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                      {major.user?.name ?? "-"}
                    </TableCell>
                    {/* <TableCell className="px-4 py-3">
                      <Badge
                        size="sm"
                        color={major.is_active ? "success" : "error"}
                      >
                        {major.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
