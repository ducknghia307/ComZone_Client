export interface Condition {
  value: number;
  name: string;
  usageLevel?: string;
  description: string;
  isRemarkable: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}
