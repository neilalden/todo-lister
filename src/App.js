import "./App.css";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import firebase, { auth, firestore } from "./firebase";
import { useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import ListGroup from "react-bootstrap/ListGroup";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
function App() {
	const [user] = useAuthState(auth);
	return (
		<main className="App bg-dark text-white">
			{user ? (
				<Todos
					displayName={user.displayName}
					email={user.email}
					id={user.uid}
				/>
			) : (
				<SignIn />
			)}
		</main>
	);
}
function Todos({ displayName, email, id }) {
	const todosRef = firestore.collection(id);
	const query = todosRef.orderBy("createdAt", "desc");
	const [todos] = useCollectionData(query);
	return (
		<Container style={{ maxWidth: "700px" }}>
			<header className="mb-4">
				<p className="display-3">{displayName}</p>
				<SignOut />
			</header>
			<AddTodo id={id} />
			<ListGroup className="text-dark">
				{todos &&
					todos.map((todo, idx) => (
						<TodoItem key={idx} todoItem={todo.todo} todoId={todo.id} id={id} />
					))}
			</ListGroup>
		</Container>
	);
}
function TodoItem({ todoItem, todoId, id }) {
	const [todo, setTodo] = useState(todoItem);
	const renderTooltip = (props) => (
		<Tooltip id="button-tooltip" {...props}>
			Click to update todo
		</Tooltip>
	);
	return (
		<ListGroup.Item key={todoItem.todo} variant="dark" className="w-100">
			<OverlayTrigger
				placement="top"
				delay={{ show: 250, hide: 400 }}
				overlay={renderTooltip}
			>
				<input
					type="text"
					value={todo}
					onChange={(e) => {
						setTodo(e.currentTarget.value);
					}}
					onBlur={() => updateTodo(todo, todoId, id)}
					className="todo-text"
				/>
			</OverlayTrigger>
			<span onClick={() => deleteTodo(todoId, id)} className="todo-remove">
				x
			</span>
		</ListGroup.Item>
	);
}
function AddTodo({ id }) {
	const [todo, setTodo] = useState("");
	return (
		<>
			<InputGroup className="mb-3">
				<FormControl
					placeholder="Something you want todo"
					aria-label="Something you want todo"
					aria-describedby="basic-addon2"
					type="text"
					value={todo}
					onChange={(e) => {
						setTodo(e.currentTarget.value);
					}}
				/>
				<InputGroup.Append>
					<Button
						variant="outline-success"
						onClick={() => {
							!todo ? console.log("todo empty") : addTodo(todo, id);
							setTodo("");
						}}
					>
						Add todo
					</Button>
				</InputGroup.Append>
			</InputGroup>
		</>
	);
}
function SignIn() {
	const signInWithGoogle = () => {
		const provider = new firebase.auth.GoogleAuthProvider();
		auth.signInWithPopup(provider);
	};
	return (
		<Card className="mt-4 w-75 mx-auto bg-dark" style={{ border: "0" }}>
			<Card.Title>
				<p className="display-1 text-light">Todo-Lister</p>
				<span className="text-secondary">by Neil Alden Escobin</span>
			</Card.Title>
			<Card.Body>
				<Button variant="outline-primary" onClick={signInWithGoogle}>
					Sign in w/ Google
				</Button>
			</Card.Body>
		</Card>
	);
}
function SignOut() {
	return (
		auth.currentUser && (
			<Button
				variant="outline-light"
				onClick={() => {
					auth.signOut();
				}}
			>
				Sign Out
			</Button>
		)
	);
}
const addTodo = (todo, id) => {
	const ref = firestore.collection(id);
	const todoId = ref.doc().id;
	ref
		.doc(todoId)
		.set({
			todo,
			id: todoId,
			createdAt: firebase.firestore.FieldValue.serverTimestamp(),
		})
		.then((docRef) => {
			// console.log("Document written with ID: ", docRef.id);
		})
		.catch((error) => {
			console.error("Error adding document: ", error);
		});
};
const updateTodo = (todoItem, todoId, id) => {
	const todosRef = firestore.collection(id).doc(todoId);
	todosRef.get().then((doc) => {
		if (doc.exists) {
			return todosRef.update({
				todo: todoItem,
			});
		} else {
			console.log("No such document!");
		}
	});
};
const deleteTodo = (docId, id) => {
	const todosRef = firestore.collection(id).doc(docId);
	todosRef
		.delete()
		.then(() => {
			console.log("Document successfully deleted!");
		})
		.catch((error) => {
			console.error("Error removing document: ", error);
		});
};
// const inputStyle = {
// 	textAlign: "center",
// 	background: "transparent",
// 	border: "0",
// 	outline: "0",
// 	width: "95%",
// 	marginRight: "1px",
// };

export default App;
