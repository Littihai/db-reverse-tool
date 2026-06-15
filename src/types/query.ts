export interface CustomQuery {
  id: string;
  title: string;
  sql: string;
  category: string;
  visibility: "private" | "public";
  createdBy: string;
  createdByName: string;
  createdAt: number;
  isCustom: true;
}