import { z } from "zod";

export const productCreateSchema = z.object({
  name: z.string().min(1, "Name is required.").transform((s) => s.trim()),
  description: z
    .string()
    .optional()
    .transform((s) => (s?.trim() || undefined)),
  price: z
    .number({ invalid_type_error: "Valid price (≥ 0) is required." })
    .min(0, "Valid price (≥ 0) is required."),
  category: z
    .string()
    .optional()
    .transform((s) => (s?.trim() || undefined)),
});

/** Form input may have price as number or empty string (from input). */
export const productFormSchema = z.object({
  name: z.string().min(1, "Name is required.").transform((s) => s.trim()),
  description: z.string().optional(),
  price: z.union([
    z.number().min(0, "Valid price (≥ 0) is required."),
    z.literal(""),
  ]),
  category: z.string().optional(),
}).transform((data) => ({
  name: data.name,
  description: data.description?.trim() || undefined,
  price: data.price === "" ? 0 : Number(data.price),
  category: data.category?.trim() || undefined,
}));

export type ProductCreateFormInput = z.input<typeof productFormSchema>;
export type ProductCreateFormOutput = z.output<typeof productFormSchema>;

export function validateProductForm(
  data: unknown
): { success: true; data: ProductCreateFormOutput } | { success: false; errors: Record<string, string> } {
  const result = productFormSchema.safeParse(data);
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
