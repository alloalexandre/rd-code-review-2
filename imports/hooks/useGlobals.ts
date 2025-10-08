import { useQueryHook } from "meteor/suprakit:ui";
import { useEffect, useState } from "react";
import { setGlobals } from "/imports/utils/globals";

export const useGlobals = (): { isLoading: boolean; isReady: boolean } => {
	const [isReady, setIsReady] = useState(false);

	const { isLoading, data: globals } = useQueryHook(
		"Global.methods.getGlobals",
		{},
		["Global.methods.getGlobals"],
		{
			onError: (err: unknown) => console.error("Globals fetch error:", err),
		},
	);

	useEffect(() => {
		if (globals) {
			setGlobals(globals);
			setIsReady(true);
		}
	}, [globals]);

	return { isLoading, isReady };
};
