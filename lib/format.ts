export const idrFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export const idDateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export const idDateTimeFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatIDR(value?: number | null) {
  if (value == null) return "-";
  return idrFormatter.format(value);
}

export function formatDateID(value?: string | Date | null) {
  if (!value) return "-";
  return idDateFormatter.format(new Date(value));
}

export function formatDateTimeID(value?: string | Date | null) {
  if (!value) return "-";
  return idDateTimeFormatter.format(new Date(value));
}

export function initials(name?: string | null) {
  if (!name) return "SS";
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
