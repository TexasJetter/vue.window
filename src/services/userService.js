let defaultUsers = [
	{ id: 1, firstname: "Clint", lastname: "Eastwood" },
	{ id: 2, firstname: "Chuck", lastname: "Norris" },
	{ id: 3, firstname: "John", lastname: "Wayne" },
];

export function getUsers() {
	return new Promise((resolve) => {
		let users = defaultUsers;
		let u = localStorage.getItem("vue.window.users");
		if (!u) {
			localStorage.setItem("vue.window.users", JSON.stringify(defaultUsers));
		} else {
			users = JSON.parse(u);
		}
		resolve({ users: users });
	});
}

export function getUser(id) {
	return new Promise((resolve) => {
		getUsers().then((result) => {
			let user = result.users.find((u) => u.id == id);
			resolve({ user: user });
		});
	});
}

export function saveUser(user) {
	return new Promise((resolve) => {
		console.log("saving user");
		getUsers().then((result) => {
			let u = result.users.find((u) => u.id == user.id);
			u.firstname = user.firstname;
			u.lastname = user.lastname;
			//result.users.slice(result.users.indexOf(u), 1, user);

			localStorage.setItem("vue.window.users", JSON.stringify(result.users));

			resolve();
		});
	});
}
