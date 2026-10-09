export function hasAdminPermission(user: { role?: string | null }): boolean {
	return user.role === "admin";
}
