import { UserRole } from "@/db/schema";

export function isAdmin(role?: UserRole | null) {
	return role === "admin";
}
