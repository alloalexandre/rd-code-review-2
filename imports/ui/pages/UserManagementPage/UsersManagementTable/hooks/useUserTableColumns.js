import {
	Button,
	Hierarchy,
	Impersonate,
	Link,
	Size,
	Type,
	Variant,
} from "meteor/suprakit:ui";
import React, { useMemo } from "react";
import { ALL_ROLES } from "/imports/globals/roles";
import { useTranslator } from "/imports/hooks/useTranslator";
import { isSuperAdmin } from "/imports/lib/security/security-client";

export function useUserTableColumns({ userId, resendEmail, openModal }) {
	const t = useTranslator();
	return useMemo(
		() => [
			{
				accessorKey: "firstName",
				header: t("UserManagementPage.table.header.firstName"),
				cell: (props) => <p className="p1Regular">{props.getValue()}</p>,
			},
			{
				accessorKey: "lastName",
				header: t("UserManagementPage.table.header.lastName"),
				cell: (props) => <p className="p1Regular">{props.getValue()}</p>,
			},
			{
				accessorKey: "email",
				header: t("UserManagementPage.table.header.email"),
				cell: (value) => {
					const { email, status, userId: rowUserId } = value.row.original;

					const statusIcon = () => {
						switch (status) {
							case "verified":
								return <i className="icon-o-check-circle w-4 flex-none" />;
							case "pending":
								return <i className="icon-o-clock w-4 flex-none" />;
							default:
								return <i className="icon-o-x-mark w-4 flex-none" />;
						}
					};

					return (
						<>
							<div className="flex items-center gap-2 text-base">
								{statusIcon()}
								<Link
									className="p1Regular"
									type={Type.Email}
									content={email}
									text={email}
								/>
							</div>
							<div className="mt-1 flex items-center gap-2">
								<i className="w-4 flex-none"></i>
								{status === "pending" && (
									<Button
										className="button-resend"
										hierarchy={Hierarchy.Tertiary}
										size={Size.S}
										text={t("UserManagementPage.buttons.resendInvitation")}
										onClick={() => resendEmail({ userId: rowUserId })}
									/>
								)}
								{status === "verified" && isSuperAdmin(userId) && (
									<Button
										className="button-resend"
										hierarchy={Hierarchy.Tertiary}
										variant={Variant.Alert}
										size={Size.S}
										icon="s-user"
										text={t("UserManagementPage.buttons.impersonate")}
										onClick={() =>
											Impersonate.do(rowUserId, () =>
												console.log("Impersonate done"),
											)
										}
									/>
								)}
							</div>
						</>
					);
				},
			},
			{
				accessorKey: "role",
				header: t("UserManagementPage.table.header.role"),
				cell: (props) => (
					<p className="p1Regular">{ALL_ROLES[props.getValue()].label}</p>
				),
			},
			{
				accessorKey: "edit",
				header: "",
				cell: (props) => (
					<div className="flex justify-center">
						<Button
							hierarchy={Hierarchy.Tertiary}
							icon="o-pencil-square"
							size={Size.M}
							onClick={() =>
								openModal({
									firstName: props.row.original.firstName,
									lastName: props.row.original.lastName,
									role: props.row.original.role,
									userId: props.row.original.userId,
								})
							}
						/>
					</div>
				),
				width: "60px",
				enableSorting: false,
			},
		],
		[resendEmail, userId, openModal, t],
	);
}
