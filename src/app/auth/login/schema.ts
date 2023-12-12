import { z } from "zod";

const signInSchema = z.object({
  email: z.string().email({ message: "Invalid Email" }),
  password: z
    .string()
    .min(6, { message: "Invalid Password" }),
});

export default signInSchema;