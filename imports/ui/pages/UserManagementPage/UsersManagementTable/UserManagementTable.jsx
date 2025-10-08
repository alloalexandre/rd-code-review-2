import "./UserManagementTableStyle.less";

import {
	Modal,
	SelectInput,
	Table,
	TableTop,
	useTable,
} from "meteor/suprakit:ui";
import React from "react";
import { useTranslator } from "/imports/hooks/useTranslator";
import { useUserId } from "/imports/hooks/useUserId";
import { ModalUpdateUser } from "/imports/ui/pages/UserManagementPage/ModalUpdateUser/ModalUpdateUser";
import { useResendEmail, useUserModal, useUserTableColumns } from "./hooks";

export const UserManagementTable = ({ users }) => {
	const t = useTranslator();
	const userId = useUserId();
	const modal = useUserModal();
	const { mutate: resendEmail } = useResendEmail();

	const columns = useUserTableColumns({
		userId,
		resendEmail,
		openModal: modal.open,
	});

	const { table, setFilterValue, getOptionsWithFacetedValues, getHasRows } =
		useTable({
			data: users,
			columns,
			hiddenColumnsId: ["status"],
		});

	return (
		<div className="UserManagementTable flex h-1/2 grow flex-col gap-2">
			<TableTop table={table}>
				<SelectInput
					className="w-1/4"
					isMulti={true}
					options={getOptionsWithFacetedValues("status", [
						{ label: "En attente", id: "pending" },
						{ label: "Validé", id: "verified" },
					])}
					onChange={(values) => setFilterValue("status", values)}
					placeholder="Statut"
				/>
			</TableTop>

			{getHasRows() ? (
				<Table table={table} className="h-1/2 grow pb-4" />
			) : (
				<p className="flex items-center justify-start py-8">
					{t("UserManagementPage.table.noData")}
				</p>
			)}

			<Modal
				className="PlanningModalMoveAlerts"
				isOpen={modal.isOpen}
				onClose={modal.close}
			>
				<ModalUpdateUser modalValues={modal.values} onClose={modal.close} />
			</Modal>
		</div>
	);
};
