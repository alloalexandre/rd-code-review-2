import React from "react";

export function ErrorMessage({ message }) {
	if (!message) {
		return null;
	}
	return <div className="errorMessage">{message}</div>;
}
