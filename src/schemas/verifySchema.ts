import { z } from "zod";

// export const verificationCodeValidation = z
//   .string()
//   .length(6, "verification code must be atleast 6 characters. ");

export const verificationSchema = z.object({
  code: z
    .string()
    .length(6, "verification code must be atleast 6 characters. "),
});
