import React, { useState } from "react";
import { Input } from "@mui/material";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import styles from "./style/Login.module.css";
import { useAuth, signIn, signUp } from "./AuthContext";
import { useNavigate } from "react-router-dom";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showLogin, setShowLogin] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogIn = (event) => {
    event.preventDefault();
    signIn(email, password);
  };

  const handleSignUp = (event) => {
    event.preventDefault();
    signUp(email, password, username);
  };

  return (
    <div className={styles.Login__container}>
      {user ? navigate("/") : ""}
      {showLogin ? (
        <Box>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Login
          </Typography>

          <form className={styles.Login__signin}>
            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className={styles.Login__Button}
              type="submit"
              onClick={handleLogIn}
            >
              Login
            </button>
          </form>
          <button
            className={styles.other__Button}
            onClick={() => {
              setShowLogin(false);
            }}
          >
            Sign up
          </button>
        </Box>
      ) : (
        <Box>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Sign Up
          </Typography>

          <form className={styles.app__signup}>
            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              placeholder="email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              className={styles.Login__Button}
              type="submit"
              onClick={handleSignUp}
            >
              Sign up
            </button>
          </form>
          <button
            className={styles.other__Button}
            onClick={() => {
              setShowLogin(true);
            }}
          >
            Log in
          </button>
        </Box>
      )}
    </div>
  );
}

export default Login;
