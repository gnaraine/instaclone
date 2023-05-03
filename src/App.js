import React from "react";
import Feed from "./Feed";
// import "./App.css";
import Login from "./Login";
import { useAuth } from "./AuthContext";
import Layout from "./Layout";

function App() {
  const { user } = useAuth();
  return (
    <>
      {user ? (
        <>
          <Layout>
            <Feed />
          </Layout>
        </>
      ) : (
        <div className="App__Login">
          <Login />
        </div>
      )}
    </>
  );
}

export default App;
