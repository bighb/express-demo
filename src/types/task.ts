export interface Task {
  id?: number;
  title: string;
  description?: string;
  status?: "pending" | "in_progress" | "completed";
  created_at?: Date;
  updated_at?: Date;
}
