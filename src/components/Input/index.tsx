import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type: string;
}

export default function Input({ type, label, ...props }: InputProps) {
  return (
    <div className="flex flex-col w-full ">
      <p>{label}</p>
      <input
        {...props}
        type={type}
        className="border rounded-lg h-12 w-full appearance-none px-4"
      />
    </div>
  );
}
