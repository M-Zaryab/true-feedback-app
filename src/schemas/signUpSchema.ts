import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(2, "username must be atleast 2 characters.")
  .max(20, "username must be no more than 20 characters. ")
  .regex(/^[a-zA-Z0-9_]+$/, "username must not contain special characters. ");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "password must be atleast 8 characters" })
    .max(20, { message: "password can not be more than 20 characters" }),
});
