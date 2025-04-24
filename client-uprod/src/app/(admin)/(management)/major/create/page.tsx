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

export default function CreateMajor() {
  const router = useRouter();
  const { authToken } = useAuth();

  // State
  const [searchEmail, setSearchEmail] = useState("");
  const [adminData, setAdminData] = useState({ id: null, email: "" });
  const [adminMessage, setAdminMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formDataState, setFormDataState] = useState({
    name: "",
    slug: "",
    acronym: "",
    description: "",
  });

  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  // File Refs
  const logoRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);

  // AbortController
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === "name") {
      const slug = generateSlug(value);
      const acronym = generateAcronym(value);
      setFormDataState({ ...formDataState, name: value, slug, acronym });
    } else {
      setFormDataState({ ...formDataState, [name]: value });
    }
  };

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>,
    setPreview: (value: string) => void
  ) => {
    const file = event.target.files?.[0];
    if (file) {
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

    setLoading(true);

    if (abortController) abortController.abort();
    const controller = new AbortController();
    setAbortController(controller);

    try {
      const res = await useAxios.get(`/user/admin?email=${email}`, {
        headers: { Authorization: `Bearer ${authToken}` },
        signal: controller.signal,
      });

      const { status, message, admin } = res.data;

      switch(status) {
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
      setLoading(false);
    }
  };

  const resetAdmin = () => {
    setAdminData({ id: null, email: "" });
    setAdminMessage("");
    setLoading(false);
  };

  const setInvalidAdmin = (message: string) => {
    setAdminData({ id: null, email: "" });
    setAdminMessage(message);
    setLoading(false);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!adminData.id) return setAdminMessage("Please select an admin first");

    setLoading(true);

    const formData = new FormData();
    formData.append("admin_id", String(adminData.id));
    formData.append("name", formDataState.name);
    formData.append("slug", formDataState.slug);
    formData.append("acronym", formDataState.acronym);
    formData.append("description", formDataState.description);

    if (logoRef.current?.files?.[0]) {
      formData.append("logo_path", logoRef.current.files[0]);
    }

    if (bannerRef.current?.files?.[0]) {
      formData.append("banner_path", bannerRef.current.files[0]);
    }

    console.log(formData)

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
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <PageBreadcrumb pageTitle="Create New Major" />
      <ComponentCard title="Major Form" desc="Please complete the form to create a new major">
        <form onSubmit={handleSubmit} className="space-y-6">

          <FormInputGroup title="Choose Admin" description="Search admin by email">
            <Label>Admin</Label>
            <Input
              type="text"
              name="adminEmail"
              placeholder="Search admin by email"
              value={searchEmail}
              onChange={handleEmailAdminChange}
            />
            {loading && <Loader />}
            {adminMessage && (
              <p className={`text-sm mt-2 ${adminData.id ? "text-green-500" : "text-red-500"}`}>
                {adminMessage}
              </p>
            )}
            {adminData.id && <input type="hidden" name="admin_id" value={adminData.id} />}
          </FormInputGroup>

          <FormInputGroup title="Logo" description="Upload logo">
            <Image
              src={logoPreview || "/images/default-image.webp"}
              alt="Logo Preview"
              className="h-32 w-32 rounded-full border object-cover"
              width={128}
              height={128}
            />
            <Label>Logo</Label>
            <FileInput name="logo_path" ref={logoRef} onChange={(e) => handleFileChange(e, setLogoPreview)} />
          </FormInputGroup>

          <FormInputGroup title="Banner" description="Upload banner">
            <Image
              src={bannerPreview || "/images/default-image.webp"}
              alt="Banner Preview"
              className="w-full aspect-video rounded border object-cover"
              width={1280}
              height={720}
            />
            <Label>Banner</Label>
            <FileInput name="banner_path" ref={bannerRef} onChange={(e) => handleFileChange(e, setBannerPreview)} />
          </FormInputGroup>

          <FormInputGroup title="Major Name" description="Fill major name">
            <Label>Major Name</Label>
            <Input
              name="name"
              placeholder="Enter major name"
              value={formDataState.name}
              onChange={handleInputChange}
              error={!!errorMessage}
              hint={errorMessage}
            />
          </FormInputGroup>

          <FormInputGroup title="Slug" description="Generated automatically">
            <Label>Slug</Label>
            <Input name="slug" value={formDataState.slug} readOnly disabled />
          </FormInputGroup>

          <FormInputGroup title="Acronym" description="Generated automatically">
            <Label>Acronym</Label>
            <Input name="acronym" value={formDataState.acronym} readOnly disabled />
          </FormInputGroup>

          <FormInputGroup title="Description" description="Short major description">
            <Label>Description</Label>
            <TextArea
              name="description"
              value={formDataState.description}
              onChange={(e) => handleInputChange(e)}
              error={!!errorMessage}
              hint={errorMessage}
            />
          </FormInputGroup>

          <div className="grid grid-cols-3">
            <div />
            <Button className="w-full" disabled={loading}>
              {loading ? "Loading..." : "Create new major"}
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
