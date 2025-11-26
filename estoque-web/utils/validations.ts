export const validateUsername = (username: string) => {
  if (!username.trim()) return "O nome de usuário é obrigatório.";
  if (username.length < 3) return "O nome de usuário deve ter pelo menos 3 caracteres.";
  return "";
};

export const validateOtp = (otp: string) => {
  if (!otp.trim()) return "O código OTP é obrigatório.";
  if (otp.length !== 6) return "O código OTP deve ter 6 dígitos.";
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

export const validateNF = (nf: string) => {
  if (!nf) return "NF é obrigatório.";
  if (!/^[0-9]{9}$/.test(nf)) return "NF deve conter 9 dígitos numéricos.";
  return "";
};

export const validateEntitySelected = (entity: any) => {
  if (!entity) return "A entidade é obrigatória.";
  return "";
};

export const validateClienteSelected = (cliente: any) => {
  if (!cliente) return "O cliente é obrigatório.";
  return "";
};

export const validateFornecedorSelected = (fornecedor: any) => {
  if (!fornecedor) return "O fornecedor é obrigatório.";
  return "";
};

export type ProductRow = { produto: any; quantidade: string | null };

export const validateProductRows = (rows: ProductRow[]) => {
  const errors: Array<{ produto?: string; quantidade?: string }> = [];

  // must have at least one product selected
  const hasAnyProduct = rows.some((r) => !!r.produto);
  if (!hasAnyProduct) {
    // set error on first row product field
    errors[0] = { produto: "Deve haver pelo menos um produto." } as any;
    return { valid: false, errors };
  }

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const hasProduct = !!r.produto;
    const hasQuantity = !!r.quantidade && String(r.quantidade).trim() !== "";
    errors[i] = {};

    if (hasProduct && !hasQuantity) {
      errors[i].quantidade = `A quantidade é obrigatória.`;
    }

    if (!hasProduct && hasQuantity) {
      errors[i].produto = `O produto é obrigatório.`;
    }

    if (hasProduct && hasQuantity) {
      // normalize comma to dot
      const normalized = String(r.quantidade).replace(".", "").replace(",", ".");
      const n = Number(normalized);
      if (!Number.isFinite(n) || !(n > 0)) {
        errors[i].quantidade = `A quantidade deve ser um número positivo.`;
      }
    }
  }

  const anyErrors = errors.some((e) => e && (e.produto || e.quantidade));
  return { valid: !anyErrors, errors };
};

export const validateProductRowsNegative = (rows: ProductRow[]) => {
  const errors: Array<{ produto?: string; quantidade?: string }> = [];

  // must have at least one product selected
  const hasAnyProduct = rows.some((r) => !!r.produto);
  if (!hasAnyProduct) {
    // set error on first row product field
    errors[0] = { produto: "Deve haver pelo menos um produto." } as any;
    return { valid: false, errors };
  }

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    const hasProduct = !!r.produto;
    const hasQuantity = !!r.quantidade && String(r.quantidade).trim() !== "";
    errors[i] = {};

    if (hasProduct && !hasQuantity) {
      errors[i].quantidade = `A quantidade é obrigatória.`;
    }

    if (!hasProduct && hasQuantity) {
      errors[i].produto = `O produto é obrigatório.`;
    }

    if (hasProduct && hasQuantity) {
      // normalize comma to dot and remove minus sign for parsing
      const normalized = String(r.quantidade).replace(".", "").replace(",", ".").replace("-", "");
      const n = Number(normalized);
      if (!Number.isFinite(n) || !(n > 0)) {
        errors[i].quantidade = `A quantidade deve ser um número positivo.`;
      }
      // check if the original value has minus sign (required for output)
      if (!String(r.quantidade).startsWith("-")) {
        errors[i].quantidade = `A quantidade deve ser negativa.`;
      }
    }
  }

  const anyErrors = errors.some((e) => e && (e.produto || e.quantidade));
  return { valid: !anyErrors, errors };
};
