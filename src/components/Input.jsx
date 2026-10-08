import { forwardRef } from "react";
import "./Input.css";

// Forward refs so parent components can access the real input element.
const Input = forwardRef(
  (
    {
      type = "text",
      name,
      id,
      value,
      onChange,
      placeholder,
      disabled = false,
      className = "",
      ...props
    },
    ref,
  ) => {
    // Reusable input that supports both normal props and parent-controlled refs.
    return (
      <input
        ref={ref}
        type={type}
        name={name}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={className}
        {...props}
      />
    );
  },
);

export default Input;