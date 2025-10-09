import React, { useEffect, useState } from "react";
import { Mongo } from "meteor/mongo";

const Users = new Mongo.Collection("users");

export const BadUserList = () => {
	const [users, setUsers] = useState([]);

	useEffect(() => {
		const data = Users.find().fetch();
		setUsers(data);
	}, []);

	return (
		<ul>
			{users.map((u) => (
				<li key={u._id}>
					{u.profile?.name} - {u.services?.password?.bcrypt}
				</li>
			))}
		</ul>
	);
};
