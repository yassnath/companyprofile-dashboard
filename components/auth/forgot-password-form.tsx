"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, MailCheck } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { requestPasswordResetAction } from "@/lib/actions/auth-actions";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { forgotPasswordSchema } from "@/lib/validations";

const schema = forgotPasswordSchema;
type Values = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: Values) {
    const result = await requestPasswordResetAction(values);

    if (!result.success) {
      toast.error(result.message);
      return;
    }

    toast.success(result.message);

    if (process.env.NODE_ENV !== "production") {
      toast.info("Buka halaman Dev Tokens untuk mengambil token reset.");
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@contoh.com" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full rounded-xl" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <MailCheck className="mr-2 size-4" />
              Request Reset Token
            </>
          )}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Sudah ingat password? <Link href="/auth/sign-in" className="text-primary hover:underline">Sign in</Link>
        </p>
      </form>
    </Form>
  );
}
