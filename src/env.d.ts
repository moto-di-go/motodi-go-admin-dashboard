/// <reference types="astro/client" />

import type { AdminSession, ProtectedRoute } from "./lib/auth/types";

declare global {
  namespace App {
    interface Locals {
      adminSession?: AdminSession;
      navigation?: ProtectedRoute[];
    }

    interface SessionData {
      adminSession: AdminSession;
    }
  }
}

export {};
