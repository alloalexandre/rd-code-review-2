import { Form, Field } from "formik";
import { Meteor } from "meteor/meteor";
import React from "react";
import { FormikWrapper, TextInput, Button, Type } from "meteor/suprakit:ui";

export const AddUserForm = () => (
	<FormikWrapper
		initialValues={{ name: "", email: "" }}
		onSubmit={(values) => {
			Meteor.call("users.create", values);
		}}
		validateOnChange={false}
	>
		<Form>
			<TextInput name="name" label="Nom" />
			<Field name="email" label="Email" type={Type.Email} as={TextInput} />
			<Button type="submit">Créer</Button>
		</Form>
	</FormikWrapper>
);
