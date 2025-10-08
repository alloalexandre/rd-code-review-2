import { hasOneOfRoles } from "meteor/suprakit:ui";
import { useMemo, useState } from "react";
import { ALL_ROLES } from "/imports/globals/roles";
import { useUserId } from "/imports/hooks/useUserId";

export function useUserRoles() {
	const userId = useUserId();
	const [selectedRole, setSelectedRole] = useState(ALL_ROLES.admin.id);

	const roles = useMemo(() => {
		const baseRoles = [ALL_ROLES.admin, ALL_ROLES.revoked];
		if (hasOneOfRoles([ALL_ROLES.superAdmin.id], userId)) {
			baseRoles.unshift(ALL_ROLES.superAdmin);
		}
		return baseRoles;
	}, [userId]);

	return { selectedRole, setSelectedRole, roles };
}
