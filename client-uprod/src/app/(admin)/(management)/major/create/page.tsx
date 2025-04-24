/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useRef, ChangeEvent, FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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
import Loader from "@/components/common/Loader";
import InputErrorMessage from "@/components/form/input/InputErrorMessage";

interface FormInputType {
  logo_path: File | null;
  banner_path: File | null;
  name: string;
  slug: string;
  acronym: string;
  description: string;
}

export default function CreateMajor() {
  const router = useRouter();
  const { authToken } = useAuth();

  // State
  const [searchEmail, setSearchEmail] = useState("");
  const [adminData, setAdminData] = useState({ id: null, email: "" });
  const [adminMessage, setAdminMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [errorMessage, setErrorMessage] = useState("");

  const [formInput, setFormInput] = useState<FormInputType>({
    logo_path: null,
    banner_path: null,
    name: "",
    slug: "",
    acronym: "",
    description: "",
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  // AbortController
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "name") {
      const slug = generateSlug(value);
      const acronym = generateAcronym(value);
      setFormInput({ ...formInput, name: value, slug, acronym });
    } else {
      setFormInput({ ...formInput, [name]: value });
    }
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    setPreview: (value: string) => void
  ) => {
    const { name } = e.target;
    const file = e.target.files?.[0];
    if (file) {
      setFormInput((prev) => ({ ...prev, [name]: file }));
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleEmailAdminChange = (e: ChangeEvent<HTMLInputElement>) => {
    const adminEmail = e.target.value;
    setSearchEmail(adminEmail);
    searchAdmin(adminEmail);
  };

  const searchAdmin = async (email: string) => {
    if (!email) return resetAdmin();

    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail) return setInvalidAdmin("Invalid email format");

    setIsLoading(true);

    if (abortController) abortController.abort();
    const controller = new AbortController();
    setAbortController(controller);

    try {
      const res = await useAxios.get(`/user/admin?email=${email}`, {
        headers: { Authorization: `Bearer ${authToken}` },
        signal: controller.signal,
      });

      const { status, message, admin } = res.data;

      switch (status) {
        case "success":
          setAdminData(admin);
          setAdminMessage(message);
          break;
        case "error":
          setAdminMessage(message);
          break;
        default:
          resetAdmin();
          break;
      }

    } catch (error: any) {
      if (error.name !== "CanceledError") {
        setAdminMessage(error?.response?.data?.message || "Failed to fetch admin");
        setAdminData({ id: null, email: "" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resetAdmin = () => {
    setAdminData({ id: null, email: "" });
    setAdminMessage("");
    setIsLoading(false);
  };

  const setInvalidAdmin = (message: string) => {
    setAdminData({ id: null, email: "" });
    setAdminMessage(message);
    setIsLoading(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!adminData.id) return setAdminMessage("Please select an admin first");

    setIsLoading(true);

    const formData = new FormData();
    formData.append("admin_id", String(adminData.id));
    formData.append("name", formInput.name);
    formData.append("slug", formInput.slug);
    formData.append("acronym", formInput.acronym);
    formData.append("description", formInput.description);

    if (formInput.logo_path) {
      formData.append("logo_path", formInput.logo_path);
    }

    if (formInput.banner_path) {
      formData.append("banner_path", formInput.banner_path);
    }

    try {
      const res = await useAxios.post("/major/create", formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(res.data.message);
      router.push("/major");
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Create major failed";
      setErrorMessage(msg);

      const validationErrors = error?.response?.data?.errors;
      if (validationErrors) {
        setFieldErrors(validationErrors);
      } else {
        setFieldErrors({});
      }

      toast.error(msg);
    }
    finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <PageBreadcrumb />
      <ComponentCard title="Major Form" desc="Please complete the form to create a new major">
        <form onSubmit={handleSubmit} className="space-y-6" encType="multipart/form-data">
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
            {isLoading && <Loader />}
            {adminMessage && (
              <p className={`text-sm mt-2 ${adminData.id ? "text-green-500" : "text-red-500"}`}>
                {adminMessage}
              </p>
            )}
            {adminData.id && <input type="hidden" name="admin_id" value={adminData.id} />}
          </FormInputGroup>

          {/* Logo */}
          <FormInputGroup title="Logo" description="Upload logo">
            <Image
              src={logoPreview || "/images/default-image.webp"}
              alt="Logo Preview"
              className="h-32 w-32 rounded-full border object-cover"
              width={128}
              height={128}
            />
            <Label>Logo</Label>
            <FileInput name="logo_path" onChange={(e) => handleFileChange(e, setLogoPreview)} />
            <InputErrorMessage errors={fieldErrors} fieldName="logo_path" />
          </FormInputGroup>

          {/* Banner */}
          <FormInputGroup title="Banner" description="Upload banner">
            <Image
              src={bannerPreview || "/images/default-image.webp"}
              alt="Banner Preview"
              className="w-full aspect-video rounded border object-cover"
              width={1280}
              height={720}
            />
            <Label>Banner</Label>
            <FileInput name="banner_path" onChange={(e) => handleFileChange(e, setBannerPreview)} />
            <InputErrorMessage errors={fieldErrors} fieldName="banner_path" />
          </FormInputGroup>

          {/* Major Name */}
          <FormInputGroup title="Major Name" description="Fill major name">
            <Label>Major Name</Label>
            <Input
              name="name"
              placeholder="Enter major name"
              value={formInput.name}
              onChange={handleInputChange}
            />
            <InputErrorMessage errors={fieldErrors} fieldName="name" />
          </FormInputGroup>

          {/* Slug (read-only) */}
          <FormInputGroup title="Slug" description="Generated automatically">
            <Label>Slug</Label>
            <Input name="slug" value={formInput.slug} readOnly disabled />
            <InputErrorMessage errors={fieldErrors} fieldName="slug" />
          </FormInputGroup>

          {/* Acronym (read-only) */}
          <FormInputGroup title="Acronym" description="Generated automatically">
            <Label>Acronym</Label>
            <Input name="acronym" value={formInput.acronym} readOnly disabled />
            <InputErrorMessage errors={fieldErrors} fieldName="acronym" />
          </FormInputGroup>

          {/* Description */}
          <FormInputGroup title="Description" description="Short major description">
            <Label>Description</Label>
            <TextArea
              name="description"
              value={formInput.description}
              onChange={handleInputChange}
            />
            <InputErrorMessage errors={fieldErrors} fieldName="description" />
          </FormInputGroup>

          {/* Submit Button */}
          <div className="grid grid-cols-3">
            <div />
            <Button className="w-full" disabled={isLoading}>
              {isLoading ? "Loading..." : "Create new major"}
            </Button>
            <div />
          </div>
        </form>

      </ComponentCard>
    </div>
  );
}

// Utility Functions
const generateSlug = (text: string) =>
  text.trim().toLowerCase().replace(/\s+/g, "_");

const generateAcronym = (text: string) =>
  text
    .trim()
    .split(/\s+/)
    .filter((word) => /^[A-Z]/.test(word))
    .map((word) => word[0]?.toUpperCase())
    .join("");
