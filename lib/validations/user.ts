import { z } from "zod";

const roleEnum = z.enum(["admin", "editor", "viewer"]);

export const userCreateSchema = z.object({
  name: z.string().min(1, "Name is required.").transform((s) => s.trim()),
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Invalid email format.")
    .transform((s) => s.trim().toLowerCase()),
  role: z
    .union([roleEnum, z.literal("")])
    .optional()
    .transform((r) => (r === "" ? undefined : r)),
});

export type UserCreateFormInput = z.input<typeof userCreateSchema>;
export type UserCreateFormOutput = z.output<typeof userCreateSchema>;

export function validateUserForm(
  data: unknown
): { success: true; data: UserCreateFormOutput } | { success: false; errors: Record<string, string> } {
  const result = userCreateSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  const flattened = result.error.flatten();
  const errors: Record<string, string> = {};
  for (const [key, messages] of Object.entries(flattened.fieldErrors)) {
    if (Array.isArray(messages) && messages[0]) {
      errors[key] = messages[0];
    }
  }
  return { success: false, errors };
}
