import {
	ErrorBoundary,
	InfoScreenPage,
	ServerDisconnectedWrapper,
	Type,
} from "meteor/suprakit:ui";
import React from "react";

export const ErrorBoundaryWrapper = ({
	children,
}: {
	children: React.ReactNode;
}): JSX.Element => (
	<ErrorBoundary fallbackComponent={<InfoScreenPage type={Type.Error} />}>
		<ServerDisconnectedWrapper>{children}</ServerDisconnectedWrapper>
	</ErrorBoundary>
);
