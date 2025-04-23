/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { FormEvent, useState, ChangeEvent } from "react";
import Image from "next/image";
import useAxios from "@/hooks/useAxios";
import { useAuth } from "@/context/AuthContext";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import FormInputGroup from "@/components/form/form-elements/FormInputGroup";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
import FileInput from "@/components/form/input/FileInput";
import TextArea from "@/components/form/input/TextArea";
import Button from "@/components/ui/button/Button";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Loader from "@/components/common/Loader";

export default function CreateMajor() {
  const { authToken } = useAuth();
  const router = useRouter();

  const [admin, setAdmin] = useState({ id: null, email: "" });
  const [searchEmail, setSearchEmail] = useState("");
  const [adminMessage, setAdminMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [acronym, setAcronym] = useState<string>("");
  const [slug, setSlug] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    setPreview: (value: string) => void
  ) => {
    const file = event.target.files?.[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value.trim();
    setAcronym(
      name
        .trim()
        .split(/\s+/)
        .filter((word) => word && !word.includes(word.toLowerCase()))
        .map((word) => word[0]?.toUpperCase())
        .join("")
    );
    setSlug(name.toLowerCase().replace(/\s+/g, "_"));
  };

  const handleEmailAdminChange = (e: ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setSearchEmail(email);
    searchAdmin(email);
  };

  const searchAdmin = async (email: string) => {
    if (!email) return resetAdmin();

    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isEmailValid) return setInvalidAdmin("Invalid email format");

    setLoading(true);
    if (abortController) abortController.abort();
    const controller = new AbortController();
    setAbortController(controller);

    try {
      const res = await useAxios.get(`/user/admin?email=${email}`, {
        headers: { Authorization: `Bearer ${authToken}` },
        signal: controller.signal,
      });
      setAdminMessage(res.data.message);
      setAdmin(res.data.status === "success" ? res.data.admin : { id: null, email: "" });
    } catch (error: any) {
      if (error.name !== "CanceledError") {
        setAdminMessage(error?.response?.data?.message || "Failed to fetch admin");
        setAdmin({ id: null, email: "" });
      }
    } finally {
      setLoading(false);
    }
  };

  const resetAdmin = () => {
    setAdmin({ id: null, email: "" });
    setAdminMessage("");
    setLoading(false);
  };

  const setInvalidAdmin = (message: string) => {
    setAdmin({ id: null, email: "" });
    setAdminMessage(message);
    setLoading(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    if (!admin.id) {
      setAdminMessage("Please select an admin first");
      return;
    }

    const formData = new FormData(e.currentTarget);
    ["logo", "banner"].forEach(name => {
      const input = e.currentTarget.querySelector<HTMLInputElement>(`input[type="file"][name="${name}"]`);
      if (input?.files?.[0]) formData.append(name, input.files[0]);
    });

    try {
      const res = await useAxios.post("/major/create", formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });
      const { message } = res.data;
      toast.success(message)
      router.push('/major');
    } catch (error: any) {
      setErrorMessage(error);
      toast.error(error);
      console.error("Create major error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Create New Major" />
      <ComponentCard title="Major Form" desc="Please complete the form to create a new major">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Admin Selection */}
          <FormInputGroup title="Choose Admin" description="Search admin by email">
            <Label>Admin</Label>
            <Input
              type="text"
              name="adminEmail"
              placeholder="Search admin by email"
              value={searchEmail}
              onChange={handleEmailAdminChange}
            />
            {loading && 
            <Loader/>
            }
            {adminMessage && <p className={`text-sm mt-2 ${admin.id ? "text-green-500" : "text-red-500"}`}>{adminMessage}</p>}
            {admin.id && <input type="hidden" name="admin_id" value={admin.id} />}
          </FormInputGroup>

          {/* Logo Upload */}
          <FormInputGroup title="Logo" description="Upload logo">
            <Image
              src={logoPreview || "/images/default-image.webp"}
              alt="Logo Preview"
              className="h-32 w-32 rounded-full border object-cover"
              width={128}
              height={128}
            />
            <Label>Logo</Label>
            <FileInput name="logo" onChange={e => handleFileChange(e, setLogoPreview)} />
          </FormInputGroup>

          {/* Banner Upload */}
          <FormInputGroup title="Banner" description="Upload banner">
            <Image
              src={bannerPreview || "/images/default-image.webp"}
              alt="Banner Preview"
              className="w-full aspect-video rounded border object-cover"
              width={1280}
              height={720}
            />
            <Label>Banner</Label>
            <FileInput name="banner" onChange={e => handleFileChange(e, setBannerPreview)} />
          </FormInputGroup>

          {/* Major Name */}
          <FormInputGroup title="Major Name" description="Fill major name">
            <Label>Major Name</Label>
            <Input name="name" placeholder="Enter major name" onChange={handleNameChange} error={!!errorMessage} hint={errorMessage} />
          </FormInputGroup>

          {/* Slug */}
          <FormInputGroup title="Slug" description="Generated automatically">
            <Label>Slug</Label>
            <Input name="slug" value={slug} readOnly disabled error={!!errorMessage} hint={errorMessage} />
          </FormInputGroup>

          {/* Acronym */}
          <FormInputGroup title="Acronym" description="Generated automatically">
            <Label>Acronym</Label>
            <Input name="acronim" value={acronym} readOnly disabled error={!!errorMessage} hint={errorMessage} />
          </FormInputGroup>

          {/* Description */}
          <FormInputGroup title="Description" description="Short major description">
            <Label>Description</Label>
            <TextArea name="description" value={description} onChange={setDescription} error={!!errorMessage} hint={errorMessage} />
          </FormInputGroup>

          {/* Submit Button */}
          <div className="grid grid-cols-3">
            <div></div>
            <Button className="w-full" disabled={loading}>{loading ? "Loading..." : "Create new major"}</Button>
            <div></div>
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}