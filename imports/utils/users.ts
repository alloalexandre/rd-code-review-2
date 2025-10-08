import { Roles } from "meteor/roles";
import { UserInfoContext } from "meteor/suprakit:ui";
import type { Document } from "mongodb";
import { useContext, useMemo } from "react";

type UserInfo = {
	firstName?: string;
	lastName?: string;
	email?: string;
	avatar?: string;
};

type UserInfoReturn = {
	email: string;
	firstName: string;
	lastName: string;
	userName: string;
	initials: string;
	avatar?: string;
};

/**
 * Format user information into a standardized object.
 */
export function formatUser({ info }: { info?: UserInfo } = {}): UserInfoReturn {
	const userName = `${info?.firstName || ""} ${info?.lastName || ""}`;
	const initials =
		(info?.firstName || "-").charAt(0) + (info?.lastName || "-").charAt(0);

	return {
		email: info?.email || "N/A",
		firstName: info?.firstName || "N/A",
		lastName: info?.lastName || "N/A",
		userName,
		initials,
		avatar: info?.avatar,
	};
}

/**
 * React hook to retrieve and format the current user's information
 * from the `UserInfoContext`.
 */
export function useUserInfo(): UserInfoReturn {
	const { userInfo } = useContext(UserInfoContext);

	return useMemo(() => formatUser({ info: userInfo }), [userInfo]);
}

type UpdateUserRoleParams = {
	access: Document | undefined;
	userId: string;
};

/**
 * Update a user's role asynchronously using Meteor Roles.
 */
export async function updateUserRoleAsync({
	access,
	userId,
}: UpdateUserRoleParams): Promise<void> {
	// In case of scopes, add this here
	// if (access.role === ALL_ROLES.<scope>.id) {
	//     if (!access.<scope>) return false;
	//     Roles.setUserRoles(userId, [access.role], access.<scope>);
	// }

	if (!access) {
		throw new Error("Access information is required to update user role.");
	}

	await Roles.setUserRolesAsync(userId, [access.role]);
}
