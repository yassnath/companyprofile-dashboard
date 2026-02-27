"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";

type OrderNowButtonProps = ComponentProps<typeof Button>;

export function OrderNowButton({ children = "Order Now", ...props }: OrderNowButtonProps) {
  const { status } = useSession();

  const href =
    status === "authenticated"
      ? "/app/orders/new"
      : "/auth/sign-in?callbackUrl=%2Fapp%2Forders%2Fnew";

  return (
    <Button asChild {...props}>
      <Link href={href}>{children}</Link>
    </Button>
  );
}
