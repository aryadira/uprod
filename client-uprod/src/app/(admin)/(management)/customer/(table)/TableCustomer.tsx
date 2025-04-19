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

interface Customer {
  id: number;
  image: string;
  name: string;
  email: string;
  phone: string;
  status: string;
}

const customerData: Customer[] = [
  {
    id: 1,
    image: "/images/user/user-17.jpg",
    name: "Andi Prasetyo",
    email: "andi@example.com",
    phone: "0812-3456-7890",
    status: "Active",
  },
  {
    id: 2,
    image: "/images/user/user-18.jpg",
    name: "Siti Nurhaliza",
    email: "siti@example.com",
    phone: "0813-9876-5432",
    status: "Inactive",
  },
  {
    id: 3,
    image: "/images/user/user-19.jpg",
    name: "Budi Santoso",
    email: "budi@example.com",
    phone: "0811-2222-3333",
    status: "Pending",
  },
  {
    id: 4,
    image: "/images/user/user-20.jpg",
    name: "Rina Kartika",
    email: "rina@example.com",
    phone: "0821-4444-5555",
    status: "Active",
  },
];

const headerCell = [
  { id: 1, name: "No." },
  { id: 2, name: "Customer" },
  { id: 3, name: "Email" },
  { id: 4, name: "Phone" },
  { id: 5, name: "Status" },
];

export default function TableCustomer() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[800px]">
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
              {customerData.map((customer, index) => (
                <TableRow key={customer.id}>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {index + 1}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-md">
                        <Image
                          width={40}
                          height={40}
                          src={customer.image}
                          alt={customer.name}
                        />
                      </div>
                      <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {customer.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {customer.email}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {customer.phone}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <Badge
                      size="sm"
                      color={
                        customer.status === "Active"
                          ? "success"
                          : customer.status === "Pending"
                          ? "warning"
                          : "error"
                      }
                    >
                      {customer.status}
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
