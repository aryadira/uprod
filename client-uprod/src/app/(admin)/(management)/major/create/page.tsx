/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FormEvent, useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Label from "@/components/form/Label";
import FileInput from "@/components/form/input/FileInput";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Image from "next/image";
import useAxios from "@/hooks/useAxios";
import { useAuth } from "@/context/AuthContext";

export default function CreateMajor() {
  const { authToken } = useAuth();

  const [adminMessage, setAdminMessage] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [admin, setAdmin] = useState({ id: null, email: "" });
  const [loading, setLoading] = useState(false);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [acronim, setAcronim] = useState<string>("");
  const [slug, setSlug] = useState<string>("");

  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setLogoPreview(URL.createObjectURL(file));
  };

  const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) setBannerPreview(URL.createObjectURL(file));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;

    const newAcronim = newName
      .trim()
      .split(/\s+/)
      .filter((word) => word && !word.includes(word.toLowerCase()))
      .map((word) => word[0]?.toUpperCase())
      .join("");

    const newSlug = newName.trim().toLowerCase().replace(/\s+/g, "_");

    setAcronim(newAcronim);
    setSlug(newSlug);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  const searchAdmin = async (email: string) => {
    // Reset admin data dan validasi saat input kosong
    if (!email) {
      setAdminMessage("");
      setAdmin({ id: null, email: "" });
      setLoading(false);  // Reset loading saat input kosong
      return;
    }

    // Validasi format email menggunakan regex
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setLoading(false);  // Reset loading saat email tidak valid
      setAdminMessage("Format email belum benar");
      setAdmin({ id: null, email: "" });
      return;
    }

    // Set loading true saat pencarian dimulai
    setLoading(true);

    // Jika valid, lanjutkan dengan proses pencarian admin
    if (abortController) abortController.abort();
    const controller = new AbortController();
    setAbortController(controller);

    try {
      const res = await useAxios.get(`/user/admin?email=${email}`, {
        headers: { Authorization: `Bearer ${authToken}` },
        signal: controller.signal,
      });

      setLoading(false);  // Set loading false setelah mendapatkan response

      if (res.data?.status === "success") {
        setAdminMessage(res.data.message);
        setAdmin(res.data.admin);
      } else {
        setAdminMessage(res.data.message);
        setAdmin({ id: null, email: "" });
      }
    } catch (error: any) {
      setLoading(false);  // Set loading false jika error
      if (error.name === "CanceledError" || error.code === "ERR_CANCELED") return;
      console.error("search error", error);
      setAdminMessage(error?.response?.data?.message);
      setAdmin({ id: null, email: "" });
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setSearchEmail(email);
    searchAdmin(email);
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Create New Major" />
      <ComponentCard title="Major Form" desc="Please complete the form to create a new major">
        <form onSubmit={handleSubmit}>
          {/* Search Admin */}
          <div>
            <Label>Search Admin</Label>
            <Input
              type="text"
              name="adminEmail"
              placeholder="Search admin by email"
              onChange={handleEmailChange}
              value={searchEmail}
            />
            {loading && (
              <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                <span>Mencari...</span>
              </div>
            )}
            {adminMessage && (
              <p className={`mt-1 text-sm ${admin.id ? "text-green-500" : "text-red-500"}`}>
                {adminMessage}
              </p>
            )}
            {/* Hidden admin_id */}
            {admin.id && (
              <input type="hidden" name="admin_id" value={admin.id} />
            )}
          </div>

          {/* Major Fields */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <Label>Logo</Label>
              <FileInput className="custom-class" onChange={handleLogoChange} />
              {logoPreview && (
                <Image
                  src={logoPreview}
                  alt="Logo Preview"
                  className="mt-2 h-24 w-auto rounded border"
                  width={300}
                  height={300}
                />
              )}
            </div>

            <div>
              <Label>Banner</Label>
              <FileInput className="custom-class" onChange={handleBannerChange} />
              {bannerPreview && (
                <Image
                  src={bannerPreview}
                  alt="Banner Preview"
                  className="mt-2 h-24 w-full object-cover rounded border"
                  width={300}
                  height={300}
                />
              )}
            </div>

            <div>
              <Label>Name</Label>
              <Input
                type="text"
                name="name"
                placeholder="Enter major name"
                onChange={handleNameChange}
              />
            </div>

            <div>
              <Label>Slug</Label>
              <Input
                type="text"
                name="slug"
                placeholder="e.g. computer_science"
                value={slug}
                readOnly
                disabled
              />
            </div>

            <div>
              <Label>Acronym</Label>
              <Input
                type="text"
                name="acronim"
                placeholder="e.g. CS"
                value={acronim}
                readOnly
                disabled
              />
            </div>

            <div className="col-span-2">
              <Label>Description</Label>
              <TextArea
                placeholder="Optional: Add a description for this major"
                rows={4}
              />
            </div>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}
