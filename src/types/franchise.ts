import type { ID, Timestamp } from "./common";

export interface Franchise extends Timestamp {
  id: ID;
  name: string;
  address: string;
  managerId?: ID;
  status: "active" | "inactive";
}
