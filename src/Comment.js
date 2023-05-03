import React from "react";
import styles from "./style/Comment.module.css";

function Comment({ id, username, comment }) {
  return (
    <div className={styles.comment__container} key={id}>
      <div className={styles.comment__profile}>
        <img
          className={styles.profile__avatar}
          src="default_profile.jpg"
          alt="Profile"
        />
      </div>

      <div className={styles.comment}>
        <a href={"/" + username}>{username}</a>
        <p>{comment}</p>
      </div>

      <div>
        <p>time likes</p>
      </div>
    </div>
  );
}

export default Comment;
