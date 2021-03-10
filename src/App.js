import "./App.css";
import {
	useCollection,
	useCollectionData,
} from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase, { auth, firestore } from "./firebase";
function App() {
	const [user] = useAuthState(auth);
	return (
		<main className="App">
			<header></header>
			<section>{user ? <TodoList id={user.uid} /> : <SignIn />}</section>
		</main>
	);
}
function TodoList({ id }) {
	const todosRef = firestore.collection(`users`);
	const [todos] = useCollectionData(todosRef, { idField: "id" });

	return (
		<div>
			<h1>{id}</h1>
			<ul>
				{todos &&
					todos.map((td) =>
						td.todos.map((t) => <li className="list">{t.todoItem}</li>)
					)}
			</ul>
		</div>
	);
}
function Todo({ data }) {
	return <div>{data}</div>;
}
function SignIn() {
	const signInWithGoogle = () => {
		const provider = new firebase.auth.GoogleAuthProvider();
		auth.signInWithPopup(provider);
	};
	return <button onClick={signInWithGoogle}>Sign in w/ Google</button>;
}
function SignOut() {
	return (
		auth.currentUser && (
			<button
				onClick={() => {
					auth.signOut();
				}}
			>
				SignOut
			</button>
		)
	);
}

export default App;
