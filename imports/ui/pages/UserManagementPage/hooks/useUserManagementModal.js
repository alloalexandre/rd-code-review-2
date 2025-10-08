import { useState } from "react";

export const useUserManagementModal = (refetchUsers) => {
	const [isModalAddOpen, setIsModalAddOpen] = useState(false);

	const closeModalAndRefresh = async () => {
		setIsModalAddOpen(false);
		await refetchUsers();
	};

	return { isModalAddOpen, setIsModalAddOpen, closeModalAndRefresh };
};
