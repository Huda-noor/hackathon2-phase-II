export interface FrontendTask {
  id: number;
  title: string;
  description: string | null;
  status: "Todo" | "InProgress" | "Done";
  created_at: string;
  updated_at: string | null;
}
