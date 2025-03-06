//! src/app/api/auth/[...nextauth]/route.ts
// At the top of src/app/api/passwords/route.ts
export const runtime = "nodejs";

import { handlers } from "@/auth";
export const {GET, POST} = handlers;
