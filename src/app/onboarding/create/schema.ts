import { z } from "zod";

const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(4, { message: "Invalid Name" }),
});

export default createOrganizationSchema;