"use client";

import { useMemo, useState } from "react";
import { Clock3, Filter } from "lucide-react";

import { OrderNowButton } from "@/components/shared/order-now-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatIDR } from "@/lib/format";
import { serviceCatalog } from "@/lib/constants";

const categories = [
  { value: "all", label: "All" },
  { value: "web", label: "Web" },
  { value: "mobile", label: "Mobile" },
  { value: "branding", label: "Branding" },
] as const;

export function ServicesCatalog() {
  const [category, setCategory] = useState<(typeof categories)[number]["value"]>("all");

  const rows = useMemo(
    () => serviceCatalog.filter((item) => (category === "all" ? true : item.category === category)),
    [category],
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-2">
        <Filter className="size-4 text-muted-foreground" />
        {categories.map((item) => (
          <Button
            key={item.value}
            size="sm"
            variant={category === item.value ? "default" : "outline"}
            className="rounded-xl"
            onClick={() => setCategory(item.value)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {rows.map((service) => (
          <Card key={service.type} className="rounded-2xl">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <CardTitle>{service.title}</CardTitle>
                <Badge variant="secondary" className="capitalize">
                  {service.category}
                </Badge>
              </div>
              <CardDescription>{service.summary}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock3 className="size-4" />
                  Delivery {service.delivery}
                </div>
                <p className="font-heading text-2xl font-semibold">{formatIDR(service.startPrice)}</p>
                <p className="text-xs text-muted-foreground">Starting price placeholder</p>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {service.bullets.map((bullet) => (
                  <li key={bullet}>• {bullet}</li>
                ))}
              </ul>
              <OrderNowButton className="w-full rounded-xl">Request Order</OrderNowButton>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
