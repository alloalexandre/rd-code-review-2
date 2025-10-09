import React from "react";
import { useUserRole } from "/imports/hooks/useUserRole";
import { Table } from "meteor/suprakit:ui";
import { useQuery } from "@tanstack/react-query";

const useUsersQuery = () => {
	return useQuery({
		queryKey: ["users"],
		queryFn: async () => {
			const res = await fetch("/api/users");
			if (!res.ok) throw new Error("Failed to fetch users");
			return res.json();
		},
		staleTime: Infinity,
	});
};

export const AdminUsersPage = () => {
	const role = useUserRole();
	const { data: users, isLoading } = useUsersQuery();

	if (role !== "admin") {
		return <div>⛔ Accès refusé</div>;
	}

	if (isLoading) return <p>Chargement...</p>;

	return (
		<div>
			<h1>Liste des utilisateurs</h1>
			<Table
				columns={["Nom", "Email", "Rôle"]}
				data={users?.map((u) => [u.name, u.email, u.role])}
			/>
		</div>
	);
};
