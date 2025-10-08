import {
	Button,
	EmptyManager,
	LocalSpinner,
	Modal,
	Page,
	PageContent,
	PageHeader,
	QuickFilterGroup,
} from "meteor/suprakit:ui";
import React from "react";
import { useTranslator } from "/imports/hooks/useTranslator";
import { APP_ROUTES } from "/imports/routes/routePaths";
import { ModalAddUser } from "/imports/ui/pages/UserManagementPage/ModalAddUser/ModalAddUser";
import { UserManagementTable } from "/imports/ui/pages/UserManagementPage/UsersManagementTable/UserManagementTable";
import { useUserAccesses, useUserManagementModal, useUserRoles } from "./hooks";

export const UserManagementPage = () => {
	const t = useTranslator();
	const { selectedRole, setSelectedRole, roles } = useUserRoles();
	const { users, refetchUsers, isLoadingUsers } = useUserAccesses(selectedRole);
	const { isModalAddOpen, setIsModalAddOpen, closeModalAndRefresh } =
		useUserManagementModal(refetchUsers);

	return (
		<LocalSpinner showSpinner={isLoadingUsers} text={t("loading")}>
			<Page className={"UserManagementPage"}>
				<PageHeader
					routes={APP_ROUTES}
					title={"Gestion des accès"}
					rightContent={
						<Button
							text={"Nouvel utilisateur"}
							icon={"o-plus"}
							onClick={() => setIsModalAddOpen(true)}
						/>
					}
				/>

				<PageContent className={"!pb-0 h-1/2 grow"}>
					<QuickFilterGroup
						filters={roles}
						value={selectedRole}
						onChange={(id) => {
							setSelectedRole(id);
						}}
					/>

					<EmptyManager
						message="Aucun utilisateur"
						showEmpty={!users || users.length === 0}
						bottomComponent={
							<Button
								text={"Nouvel utilisateur"}
								icon={"o-plus"}
								onClick={() => setIsModalAddOpen(true)}
							/>
						}
					>
						<UserManagementTable users={users} />
					</EmptyManager>

					<Modal isOpen={isModalAddOpen} onClose={closeModalAndRefresh}>
						<ModalAddUser onClose={closeModalAndRefresh} />
					</Modal>
				</PageContent>
			</Page>
		</LocalSpinner>
	);
};
