import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function signUp(email, password, username) {
  createUserWithEmailAndPassword(auth, email, password)
    .then((authUser) => {
      // Signed in

      updateProfile(auth.currentUser, {
        displayName: username,
      })
        .then(() => {
          // Profile updated!
        })
        .catch((error) => {
          // An error occurred
          // ...
        });
    })
    .catch((error) => {
      alert(error.message);
    });
}

export function signOut() {
  auth.signOut();
}

export function signIn(email, password) {
  signInWithEmailAndPassword(auth, email, password).catch((error) => {
    alert(error.message);
  });
}

export function AuthProvider(props) {
  const [authUser, setAuthUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    //auth
    const unsubscribe = auth.onAuthStateChanged((authUserInfo) => {
      if (authUserInfo) {
        //logged in
        setAuthUser(authUserInfo);
        setIsLoggedIn(true);
        setUser(authUserInfo.displayName);
      } else {
        //logged out
        setAuthUser(null);
        setIsLoggedIn(false);
        setUser(null);
      }

      return () => {
        unsubscribe();
      };
    });
  }, []);

  // const value = {
  //   authUser,
  //   setAuthUser,
  //   isLoggedIn,
  //   setIsLoggedIn,
  //   user,
  // };

  const value = React.useMemo(
    () => ({
      authUser,
      setAuthUser,
      isLoggedIn,
      setIsLoggedIn,
      user,
    }),
    [authUser, isLoggedIn, user]
  );

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
}
