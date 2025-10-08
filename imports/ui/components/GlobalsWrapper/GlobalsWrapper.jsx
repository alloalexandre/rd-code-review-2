import React from "react";
import { useGlobals } from "/imports/hooks/useGlobals";

export const GlobalsWrapper = ({ children }) => {
	const { isLoading, isReady } = useGlobals();

	if (isLoading || !isReady) {
		return null;
	}

	return <>{children}</>;
};
