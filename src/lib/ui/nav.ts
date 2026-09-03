import type { ProtectedRoute } from "../auth/types";

export interface NavGroup {
  label: string;
  items: ProtectedRoute[];
}

/** Group visible nav items by route eyebrow for Supabase-style sidebar sections. */
export function groupNavItems(items: ProtectedRoute[]): NavGroup[] {
  const groups: NavGroup[] = [];
  for (const item of items) {
    const label = item.eyebrow || "Autre";
    const existing = groups.find((group) => group.label === label);
    if (existing) {
      existing.items.push(item);
    }
    else {
      groups.push({ label, items: [item] });
    }
  }
  return groups;
}
