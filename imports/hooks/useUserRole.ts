import { UserInfoContext } from "meteor/suprakit:ui";
import { useContext } from "react";
import type { RoleId } from "../globals/roles";

/**
 * Custom hook to retrieve the current user's role from UserInfoContext.
 */
export function useUserRole(): RoleId | undefined {
	const { userInfo } = useContext(UserInfoContext);
	if (userInfo === null) {
		return;
	}
	return userInfo?.role;
}
