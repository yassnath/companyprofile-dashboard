import { OrderStatus, ServiceType } from "@prisma/client";
import { z } from "zod";

const passwordRule = z
  .string()
  .min(8, "Password minimal 8 karakter")
  .max(128, "Password terlalu panjang")
  .regex(/[A-Z]/, "Password harus memiliki huruf besar")
  .regex(/[a-z]/, "Password harus memiliki huruf kecil")
  .regex(/[0-9]/, "Password harus memiliki angka")
  .regex(/[^a-zA-Z0-9]/, "Password harus memiliki simbol");

export const signUpSchema = z
  .object({
    name: z.string().min(2, "Nama minimal 2 karakter"),
    email: z.string().email("Email tidak valid").toLowerCase(),
    password: passwordRule,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z.string().email("Email tidak valid").toLowerCase(),
  password: z.string().min(1, "Password wajib diisi"),
  rememberMe: z.boolean().optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email tidak valid").toLowerCase(),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(10, "Token tidak valid"),
    password: passwordRule,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok",
    path: ["confirmPassword"],
  });

export const contactLeadSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid").toLowerCase(),
  message: z.string().min(15, "Pesan minimal 15 karakter").max(2000, "Pesan terlalu panjang"),
  sourcePage: z.string().default("/contact"),
});

const orderDraftBaseSchema = z.object({
  id: z.string().optional(),
  serviceType: z.enum(ServiceType).optional(),
  title: z.string().max(120, "Judul terlalu panjang").optional(),
  description: z.string().max(5000, "Deskripsi terlalu panjang").optional(),
  targetAudience: z.string().max(200).optional(),
  deadline: z.string().optional(),
  budgetMin: z.coerce.number().int().min(0).optional(),
  budgetMax: z.coerce.number().int().min(0).optional(),
  brandColors: z.string().max(200).optional(),
  exampleLinks: z.string().max(1000).optional(),
  references: z.array(z.string()).optional(),
  contactName: z.string().optional(),
  contactEmail: z.string().email("Email kontak tidak valid").toLowerCase().optional(),
  contactPhone: z.string().max(30).optional(),
  submit: z.boolean().optional(),
});

const budgetRangeRefinement = (
  data: { budgetMin?: number; budgetMax?: number },
  ctx: z.RefinementCtx,
) => {
  if (data.budgetMin && data.budgetMax && data.budgetMin > data.budgetMax) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Budget minimum tidak boleh lebih besar dari budget maksimum",
      path: ["budgetMin"],
    });
  }
};

export const orderDraftSchema = orderDraftBaseSchema.superRefine(budgetRangeRefinement);

export const orderWizardSchema = orderDraftBaseSchema
  .extend({
    serviceType: z.enum(ServiceType),
    title: z.string().min(4, "Judul minimal 4 karakter").max(120, "Judul terlalu panjang"),
    description: z.string().min(20, "Deskripsi minimal 20 karakter").max(5000, "Deskripsi terlalu panjang"),
    targetAudience: z.string().min(3, "Target audience wajib diisi").max(200),
    contactName: z.string().min(2, "Nama kontak wajib diisi"),
    contactEmail: z.string().email("Email kontak tidak valid").toLowerCase(),
  })
  .superRefine(budgetRangeRefinement);

export const orderFilterSchema = z.object({
  status: z.enum(OrderStatus).optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(5).max(50).default(10),
  sort: z.enum(["createdAt", "updatedAt", "deadline", "status"]).default("updatedAt"),
  order: z.enum(["asc", "desc"]).default("desc"),
});

export const cancelOrderSchema = z.object({
  orderId: z.string().min(1),
  note: z.string().max(400).optional(),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type OrderWizardInput = z.infer<typeof orderWizardSchema>;
export type OrderDraftInput = z.infer<typeof orderDraftSchema>;
