import { Direction, TextInput, Type } from "meteor/suprakit:ui";
import React from "react";
import { useTranslator } from "/imports/hooks/useTranslator";

export const TextInputField = ({ name, placeholder, label }) => {
	const t = useTranslator();

	return (
		<TextInput
			className="w-1/4"
			direction={Direction.Vertical}
			name={name}
			placeholder={t(placeholder)}
			label={t(label)}
			type={Type.Text}
		/>
	);
};
