import React from "react";

interface FormInputGroupProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

const FormInputGroup: React.FC<FormInputGroupProps> = ({ title, description, children }) => {
  return (
    <div className="grid grid-cols-3 mb-10">
      <div>
        <h3 className="text-base font-medium text-gray-800 dark:text-white/90">
          {title}
        </h3>
        {description && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {description}
          </p>
        )}
      </div>
      <div>
        {children}
      </div>
    </div>
  );
};

export default FormInputGroup;
