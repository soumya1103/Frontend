export const validationPatterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  mobile: /^[0-9]{10}$/,
  AZ: /[A-Z]/,
  az: /[a-z]/,
  number: /[0-9]/,
  anyChar: /[^A-Za-z0-9]/,
  alphabet: /^[a-zA-Z\s]*$/,
  decimalPattern: /^\d+(\.\d+)?$/,
  specialChar: /[!@#$%^&*(),.?":{}|<>]/g,
};

export const validTLDs = [".com", ".org", ".net", ".in"];
