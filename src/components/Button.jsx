// Load the shared button styles used by the reusable Button component.
import "./button.css";
const Button = ({
  children,
  type = "button",
  disabled = false,
  onClick,
  className = "",
}) => {
  // Reusable button that keeps common button behavior in one component.
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={className}
    >
      {children}
    </button>
  );
};

export default Button;
