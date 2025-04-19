import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import { Metadata } from "next";
import React from "react";
import TableCustomer from "./(table)/TableMajor";
import Button from "@/components/ui/button/Button";

export const metadata: Metadata = {
  title: "Next.js Basic Table | TailAdmin - Next.js Dashboard Template",
  description:
    "This is Next.js Basic Table  page for TailAdmin  Tailwind CSS Admin Dashboard Template",
  // other metadata
};

export default function Customer() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Majors" />
      <div className="space-y-6">
        <ComponentCard title="Major List" buttonText="Add major">
          <TableCustomer />
        </ComponentCard>
      </div>
    </div>
  );
}
