import './../All.css';
import './SignIn.css';
import logo from './../img/webstore_logo.png';
import React, { useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

//routing
import { useNavigate } from 'react-router-dom';

//functions
import { signin } from '../services/signin';
import { signup } from '../services/signup';

export function SignIn() {
  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [role, setRole] = useState('');

  const returnHome = () => {
    navigate('/');
  };

  const goToSignUpPage = () => {
    navigate('/SignUp');
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setRole(userData.role);

      } else {
        console.log("User not found");
      }

      if (role === "customer") {
        navigate("/customer");
      }
      if (role === "owner") {
        navigate("/owner");
      }
      if (role === "employee") {
        navigate("/employee");
      }

    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    }
  }

  return (
    <div className="SignInPage">

      <img className="Logo" src={logo} onClick={returnHome}/>

      <button className="HomeButton" onClick={returnHome}>Home</button>

      <h2>Sign In</h2>

      <form className="Form">

        <p className="Email">Email</p>

        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email"/>

        <p className="Password">Password</p>

        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password"/>

        <br></br>
        <br></br>

      </form>

      <button onClick={handleSignIn}>Sign In</button>

      <div className="New"></div>

      <h3>New here? Become a customer today</h3>

      <button onClick={goToSignUpPage}> Create an account</button>

      {/*
        <footer>
          <p>© 2023 A&K Custom PC</p>
        </footer>
      */}

    </div>

  );
}
