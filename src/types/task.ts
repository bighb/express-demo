export interface Task {
  id?: number;
  title: string;
  description?: string;
  status?: "pending" | "in_progress" | "completed";
  user_id?: number;
  created_at?: Date;
  updated_at?: Date;
}
