import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Badge from "@/components/ui/badge/Badge";
import Image from "next/image";

interface Service {
  id: number;
  serviceCode: string;
  image: string;
  serviceName: string;
  serviceType: string;
  availability: number;
  price: string;
  status: string;
}

const serviceData: Service[] = [
  {
    id: 1,
    serviceCode: "SRV2024.000123",
    image: "/images/user/user-17.jpg",
    serviceName: "Deep Cleaning Service",
    serviceType: "Home Service",
    availability: 5,
    price: "Rp 150.000",
    status: "Available",
  },
  {
    id: 2,
    serviceCode: "SRV2024.000124",
    image: "/images/user/user-18.jpg",
    serviceName: "Personal Trainer",
    serviceType: "Fitness",
    availability: 0,
    price: "Rp 250.000",
    status: "Fully Booked",
  },
  {
    id: 3,
    serviceCode: "SRV2024.000125",
    image: "/images/user/user-19.jpg",
    serviceName: "Online Consultation",
    serviceType: "Health",
    availability: 2,
    price: "Rp 75.000",
    status: "Limited Slots",
  },
  {
    id: 4,
    serviceCode: "SRV2024.000126",
    image: "/images/user/user-20.jpg",
    serviceName: "Interior Design Advice",
    serviceType: "Design",
    availability: 3,
    price: "Rp 500.000",
    status: "Available",
  },
];

const headerCell = [
  { id: 1, name: 'No.' },
  { id: 2, name: 'Service Code' },
  { id: 3, name: 'Service' },
  { id: 4, name: 'Type' },
  { id: 5, name: 'Availability' },
  { id: 6, name: 'Status' },
  { id: 7, name: 'Price' }
];

export default function TableService() {
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
              {serviceData.map((service, index) => (
                <TableRow key={service.id}>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {index + 1}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {service.serviceCode}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-md">
                        <Image
                          width={40}
                          height={40}
                          src={service.image}
                          alt={service.serviceName}
                        />
                      </div>
                      <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {service.serviceName}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {service.serviceType}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {service.availability}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <Badge
                      size="sm"
                      color={
                        service.status === "Available"
                          ? "success"
                          : service.status === "Limited Slots"
                          ? "warning"
                          : "error"
                      }
                    >
                      {service.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {service.price}
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
