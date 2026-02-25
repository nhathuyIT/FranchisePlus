import { FRANCHISES_MOCK } from "./franchises.const";
import { ABOUT_THEME } from "./about.const";
import type { Franchise } from "@/types/franchise";

export const LOCATION_THEME = {
  primary: ABOUT_THEME.primary, // #6D4C41
  bgKem: ABOUT_THEME.bgKem,     // #FAF8F5
  accent: "#8B181B"             // Highlands Red
};

// Use active franchises as store locations
export const STORE_LOCATIONS = FRANCHISES_MOCK.filter(franchise => franchise.is_active && !franchise.is_deleted);

// Type export for store locations
export type StoreLocationData = Franchise;