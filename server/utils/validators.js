import validator from "validator";

export const isValidEmail = (email) => {
return validator.isEmail(email);
};

export const isValidPassword = (password) => {
return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(
password,
);
};