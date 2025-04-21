import React from "react";

interface InputErrorMessageProps {
  errors: string | Record<string, string[] | undefined>;
  fieldName: string;
}

const InputErrorMessage: React.FC<InputErrorMessageProps> = ({ errors, fieldName }) => {
  if (typeof errors === "string") {
    return <p className="text-red-500 text-sm mt-2">{errors}</p>;
  }

  if (errors?.[fieldName]?.length) {
    return <p className="text-red-500 text-sm mt-2">{errors[fieldName]?.[0]}</p>;
  }

  return null;
};

export default InputErrorMessage;
