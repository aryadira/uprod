import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Image from "next/image";
import Badge from "@/components/ui/badge/Badge";

interface Major {
  id: number;
  admin_id: number;
  created_by: string;
  slug: string;
  code: string;
  logo_path: string;
  banner_path: string;
  name: string;
  acronim: string;
  description: string;
  is_active: boolean;
}

const majorData: Major[] = [
  {
    id: 1,
    admin_id: 10,
    created_by: "admin",
    slug: "sistem-informasi-jaringan-aplikasi",
    code: "SIJA20250001",
    logo_path: "/images/majors/sija-logo.jpg",
    banner_path: "/images/majors/sija-banner.jpg",
    name: "Sistem Informasi Jaringan dan Aplikasi",
    acronim: "SIJA",
    description: "Jurusan yang fokus pada pengembangan sistem informasi dan jaringan komputer.",
    is_active: true,
  },
  {
    id: 2,
    admin_id: 11,
    created_by: "admin",
    slug: "rekayasa-perangkat-lunak",
    code: "RPL20250002",
    logo_path: "/images/majors/rpl-logo.jpg",
    banner_path: "/images/majors/rpl-banner.jpg",
    name: "Rekayasa Perangkat Lunak",
    acronim: "RPL",
    description: "Jurusan yang mempelajari proses rekayasa dan pengembangan perangkat lunak.",
    is_active: false,
  },
];

const headerCell = [
  { id: 1, name: "No." },
  { id: 2, name: "Logo" },
  { id: 3, name: "Code" },
  { id: 4, name: "Name" },
  { id: 5, name: "Acronim" },
  { id: 6, name: "Created By" },
  { id: 7, name: "Status" },
];

export default function TableMajor() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
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
              {majorData.map((major, index) => (
                <TableRow key={major.id}>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {index + 1}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="w-10 h-10 overflow-hidden rounded-md">
                      <Image
                        width={40}
                        height={40}
                        src={major.logo_path}
                        alt={major.name}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-800 text-theme-sm dark:text-white/90">
                    {major.code}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-800 text-theme-sm dark:text-white/90">
                    {major.name}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-800 text-theme-sm dark:text-white/90">
                    {major.acronim}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {major.created_by}
                  </TableCell>
                  <TableCell className="px-4 py-3">
                    <Badge
                      size="sm"
                      color={major.is_active ? "success" : "error"}
                    >
                      {major.is_active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
