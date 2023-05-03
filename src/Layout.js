import React from "react";
import Nav from "./Nav";
import styles from "./style/Layout.module.css";
function Layout({ children }) {
  return (
    <div className={styles.grid__container}>
      <nav>
        <Nav />
      </nav>
      <article>{children}</article>
    </div>
  );
}

export default Layout;
