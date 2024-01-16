import { z } from "zod";

const signUpSchema = z
  .object({
    name: z.string().min(3, { message: "Invalid Name" }),
    email: z.string().email({ message: "Invalid Email" }),
    password: z.string().min(6, { message: "Invalid Password" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"], // path of error
  });

export default signUpSchema;
