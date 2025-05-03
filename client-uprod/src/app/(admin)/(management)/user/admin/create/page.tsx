/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, ChangeEvent, FormEvent } from "react";
// import Image from "next/image"; // Removed unused import
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import useAxios from "@/hooks/useAxios";
import { useAuth } from "@/context/AuthContext";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import ComponentCard from "@/components/common/ComponentCard";
import FormInputGroup from "@/components/form/form-elements/FormInputGroup";
import Label from "@/components/form/Label";
import Input from "@/components/form/input/InputField";
// import FileInput from "@/components/form/input/FileInput"; // Removed unused import
// import TextArea from "@/components/form/input/TextArea"; // Removed unused import
import Button from "@/components/ui/button/Button";
import InputErrorMessage from "@/components/form/input/InputErrorMessage";
import { EyeCloseIcon, EyeIcon } from "@/icons"; // Added for password visibility
import TextArea from "@/components/form/input/TextArea";

// Updated interface for Admin creation including profile details
interface FormInputType {
  name: string; // This likely corresponds to 'full_name' in the admins table or 'name' in users table. Clarify which one is intended for user creation.
  email: string;
  password: string;
  password_confirmation: string;
  // Added fields from admins table schema
  nik?: string | null; // Optional and can be null
  no_ktp?: string | null; // Optional and can be null
  full_name: string; // Added, assuming 'name' above was for the user account, and this is for the admin profile
  place_of_birth?: string | null; // Optional and can be null
  date_of_birth?: string | null; // Using string for date input, can be null
  gender?: 'male' | 'female' | null; // Optional and can be null
  address?: string | null; // Optional and can be null
  phone_number?: string | null; // Optional and can be null
}

// Renamed component
export default function CreateAdminUser() {
  const router = useRouter();
  const { authToken } = useAuth();

  // Updated State
  const [isLoading, setIsLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const [errorMessage, setErrorMessage] = useState(""); // Keep general error message state

  // Initialize form state for admin creation
  const [formInput, setFormInput] = useState<FormInputType>({
    name: "", // For user account
    email: "",
    password: "",
    password_confirmation: "",
    // Added fields from admins table schema
    nik: null,
    no_ktp: null,
    full_name: "", // For admin profile
    place_of_birth: null,
    date_of_birth: null, // Initialize as null or empty string ""
    gender: null, // Initialize as null or a default value if needed
    address: null,
    phone_number: null,
  });

  // State for password visibility
  const [showPassword, setShowPassword] = useState({
    password: false,
    password_confirmation: false,
  });

  // Simplified input handler
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => { // Added Select and TextArea
    const { name, value } = e.target;
    setFormInput((prev) => ({ ...prev, [name]: value === "" ? null : value })); // Set to null if empty for optional fields
  };

  // Removed handleFileChange, handleEmailAdminChange, searchAdmin, resetAdmin, setInvalidAdmin
  // Removed AbortController logic

  // Updated handleSubmit for Admin creation
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setFieldErrors({}); // Clear previous errors
    setErrorMessage(""); // Clear previous general error

    // Prepare the payload, potentially separating user data and admin profile data
    // depending on how your backend expects it.
    // For now, sending all fields. Adjust if backend needs separate objects.
    const payload = { ...formInput };

    try {
      // Send data as JSON - Endpoint might need adjustment if it only creates the user first.
      // If the backend handles both user and admin creation in one go:
      const res = await useAxios.post("/user/admin", payload, { // Assuming POST /user/admin handles combined creation
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      toast.success(res.data.message);
      router.push("/user/admin"); // Redirect to admin list page
    } catch (error: any) {
      const msg = error?.response?.data?.message || "Create admin failed";
      setErrorMessage(msg);

      const validationErrors = error?.response?.data?.errors;
      if (validationErrors) {
        setFieldErrors(validationErrors);
      } else {
        setFieldErrors({});
      }

      if (!validationErrors && msg) {
        toast.error(msg);
      } else if (validationErrors) {
        toast.error("Please check the form for errors.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // const genderOptions = [
  //   { value: "male", label: "Male" },
  //   { value: "female", label: "Female" },
  // ];

  return (
    <div>
      <PageBreadcrumb />
      {/* Updated Card Title and Description */}
      <ComponentCard title="Admin Creation Form" desc="Complete the form to create a new admin user and profile">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* User Account Fields */}
          <FormInputGroup title="Account Name" description="Enter the name for the user account">
            <Label>Account Name</Label>
            <Input
              name="name"
              placeholder="Enter account name"
              value={formInput.name}
              onChange={handleInputChange}
            />
            <InputErrorMessage errors={fieldErrors} fieldName="name" />
          </FormInputGroup>

          {/* ... Email, Password, Confirm Password Inputs ... */}
           <FormInputGroup title="Email Address" description="Enter the admin's email address">
            <Label>Email</Label>
            <Input
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formInput.email}
              onChange={handleInputChange}
            />
            <InputErrorMessage errors={fieldErrors} fieldName="email" />
          </FormInputGroup>

          {/* Password Input */}
          <FormInputGroup title="Password" description="Enter a secure password">
            <Label>Password</Label>
            <div className="relative">
              <Input
                name="password"
                placeholder="Enter password"
                type={showPassword.password ? "text" : "password"}
                value={formInput.password}
                onChange={handleInputChange}
              />
              {/* ... eye icon span ... */}
               <span
                onClick={() =>
                  setShowPassword((prev) => ({
                    ...prev,
                    password: !prev.password,
                  }))
                }
                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
              >
                {showPassword.password ? (
                  <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                ) : (
                  <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                )}
              </span>
            </div>
            <InputErrorMessage errors={fieldErrors} fieldName="password" />
          </FormInputGroup>

          {/* Password Confirmation Input */}
          <FormInputGroup title="Confirm Password" description="Re-enter the password">
            <Label>Confirm Password</Label>
            <div className="relative">
              <Input
                name="password_confirmation"
                placeholder="Confirm password"
                type={showPassword.password_confirmation ? "text" : "password"}
                value={formInput.password_confirmation}
                onChange={handleInputChange}
              />
              {/* ... eye icon span ... */}
               <span
                onClick={() =>
                  setShowPassword((prev) => ({
                    ...prev,
                    password_confirmation: !prev.password_confirmation,
                  }))
                }
                className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
              >
                {showPassword.password_confirmation ? (
                  <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                ) : (
                  <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                )}
              </span>
            </div>
            <InputErrorMessage errors={fieldErrors} fieldName="password_confirmation" />
          </FormInputGroup>


          {/* Divider or Section Title for Profile */}
          <hr className="my-4 border-gray-300 dark:border-gray-600" />
          <h3 className="text-lg font-semibold mb-2">Admin Profile Details</h3>

          {/* Admin Profile Fields */}
          <FormInputGroup title="Full Name (Profile)" description="Enter the admin's full name for the profile">
            <Label>Full Name</Label>
            <Input
              name="full_name"
              placeholder="Enter full name"
              value={formInput.full_name}
              onChange={handleInputChange}
            />
            <InputErrorMessage errors={fieldErrors} fieldName="full_name" />
          </FormInputGroup>

          <FormInputGroup title="NIK" description="National Identity Number (Optional)">
            <Label>NIK</Label>
            <Input
              name="nik"
              placeholder="Enter NIK (16 digits)"
              value={formInput.nik ?? ""}
              onChange={handleInputChange}
              maxLength={16}
            />
            <InputErrorMessage errors={fieldErrors} fieldName="nik" />
          </FormInputGroup>

          <FormInputGroup title="No. KTP" description="ID Card Number (Optional)">
            <Label>No. KTP</Label>
            <Input
              name="no_ktp"
              placeholder="Enter KTP number (16 digits)"
              value={formInput.no_ktp ?? ""}
              onChange={handleInputChange}
              maxLength={16}
            />
            <InputErrorMessage errors={fieldErrors} fieldName="no_ktp" />
          </FormInputGroup>

          <FormInputGroup title="Place of Birth" description="(Optional)">
            <Label>Place of Birth</Label>
            <Input
              name="place_of_birth"
              placeholder="Enter place of birth"
              value={formInput.place_of_birth ?? ""}
              onChange={handleInputChange}
            />
            <InputErrorMessage errors={fieldErrors} fieldName="place_of_birth" />
          </FormInputGroup>

          <FormInputGroup title="Date of Birth" description="(Optional)">
            <Label>Date of Birth</Label>
            <Input
              type="date" // Use date input type
              name="date_of_birth"
              value={formInput.date_of_birth ?? ""}
              onChange={handleInputChange}
            />
            <InputErrorMessage errors={fieldErrors} fieldName="date_of_birth" />
          </FormInputGroup>

          {/* You'll need a Select component for Gender */}
          <FormInputGroup title="Gender" description="(Optional)">
             <Label>Gender</Label>
             {/* Replace with your Select component */}
             {/* <Select
                options={genderOptions}
                placeholder="Select Option"
                name="gender"
                value={formInput.gender ?? ""}
                onChange={handleInputChange}
                className="dark:bg-dark-900"
              /> */}
             <select
               name="gender"
               value={formInput.gender ?? ""}
               onChange={handleInputChange}
               className={`h-11 w-full appearance-none rounded-lg border border-gray-300  px-4 py-2.5 pr-11 text-sm shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800 `}
             >
               <option value="">Select Gender</option>
               <option value="male">Male</option>
               <option value="female">Female</option>
             </select>
             <InputErrorMessage errors={fieldErrors} fieldName="gender" />
           </FormInputGroup>

           <FormInputGroup title="Address" description="(Optional)">
            <Label>Description</Label>
            <TextArea
              name="address"
              value={formInput.address ?? ""}
              onChange={handleInputChange}
            />
            <InputErrorMessage errors={fieldErrors} fieldName="description" />
          </FormInputGroup>

          <FormInputGroup title="Phone Number" description="(Optional)">
            <Label>Phone Number</Label>
            <Input
              name="phone_number"
              placeholder="Enter phone number"
              value={formInput.phone_number ?? ""}
              onChange={handleInputChange}
              maxLength={15}
            />
            <InputErrorMessage errors={fieldErrors} fieldName="phone_number" />
          </FormInputGroup>


          {/* ... Submit Button and Error Message ... */}
           {/* Display general error message */}
          {errorMessage && !Object.keys(fieldErrors).length && (
             <p className="text-sm text-red-500 mt-2">{errorMessage}</p>
          )}

          {/* Submit Button */}
          <div className="grid grid-cols-3">
            <div />
            <Button className="w-full" disabled={isLoading}>
              {isLoading ? "Loading..." : "Create Admin User"}
            </Button>
            <div />
          </div>
        </form>
      </ComponentCard>
    </div>
  );
}

// Removed Utility Functions: generateSlug, generateAcronym