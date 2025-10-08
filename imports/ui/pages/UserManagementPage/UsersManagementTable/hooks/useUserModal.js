import { useCallback, useState } from "react";

export function useUserModal() {
	const [isOpen, setIsOpen] = useState(false);
	const [values, setValues] = useState(null);

	const open = useCallback((user) => {
		setValues(user);
		setIsOpen(true);
	}, []);

	const close = useCallback(() => {
		setIsOpen(false);
		setValues(null);
	}, []);

	return { isOpen, values, open, close };
}
