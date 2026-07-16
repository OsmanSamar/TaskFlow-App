// Regex en test()
// const emailPattern= /[a-z]+@[a-z]+\.[a-z]+/;
// const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
// const passwordPattern =
//   /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
// const passwordPattern =/^.{8,}$/;

export const emailPattern = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
export const passwordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

export const validateEmail = (email) => {
  if (email.trim() === "") {
    return "Email is required";
  }
  if (!emailPattern.test(email)) {
    return "Invalid email address";
  }

  return "";
};

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
