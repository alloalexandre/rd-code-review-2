type Params = {
	isSuperAdminUser: boolean;
	isSuperAdminTarget: boolean;
	token?: string;
};

/**
 * Validates if impersonation is allowed based on user roles and permissions
 */
export function validateImpersonationPermission({
	isSuperAdminUser,
	isSuperAdminTarget,
	token,
}: Params): { isAllowed: boolean; reason: string | null } {
	// Allow if user is super admin OR if there's a token and target is super admin
	const isAllowed = isSuperAdminUser || (!!token && isSuperAdminTarget);

	return {
		isAllowed,
		reason: isAllowed ? null : "Insufficient permissions for impersonation",
	};
}
