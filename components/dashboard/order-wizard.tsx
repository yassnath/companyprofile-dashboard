"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, Save } from "lucide-react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { saveOrderDraftAction } from "@/lib/actions/order-actions";
import { serviceCatalog, serviceTypeLabel } from "@/lib/constants";
import { orderDraftSchema, type OrderDraftInput } from "@/lib/validations";
import { useOrderDraftStore } from "@/stores/order-draft-store";
import { Badge } from "@/components/ui/badge";
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
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";

const stepTitles = [
  "Select service",
  "Project details",
  "Brand and references",
  "Contact and confirmation",
] as const;

type OrdersQueryData = {
  data: Array<{
    id: string;
    title: string;
    serviceType: string;
    status: string;
    updatedAt: string;
    createdAt: string;
  }>;
  [key: string]: unknown;
};

export function OrderWizard({
  initialDraft,
  user,
}: {
  initialDraft?: Partial<OrderDraftInput>;
  user: { name?: string | null; email?: string | null };
}) {
  const queryClient = useQueryClient();

  const { draft, updateDraft, clearDraft } = useOrderDraftStore();

  const [step, setStep] = useState(initialDraft?.id ? 2 : draft.step ?? 1);
  const [orderId, setOrderId] = useState<string | undefined>(initialDraft?.id as string | undefined);
  const [lastSavedText, setLastSavedText] = useState<string>("Belum disimpan");
  const [submittedOrderId, setSubmittedOrderId] = useState<string | null>(null);

  const form = useForm<OrderDraftInput>({
    resolver: zodResolver(orderDraftSchema) as never,
    defaultValues: {
      serviceType: undefined,
      title: "",
      description: "",
      targetAudience: "",
      deadline: "",
      budgetMin: undefined,
      budgetMax: undefined,
      brandColors: "",
      exampleLinks: "",
      references: [],
      contactName: user.name || "",
      contactEmail: user.email || "",
      contactPhone: "",
      submit: false,
      ...draft,
      ...initialDraft,
    },
  });

  useEffect(() => {
    if (initialDraft) {
      form.reset({
        ...form.getValues(),
        ...initialDraft,
      });
      setOrderId(initialDraft.id as string | undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const watchedValues = useWatch({ control: form.control });

  useEffect(() => {
    const timeout = setTimeout(() => {
      updateDraft({
        ...watchedValues,
        step,
        id: orderId,
      });
    }, 350);

    return () => clearTimeout(timeout);
  }, [watchedValues, step, orderId, updateDraft]);

  const mutation = useMutation({
    mutationFn: async (payload: OrderDraftInput) => saveOrderDraftAction(payload),
    onMutate: async (payload) => {
      setLastSavedText("Menyimpan draft...");
      const previous = queryClient.getQueriesData({ queryKey: ["orders"] });

      queryClient.setQueriesData({ queryKey: ["orders"] }, (oldData: OrdersQueryData | undefined) => {
        if (!oldData || !oldData.data) return oldData;

        const optimisticId = (orderId || payload.id || "optimistic-draft") as string;
        const row = {
          id: optimisticId,
          title: payload.title || "Untitled Draft",
          serviceType: payload.serviceType || "LANDING_PAGE",
          status: payload.submit ? "SUBMITTED" : "DRAFT",
          updatedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        };

        const exists = oldData.data.some((item: { id: string }) => item.id === optimisticId);

        return {
          ...oldData,
          data: exists
            ? oldData.data.map((item: { id: string }) => (item.id === optimisticId ? { ...item, ...row } : item))
            : [row, ...oldData.data],
        };
      });

      return { previous };
    },
    onError: (error, _payload, context) => {
      context?.previous?.forEach(([key, value]) => queryClient.setQueryData(key, value));
      setLastSavedText("Gagal autosave");
      toast.error(error.message || "Gagal menyimpan draft");
    },
    onSuccess: (result, payload) => {
      if (!result.success) {
        setLastSavedText("Validasi gagal");
        toast.error(result.message);
        return;
      }

      if (result.orderId) {
        setOrderId(result.orderId);
        updateDraft({ id: result.orderId });
      }

      setLastSavedText(`Tersimpan ${new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`);

      if (payload.submit && result.orderId) {
        setSubmittedOrderId(result.orderId);
        clearDraft();
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const progress = useMemo(() => (step / stepTitles.length) * 100, [step]);

  async function saveDraft() {
    const values = form.getValues();
    mutation.mutate({
      ...values,
      id: orderId,
      submit: false,
    });
  }

  async function goNext() {
    let valid = true;

    if (step === 1) {
      valid = await form.trigger(["serviceType"]);
    }
    if (step === 2) {
      valid = await form.trigger(["title", "description", "targetAudience", "budgetMin", "budgetMax"]);
    }
    if (step === 4) {
      valid = await form.trigger(["contactName", "contactEmail"]);
    }

    if (!valid) {
      toast.error("Lengkapi field wajib pada langkah ini.");
      return;
    }

    await saveDraft();
    setStep((prev) => Math.min(prev + 1, 4));
  }

  async function submitOrder() {
    const valid = await form.trigger([
      "serviceType",
      "title",
      "description",
      "targetAudience",
      "contactName",
      "contactEmail",
      "budgetMin",
      "budgetMax",
    ]);

    if (!valid) {
      toast.error("Mohon lengkapi data order sebelum submit.");
      return;
    }

    const values = form.getValues();

    mutation.mutate({
      ...values,
      id: orderId,
      submit: true,
    });
  }

  if (submittedOrderId) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-2xl border bg-card p-8 text-center">
          <CheckCircle2 className="mx-auto size-12 text-primary" />
          <h2 className="mt-4 font-heading text-3xl font-bold">Order submitted</h2>
          <p className="mt-2 text-muted-foreground">Order Anda berhasil dikirim dengan ID:</p>
          <p className="mt-2 font-mono text-sm font-medium">{submittedOrderId}</p>
          <p className="mt-4 text-sm text-muted-foreground">
            Next steps: tim kami akan melakukan review scope dan menghubungi Anda dalam 1x24 jam kerja.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Button asChild className="rounded-xl">
              <Link href={`/app/orders/${submittedOrderId}`}>View Order Detail</Link>
            </Button>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => {
                setSubmittedOrderId(null);
                setOrderId(undefined);
                setStep(1);
                form.reset({
                  contactName: user.name || "",
                  contactEmail: user.email || "",
                  submit: false,
                });
              }}
            >
              Create Another
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
        className="space-y-6"
      >
        <div className="rounded-2xl border bg-card p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-heading text-2xl font-semibold">Create New Order</h1>
              <p className="text-sm text-muted-foreground">Step {step} dari 4 - {stepTitles[step - 1]}</p>
            </div>
            <Badge variant="secondary">{lastSavedText}</Badge>
          </div>
          <Progress value={progress} className="mt-4 h-2" />
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-muted-foreground sm:grid-cols-4">
            {stepTitles.map((title, index) => (
              <div
                key={title}
                className={`rounded-lg border px-2 py-1 ${step >= index + 1 ? "border-primary/40 text-primary" : ""}`}
              >
                {index + 1}. {title}
              </div>
            ))}
          </div>
        </div>

        {step === 1 ? (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {serviceCatalog.map((service) => {
              const active = form.watch("serviceType") === service.type;

              return (
                <button
                  type="button"
                  key={service.type}
                  onClick={() => form.setValue("serviceType", service.type, { shouldValidate: true })}
                  className={`soft-card text-left transition ${active ? "ring-2 ring-primary/50" : "hover:translate-y-[-3px]"}`}
                >
                  <div className="p-5">
                    <p className="font-heading text-lg font-semibold">{serviceTypeLabel[service.type]}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{service.summary}</p>
                    <p className="mt-3 text-xs text-muted-foreground">Delivery {service.delivery}</p>
                  </div>
                </button>
              );
            })}
            <FormField
              control={form.control}
              name="serviceType"
              render={() => (
                <FormItem>
                  <FormMessage />
                </FormItem>
              )}
            />
          </section>
        ) : null}

        {step === 2 ? (
          <section className="rounded-2xl border bg-card p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Project Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Redesign Landing B2B SaaS" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-32" placeholder="Jelaskan kebutuhan proyek Anda" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Target Audience</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Founder startup dan tim marketing" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deadline</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-3">
                <FormField
                  control={form.control}
                  name="budgetMin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget Min</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="5000000"
                          value={field.value ?? ""}
                          onChange={(event) => field.onChange(event.target.value ? Number(event.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="budgetMax"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget Max</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="15000000"
                          value={field.value ?? ""}
                          onChange={(event) => field.onChange(event.target.value ? Number(event.target.value) : undefined)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </section>
        ) : null}

        {step === 3 ? (
          <section className="rounded-2xl border bg-card p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="brandColors"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Brand Colors</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: #0ea5e9, #111827, #f8fafc" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="exampleLinks"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Reference Links</FormLabel>
                    <FormControl>
                      <Textarea
                        className="min-h-28"
                        placeholder="Pisahkan link dengan koma atau baris baru"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="sm:col-span-2">
                <FormLabel>Attachments</FormLabel>
                <div className="mt-2 rounded-xl border border-dashed bg-background/70 p-5 text-sm text-muted-foreground">
                  Upload placeholder: fitur upload file akan diaktifkan pada iterasi berikutnya.
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {step === 4 ? (
          <section className="rounded-2xl border bg-card p-5 sm:p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Nama PIC" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="pic@company.com" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem className="sm:col-span-2">
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="08xxxxxxxxxx" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="mt-6 rounded-xl border bg-background/70 p-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">Konfirmasi</p>
              <p className="mt-1">
                Setelah submit, order akan masuk ke status Submitted dan tim Solvix akan melakukan review.
              </p>
            </div>
          </section>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border bg-card p-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl"
              disabled={step === 1}
              onClick={() => setStep((prev) => Math.max(prev - 1, 1))}
            >
              <ArrowLeft className="mr-2 size-4" />
              Back
            </Button>
            <Button type="button" variant="secondary" className="rounded-xl" onClick={() => void saveDraft()}>
              {mutation.isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
              Save Draft
            </Button>
          </div>

          <div className="flex gap-2">
            {step < 4 ? (
              <Button type="button" className="rounded-xl" onClick={() => void goNext()}>
                Next
                <ArrowRight className="ml-2 size-4" />
              </Button>
            ) : (
              <Button type="button" className="rounded-xl" onClick={() => void submitOrder()} disabled={mutation.isPending}>
                {mutation.isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : <CheckCircle2 className="mr-2 size-4" />}
                Submit Order
              </Button>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
}
