import type { ID, BaseTimestamp, SoftDeletable, Activatable } from "./common";

/**
 * Shift entity - work shifts for franchise
 */
export interface Shift extends BaseTimestamp, SoftDeletable, Activatable {
  id: ID;
  franchise_id: ID;
  name: string; // Morning / Evening
  start_time: string; // time format
  end_time: string; // time format
}

/**
 * Shift assignment status
 */
export type ShiftAssignmentStatus = "ASSIGNED" | "COMPLETED" | "ABSENT";

/**
 * ShiftAssignment - assigns users to shifts
 * UNIQUE (shift_id, user_id, work_date)
 */
export interface ShiftAssignment extends BaseTimestamp, SoftDeletable {
  id: ID;
  shift_id: ID;
  user_id: ID;
  work_date: string; // date - Ngày làm việc
  assigned_by: ID; // Manager assign
  status: ShiftAssignmentStatus;
}
