import { hash, compare } from "bcryptjs";
//hashing password
export const doHash = async (value, saltValue) => {
  const result = hash(value, saltValue);
  return result;
};

//Validating the hash password i
export const doHashValidation = async (value, hashedValue) => {
  if (!value || !hashedValue) {
    throw new Error("Password or hashed password is missing");
  }

  const result = compare(value, hashedValue);
  return result;
};
