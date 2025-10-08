import { UserInfoContext } from "meteor/suprakit:ui";
import { useContext } from "react";
import type { RoleId } from "../globals/roles";

type UserInfo = {
	firstName: string;
	lastName: string;
	role: RoleId;
	[key: string]: unknown;
};

/**
 * Custom hook to access user information from the UserInfoContext.
 * @returns {UserInfo} The current user's information from the UserInfoContext.
 */
export function useUserInfo(): UserInfo | undefined {
	if (!UserInfoContext) {
		throw new Error("useUserInfo must be used within a UserInfoProvider");
	}
	const { userInfo } = useContext(UserInfoContext);
	return userInfo;
}
