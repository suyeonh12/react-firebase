import React, { useState } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const Auth = ()=>{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState('');
    const auth = getAuth();

    const onChange = (e) =>{
        const { name, value } = e.target;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }        
    }
    const onSubmit = (e) =>{
        e.preventDefault();
        if(newAccount){
            //회원가입
            createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed up 
                const user = userCredential.user;
                console.log(user);
                // ...
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
                setError(errorMessage);
            });
        }
        else{
            //로그인
            signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in 
                const user = userCredential.user;
                console.log(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setError(errorMessage);
            });
        }
    }
    let toggleAccount = () =>setNewAccount(prev => !prev);
    const onSocialClick = (e) =>{
        const {target:{name}} = e;
        if(name === 'google'){
            const provider = new GoogleAuthProvider();

            signInWithPopup(auth, provider)
            .then((result) => {
              const credential = GoogleAuthProvider.credentialFromResult(result);
              const token = credential.accessToken;          
              const user = result.user;
              console.log(token, user);
    
            }).catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              const email = error.customData.email;
              const credential = GoogleAuthProvider.credentialFromError(error);
              console.log(errorCode, errorMessage, email, credential);
            });         
        }else if(name === 'github'){
            const provider = new GithubAuthProvider();
            signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GithubAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
                console.log(token, user);                
            }).catch((error) => {                
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData.email;            
                const credential = GithubAuthProvider.credentialFromError(error);
                console.log(errorCode, errorMessage, email, credential);
            });
        }

    }
    return(
        <div>
            <form onSubmit={onSubmit}>
                <input name="email" type="email" placeholder="Email" required
                value={email} onChange={onChange}/>
                <input name="password" type="password" placeholder="password" 
                required value={password} onChange={onChange}/>
                <button>{newAccount ? "Create Account" : "Log in"}</button>
                {error}
            </form>
            <div onClick={toggleAccount}>{newAccount ? "Log in" : "Create Account"}</div>
            <hr/>
            <button name="google" onClick={onSocialClick}>구글로 로그인</button>
            <button name="github" onClick={onSocialClick}>깃허브로 로그인</button>
        </div>
    )
}

export default Auth;