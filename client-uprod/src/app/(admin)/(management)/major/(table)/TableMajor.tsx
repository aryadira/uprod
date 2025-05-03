"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import useAxios from "@/hooks/useAxios";
import { useAuth } from "@/context/AuthContext";
import Loader from "@/components/common/Loader";
// import RefreshButton from "@/components/common/RefreshButton";
import Button from "@/components/ui/button/Button";
import { Major } from "@/types";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const HEADER_CELLS = [
  "No.",
  "Logo",
  "Major Name",
  "Email",
  "Acronim",
  "Admin Name",
  "Action"
];

const TableMajor = () => {
  const { authToken } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [majors, setMajors] = useState<Major[]>([]);
  const [isMounted, setIsMounted] = useState(false); // fix hydration

  const fetchMajors = async () => {
    setIsLoading(true);
    try {
      const res = await useAxios.get("/major", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      setMajors(res.data.major);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true); // hydration fix
    if (authToken) fetchMajors();
  }, [authToken]);

  if (!isMounted) return null; // prevent hydration mismatch

  // const handleRefresh = () => {
  //   fetchMajors();
  // }

  const renderTableBody = () =>
    majors.map((major, index) => (
      <TableRow key={major.id}>
        <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
          {index + 1}
        </TableCell>
        <TableCell className="px-5 py-4 sm:px-6 text-start">
          <div className="w-15 h-15 overflow-hidden rounded-md bg-gray-100 flex items-center justify-center">
            {major.logo_path ? (
              <Image
                width={40}
                height={40}
                src={`${process.env.NEXT_PUBLIC_SERVER_URL}/${major.logo_path}`}
                alt={major.name}
                className="object-cover w-full h-full" // Menjaga proporsi gambar
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                No Logo
              </div>
            )}
          </div>
        </TableCell>
        <TableCell className="px-4 py-3 text-theme-sm text-gray-800 dark:text-white/90">
          {major.name}
        </TableCell>
        <TableCell className="px-4 py-3 text-theme-sm text-gray-800 dark:text-white/90">
          {major.user?.email}
        </TableCell>
        <TableCell className="px-4 py-3 text-theme-sm text-gray-800 dark:text-white/90">
          {major.acronim}
        </TableCell>
        <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
          {major.user?.name ?? "-"}
        </TableCell>
        <TableCell className="px-4 py-3 text-theme-sm text-gray-500 dark:text-gray-400">
          <Button variant="outline" type="link" href={`/major/${major.slug}`}>Detail</Button>
        </TableCell>
      </TableRow>
    ));

  const renderEmptyState = () => (
    <div className="w-full flex flex-col items-center justify-center p-12 gap-5">
      <div className="text-center">
        <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
          You havent added a major
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Please create the first major below!
        </p>
      </div>
      <Button type="link" href="/major/create">
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
        {isLoading && majors.length === 0 ? (
          <div className="w-full flex items-center justify-center p-10">
            <Loader />
          </div>
        ) : majors.length === 0 ? (
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

export default TableMajor;
