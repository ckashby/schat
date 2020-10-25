import React, { useRef, useState } from "react";
// import "./App.css";

import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

firebase.initializeApp({
  apiKey: "AIzaSyA5M8rnlKI3IMset_DpanQU5lbu4EKtz4g",
  authDomain: "schat-61196.firebaseapp.com",
  databaseURL: "https://schat-61196.firebaseio.com",
  projectId: "schat-61196",
  storageBucket: "schat-61196.appspot.com",
  messagingSenderId: "66446559059",
  appId: "1:66446559059:web:8e395859892886eee143a6",
});

const auth = firebase.auth();
const firestore = firebase.firestore();

//https://source.unsplash.com/random

function App() {
  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <header className="App-header"></header>

      <section>{user ? <ChatRoom /> : <SignIn />}</section>
    </div>
  );

  function SignIn() {
    const signInWithGoogle = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      auth.signInWithPopup(provider);
    };

    return (
      <button onClick={signInWithGoogle}>Sign in with Google account</button>
    );
  }

  function SignOut() {
    return (
      auth.currentUser && <button onClick={() => auth.SignOut}>Sign Out</button>
    );
  }

  function ChatRoom() {
    const dummy = useRef();

    const messagesRef = firestore.collection("messages");
    const query = messagesRef.orderBy("createdAt").limit(25);
    const [messages] = useCollectionData(query, { idField: "id" });
    const [formValue, setFormValue] = useState("");

    const sendMessage = async (e) => {
      e.preventDefault();
      const { uid, photoURL } = auth.currentUser;
      await messagesRef.add({
        text: formValue,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
        photoURL,
      });
      setFormValue("");

      dummy.current.scrollIntoView({ behavior: "smooth" });
    };

    return (
      <>
        <main>
          {messages &&
            messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}
          <div ref={dummy}></div>
        </main>
        <form onSubmit={sendMessage}>
          <input
            type="text"
            value={formValue}
            onChange={(e) => setFormValue(e.target.value)}
            name="message"
          />
          <button type="submit">Send</button>
        </form>
        <hr />
        <SignOut />
      </>
    );
  }

  function ChatMessage(props) {
    const { text, uid, photoURL } = props.message;
    const messageClass = uid === auth.currentUser.uid ? "sent" : "received";

    return (
      <div className={`message ${messageClass}`}>
        <img src={photoURL} alt="Puppy pics" />
        <p>{text}</p>
      </div>
    );
  }
}

export default App;
