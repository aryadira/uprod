"use client";
import { useState } from "react";
import ComponentCard from "@/components/common/ComponentCard";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Label from "@/components/form/Label";
import FileInput from "@/components/form/input/FileInput";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Image from "next/image";

export default function CreateMajor() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const [acronim, setAcronim] = useState<string>("")
  const [slug, setSlug] = useState<string>("");

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBannerPreview(URL.createObjectURL(file));
    }
  };

 const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const newName = e.target.value;
  setName(newName);

  // Generate acronym (e.g. Sistem Informasi → SI)
  const newAcronim = newName
    .trim()
    .split(/\s+/) // handle spasi lebih dari satu
     .filter(
          (word) => word && !word.includes(word.toLowerCase())
        )
    .map((word) => word[0]?.toUpperCase())
    .join("");
  setAcronim(newAcronim);

  // Generate slug (e.g. Sistem Informasi → sistem_informasi)
  const newSlug = newName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
  setSlug(newSlug);
};

  return (
    <div>
      <PageBreadcrumb pageTitle="Create New Major" />
      <ComponentCard
        title="Major Form"
        desc="Please complete the form to create a new major"
      >
        <div>
          <Label>Search Admin</Label>
          <Input type="text" name="adminName" placeholder="Search admin" />
        </div>

        <div className="grid grid-cols-2 gap-4">
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
            <Label>Code</Label>
            <Input type="text" name="code" placeholder="Enter unique major code" />
          </div>

          <div>
            <Label>Name</Label>
            <Input type="text" name="name" placeholder="Enter major name" onChange={handleNameChange} />
          </div>

          <div>
            <Label>Slug</Label>
            <Input type="text" name="slug" placeholder="e.g. CS" value={slug} readOnly disabled />
          </div>

          <div>
            <Label>Acronym</Label>
            <Input type="text" name="acronim" placeholder="e.g. CS" value={acronim} readOnly disabled />
          </div>

          <div className="col-span-2">
            <Label>Description</Label>
            <TextArea
              placeholder="Optional: Add a description for this major"
              rows={4}
            />
          </div>
        </div>
      </ComponentCard>
    </div>
  );
}
