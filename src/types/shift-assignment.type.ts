export type ShiftAssignmentStatus =
  | "ASSIGNED"
  | "COMPLETED"
  | "ABSENT"
  | "CANCELED";

export interface ShiftAssignment {
  id: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  shiftId: string;
  userId: string;
  note: string;
  workDate: string;
  assignedBy: string;
  status: ShiftAssignmentStatus;
}

export interface AssignShiftForUserResponse {
  success: boolean;
  data: ShiftAssignment;
}

export interface AssignShiftForUserRequest {
  user_id: string;
  shift_id: string;
  work_date: string;
  note?: string;
}

export interface AssignShiftsForUserBulkRequest {
  items: AssignShiftForUserRequest[];
}

export interface AssignShiftsForUserBulkResponse {
  success: boolean;
  data: ShiftAssignment[];
}

export interface ShiftAssignmentSearchCondition {
  shift_id?: string;
  user_id?: string;
  work_date?: string;
  assigned_by?: string;
  status?: ShiftAssignmentStatus | "";
  is_deleted: boolean;
}

export interface PageInfo {
  pageNum: number;
  pageSize: number;
}

export interface SearchShiftAssignmentsRequest {
  searchCondition: ShiftAssignmentSearchCondition;
  pageInfo: PageInfo;
}

export interface ShiftAssignmentListItem {
  id: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  shiftId: string;
  userId: string;
  userName: string; // Tên nhân viên hiển thị
  startTime: string; // HH:mm (ví dụ: "17:00")
  endTime: string; // HH:mm (ví dụ: "22:00")
  note: string;
  workDate: string; // YYYY-MM-DD
  assignedBy: string;
  status: ShiftAssignmentStatus;
}

export interface PaginatedPageInfo {
  pageNum: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface SearchShiftAssignmentsResponse {
  success: boolean;
  data: ShiftAssignmentListItem[];
  pageInfo: PaginatedPageInfo;
}

export interface GetShiftAssignmentResponse {
  success: boolean;
  data: ShiftAssignment;
}

export interface ShiftAssignmentStatusRequest {
  status: ShiftAssignmentStatus;
}

export interface ShiftAssignmentResponse {
  success: boolean;
  data: unknown;
}

export interface ShiftAssignmentListResponse {
  success: boolean;
  data: ShiftAssignment[];
}
