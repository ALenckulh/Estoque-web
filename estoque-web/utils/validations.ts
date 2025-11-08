export const validateUsername = (username: string) => {
  if (!username.trim()) return "O nome de usuário é obrigatório.";
  if (username.length < 3) return "O nome de usuário deve ter pelo menos 3 caracteres.";
  return "";
};

export const validateOtp = (otp: string) => {
  if (!otp.trim()) return "O código OTP é obrigatório.";
  if (otp.length !== 5) return "O código OTP deve ter 5 dígitos.";
  return "";
};

export const matchIsString = (text: any): boolean => typeof text === "string";

export const matchIsNumeric = (text: any): boolean => {
  const isNumber = typeof text === "number";
  const isString = matchIsString(text);
  return (isNumber || (isString && text !== "")) && !isNaN(Number(text));
};

export const validateOtpChar = (value: string, index?: number): boolean => {
  return matchIsNumeric(value);
};

export const validateEmail = (email: string) => {
  if (!email.trim()) return "O e-mail é obrigatório.";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return "Informe um e-mail válido.";
  return "";
};

export const validatePassword = (password: string) => {
  if (!password.trim()) return "A senha é obrigatória.";
  if (password.length < 8) return "A senha deve ter pelo menos 8 caracteres.";
  const hasNumber = /\d/;
  const hasUppercase = /[A-Z]/;
  if (!hasNumber.test(password)) return "A senha deve conter pelo menos 1 número.";
  if (!hasUppercase.test(password)) return "A senha deve conter pelo menos 1 letra maiúscula.";
  return "";
};

export const validateSignInPassword = (password: string) => {
  if (!password.trim()) return "A senha é obrigatória.";
  return "";
};

export const validateConfirmPassword = (password: string, confirmPassword: string) => {
  if (!confirmPassword.trim()) return "A confirmação de senha é obrigatória.";
  if (password !== confirmPassword) return "As senhas não coincidem.";
  return "";
};

export const validateRequiredField = (value: string, fieldLabel: string) => {
  if (!value.trim()) return `O ${fieldLabel} é obrigatório.`;
  return "";
};

export const validateEntityName = (name: string) => {
  return validateRequiredField(name, "nome da entidade");
};

export const validateProductName = (name: string) => {
  return validateRequiredField(name, "nome do produto");
};
