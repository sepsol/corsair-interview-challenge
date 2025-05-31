import { User } from "@task-manager/shared";

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}