export interface Admin {
  id: number;
  name: string;
  email: string;
  is_assigned: "assigned" | "unassigned";
} 