import { z } from "zod";

export const messageSchema = z.object({
  content: z
    .string()
    .min(5, { message: "content must be atlest 5 characteres. " })
    .max(500, { message: "content must be no longer than 500 characteres. " }),
});
