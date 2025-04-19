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

interface Product {
  id: number;
  productCode: string;
  image: string;
  name: string;
  category: string;
  stock: number;
  price: string;
  status: string;
}

const productData: Product[] = [
  {
    id: 1,
    productCode: "PRD2024.000123",
    image: "/images/user/user-17.jpg",
    name: "Organic Honey",
    category: "Food",
    stock: 120,
    price: "Rp 25.000",
    status: "Available",
  },
  {
    id: 2,
    productCode: "PRD2024.000123",
    image: "/images/user/user-18.jpg",
    name: "Wooden Chair",
    category: "Furniture",
    stock: 0,
    price: "Rp 350.000",
    status: "Out of Stock",
  },
  {
    id: 3,
    productCode: "PRD2024.000123",
    image: "/images/user/user-19.jpg",
    name: "Eco Bag",
    category: "Accessories",
    stock: 45,
    price: "Rp 15.000",
    status: "Low Stock",
  },
  {
    id: 4,
    productCode: "PRD2024.000123",
    image: "/images/user/user-20.jpg",
    name: "Ceramic Mug",
    category: "Kitchenware",
    stock: 75,
    price: "Rp 40.000",
    status: "Available",
  },
];

const headerCell = [
  {
    id: 1,
    name: 'No.'
  },
  {
    id: 2,
    name: 'Product Code'
  },
  {
    id: 3,
    name: 'Product'
  },
  {
    id: 4,
    name: 'Category'
  },
  {
    id: 5,
    name: 'Stock'
  },
  {
    id: 6,
    name: 'Status'
  },
  {
    id: 7,
    name: 'Price'
  }
]

export default function TableProduct() {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1000px]">
          <Table>
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {headerCell.map((cell) => (
                  <TableCell key={cell.id}
                    isHeader
                    className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                  >
                    {cell.name}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {productData.map((product, index) => (
                <TableRow key={product.id}>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {index + 1}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {product.productCode}
                  </TableCell>
                  <TableCell className="px-5 py-4 sm:px-6 text-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 overflow-hidden rounded-md">
                        <Image
                          width={40}
                          height={40}
                          src={product.image}
                          alt={product.name}
                        />
                      </div>
                      <span className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        {product.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {product.category}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                    {product.stock}
                  </TableCell>
                  <TableCell className="px-4 py-3 text-start">
                    <Badge
                      size="sm"
                      color={
                        product.status === "Available"
                          ? "success"
                          : product.status === "Low Stock"
                            ? "warning"
                            : "error"
                      }
                    >
                      {product.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-4 py-3 text-gray-500 text-theme-sm dark:text-gray-400">
                    {product.price}
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
