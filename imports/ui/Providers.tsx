import { Provider as AlertProvider, positions } from "@blaumaus/react-alert";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import {
	type Persister,
	PersistQueryClientProvider,
} from "@tanstack/react-query-persist-client";
import { del, get, set } from "idb-keyval";
import { BreadcrumbContextProvider, Toast } from "meteor/suprakit:ui";
import React from "react";

const queryClient: QueryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false, // disable refetch on window focus (this is true by default in react-query)
		},
	},
});

const persister: Persister = createAsyncStoragePersister({
	storage: {
		getItem: async (key: string) => await get(key),
		setItem: async (key: string, value: unknown) => await set(key, value),
		removeItem: async (key: string) => await del(key),
	},
});

const alertsOptions = {
	position: positions.BOTTOM_RIGHT,
	timeout: 3000,
	offset: "5px",
} as const;

export const Providers = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => (
	<AlertProvider template={Toast} {...alertsOptions}>
		<PersistQueryClientProvider
			client={queryClient}
			persistOptions={{ persister }}
		>
			<BreadcrumbContextProvider>{children}</BreadcrumbContextProvider>
		</PersistQueryClientProvider>
	</AlertProvider>
);
