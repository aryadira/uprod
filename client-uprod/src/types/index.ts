export interface Major {
  id: number;
  admin_id: number;
  slug: string;
  logo_path: string | null;
  banner_path: string | null;
  name: string;
  acronim: string;
  description: string;
  is_active: boolean;
  user: {
    id: number;
    name: string;
    email: string;
  };
}

export interface Admin {
  id: number;
  name: string;
  email: string;
  is_assigned: "assigned" | "unassigned";
} 