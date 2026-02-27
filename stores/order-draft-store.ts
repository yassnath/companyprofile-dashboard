import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import type { OrderWizardInput } from "@/lib/validations";

export type OrderDraft = Partial<OrderWizardInput> & {
  step?: number;
};

type OrderDraftState = {
  draft: OrderDraft;
  updateDraft: (values: Partial<OrderDraft>) => void;
  clearDraft: () => void;
};

const initialDraft: OrderDraft = {
  step: 1,
  references: [],
};

export const useOrderDraftStore = create<OrderDraftState>()(
  persist(
    (set) => ({
      draft: initialDraft,
      updateDraft: (values) =>
        set((state) => ({
          draft: {
            ...state.draft,
            ...values,
          },
        })),
      clearDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: "solvix-order-draft",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
