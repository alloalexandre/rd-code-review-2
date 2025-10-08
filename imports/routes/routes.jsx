import {
	DefaultReroutingManager,
	handleError,
	InfoScreenPage,
	LoginLayout,
	RequireAuth,
	Type,
} from "meteor/suprakit:ui";
import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useTranslator } from "/imports/hooks/useTranslator";
import { DefaultLayout } from "/imports/ui/layouts/DefaultLayout/DefaultLayout";
import { SettingsPage } from "/imports/ui/pages/SettingsPage/SettingsPage";
import { UserInfoPage } from "/imports/ui/pages/UserInfoPage/UserInfoPage";
import { UserManagementPage } from "/imports/ui/pages/UserManagementPage/UserManagementPage";
import { LoginPage } from "../ui/pages/LoginPages/LoginPage/LoginPage";
import { SetPasswordPage } from "../ui/pages/LoginPages/SetPasswordPage/SetPasswordPage";
import { DEFAULT_REROUTING } from "./rerouting";
import { APP_ROUTES } from "./routePaths";

/**
 * AppRoutes is a component that defines the routes of the application.
 *
 * It is divided into error routes, login routes, authenticated routes, and a fallback route.
 * - The error routes contain the not allowed page and the not found page.
 * - The login routes contain the login page, the signup page, and the reset password page.
 * - The authenticated routes contain the settings page, the user management page, and the profile page.
 * - The fallback route is a catch-all route that redirects to the root page.
 */
export const AppRoutes = () => {
	const t = useTranslator();

	return (
		<Routes>
			{/* Error routes */}
			<Route
				path={APP_ROUTES.notAllowed.path}
				element={<InfoScreenPage type={Type.NotAllowed} />}
			/>
			<Route
				path={APP_ROUTES.notFound.path}
				element={<InfoScreenPage type={Type.NotFound} />}
			/>

			{/* Login routes */}
			<Route
				path={APP_ROUTES.login.path}
				element={<LoginLayout img="/login/logo-login.png" />}
			>
				<Route index={true} element={<LoginPage />} />
				<Route
					path={APP_ROUTES.login.signup.path}
					element={<SetPasswordPage />}
				/>
				<Route
					path={APP_ROUTES.login.resetPassword.path}
					element={<SetPasswordPage />}
				/>
			</Route>

			{/* Authenticated routes */}
			<Route
				path={APP_ROUTES.root.path}
				element={
					<RequireAuth
						onError={handleError(alert, t)}
						errorPath={APP_ROUTES.notAllowed.path}
					>
						<DefaultReroutingManager
							appRoutes={APP_ROUTES}
							defaultRerouting={DEFAULT_REROUTING}
						>
							<DefaultLayout />
						</DefaultReroutingManager>
					</RequireAuth>
				}
			>
				<Route path={APP_ROUTES.settings.path} element={<SettingsPage />} />
				<Route
					path={APP_ROUTES.userManagement.path}
					element={<UserManagementPage />}
				/>
				<Route path={APP_ROUTES.profile.path} element={<UserInfoPage />} />
			</Route>

			{/* Fallback */}
			<Route path="*" element={<Navigate to="/" replace={true} />} />
		</Routes>
	);
};
