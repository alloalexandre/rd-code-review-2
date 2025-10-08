import { Button, Hierarchy, Type } from "meteor/suprakit:ui";
import React from "react";

export function SubmitButton({ text, disabled }) {
	return (
		<div className="submitArea">
			<Button
				className="logoutButton"
				hierarchy={Hierarchy.Primary}
				type={Type.Submit}
				text={text}
				disabled={disabled}
			/>
		</div>
	);
}
