import {
	LocalSpinner,
	Page,
	PageContent,
	PageHeader,
	Size,
} from "meteor/suprakit:ui";
import React from "react";
import { useTranslator } from "/imports/hooks/useTranslator";
import { useUserInfo } from "/imports/hooks/useUserInfo";
import { APP_ROUTES } from "/imports/routes/routePaths";
import { useUserInfoForm } from "./hooks/useUserInfoForm";
import { useUserInfoMutations } from "./hooks/useUserInfoMutations";
import { UserInfoConfirmation } from "./UserInfoConfirmation/UserInfoConfirmation";
import { UserInfoForm } from "./UserInfoForm/UserInfoForm";

export const UserInfoPage = () => {
	const t = useTranslator();

	const userInfo = useUserInfo();
	const {
		updateUserInfo,
		resetPassword,
		isPending,
		isModalOpen,
		setIsModalOpen,
	} = useUserInfoMutations();
	const { initialValues, validationSchema, handleSubmit } = useUserInfoForm(
		userInfo,
		updateUserInfo,
	);

	return (
		<Page className="UserInfoPage">
			<LocalSpinner
				size={Size.S}
				showSpinner={!initialValues}
				text={t("loading")}
			>
				<PageHeader routes={APP_ROUTES} title={t("UserInfoPage.title")} />
				<PageContent>
					<UserInfoForm
						initialValues={initialValues}
						validationSchema={validationSchema}
						handleSubmit={handleSubmit}
						isPending={isPending}
						resetPassword={resetPassword}
					/>
					<UserInfoConfirmation
						isModalOpen={isModalOpen}
						onClose={() => setIsModalOpen(false)}
					/>
				</PageContent>
			</LocalSpinner>
		</Page>
	);
};
