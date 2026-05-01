export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  [key: string]: unknown;
}
