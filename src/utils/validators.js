// Regex en test()
export const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
export const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

export const validateName = (name) => {
  if (name.trim() === "") {
    return "Name is required";
  }
  return "";
};

export const validateEmail = (email) => {
  if (email.trim() === "") {
    return "Email is required";
  }
  if (!emailPattern.test(email)) {
    return "Invalid email address";
  }

  return "";
};

export const getPasswordCriteria = (password) => [
  {
    id: "length",
    label: "At least 8 characters",
    met: password.length >= 8,
  },
  {
    id: "case",
    label: "Uppercase and lowercase letter",
    met: /[a-z]/.test(password) && /[A-Z]/.test(password),
  },
  {
    id: "number",
    label: "At least one number",
    met: /\d/.test(password),
  },
  {
    id: "special",
    label: "At least one special character (@$!%*?&)",
    met: /[@$!%*?&]/.test(password),
  },
];

export const validatePassword = (password) => {
  if (password.trim() === "") {
    return "Password is required";
  }
  if (!passwordPattern.test(password)) {
    return "Password must be at least 8 characters and include uppercase, lowercase, number and special character";
  }

  return "";
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (confirmPassword.trim() === "") {
    return "Confirm password is required";
  }
  if (confirmPassword !== password) {
    return "Password  do not match";
  }

  return "";
};
