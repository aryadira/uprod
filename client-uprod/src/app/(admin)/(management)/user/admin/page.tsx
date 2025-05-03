import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import TableAdmin from "./(table)/TableAdmin";

export const metadata: Metadata = {
  title: "Admin list | Uprod",
  description:
    "This is Next.js Basic Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template",
};

export default function Major() {
  return (
    <div>
      <PageBreadcrumb />
      <div className="space-y-6">
        <ComponentCard title="Admin List" buttonText="Add admin" buttonHref="/user/admin/create">
          <TableAdmin />
        </ComponentCard>
      </div>
    </div>
  );
}
