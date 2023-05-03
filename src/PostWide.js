import React, { useState, useEffect } from "react";
import styles from "./style/PostWide.module.css";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  serverTimestamp,
  Timestamp,
  limit,
  addDoc,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "./firebase";
import Comment from "./Comment";
import { useAuth } from "./AuthContext";
function Post({ postId, username, caption, imageUrl, likes }) {
  const [comments, SetComments] = useState([]);
  const [comment, setComment] = useState("");
  const { user } = useAuth();
  useEffect(() => {
    const q = query(
      collection(db, "posts", postId, "comments"),
      orderBy("timestamp", "desc"),
      limit(5)
    );
    let unsubscribe;
    if (postId) {
      unsubscribe = onSnapshot(q, (snapshot) => {
        SetComments(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            username: user,
            timestamp: doc.data().timestamp,
            comment: doc.data().comment,
          }))
        );
      });
    }
    return () => {
      unsubscribe();
    };
  }, [postId]);

  const postComment = async (event) => {
    event.preventDefault();

    const docRef = await addDoc(collection(db, "posts", postId, "comments"), {
      timestamp: serverTimestamp(),
      comment: comment,
      username: username,
    });
  };

  // const handleLike = async () => {
  //   console.log("like");

  //   const likesRef = doc(db, "posts", postId);
  //   await updateDoc(likesRef, {
  //     population: increment(1),
  //   });
  // };

  // const handleUnlike = async () => {
  //   console.log("Unlike");

  //   const likesRef = doc(db, "posts", postId);
  //   await updateDoc(likesRef, {
  //     population: increment(-1),
  //   });
  // };

  return (
    <div className={styles.post}>
      <div className={styles.container}>
        <div className={styles.image}>
          <img src={imageUrl} alt="" loading="lazy" />
        </div>

        <div className={styles.post__info}>
          <div className={styles.post__profile}>
            <img
              className={styles.post_avatar}
              src="default_profile.jpg"
              alt="Profile"
              loading="lazy"
            />
            <a href={"/" + username}>{username}</a>
          </div>
          <div className={styles.post__user}>
            <img
              className={styles.post_avatar}
              src="default_profile.jpg"
              alt="Profile"
              loading="lazy"
            />
            <a href={"/" + username}>{username}</a>
            <p>{caption}</p>
          </div>

          <div className={styles.comments}>
            {comments.map(({ id, username, timestamp, comment }) => (
              <Comment
                key={id}
                id={id}
                username={username}
                timestamp={timestamp}
                comment={comment}
              />
            ))}
          </div>

          <div className={styles.post__icons}>
            <div>
              <svg
                aria-label="Like"
                color="rgb(245, 245, 245)"
                fill="rgb(245, 245, 245)"
                height="24"
                role="img"
                viewBox="0 0 24 24"
                width="24"
              >
                <title>Like</title>
                <path d="M16.792 3.904A4.989 4.989 0 0 1 21.5 9.122c0 3.072-2.652 4.959-5.197 7.222-2.512 2.243-3.865 3.469-4.303 3.752-.477-.309-2.143-1.823-4.303-3.752C5.141 14.072 2.5 12.167 2.5 9.122a4.989 4.989 0 0 1 4.708-5.218 4.21 4.21 0 0 1 3.675 1.941c.84 1.175.98 1.763 1.12 1.763s.278-.588 1.11-1.766a4.17 4.17 0 0 1 3.679-1.938m0-2a6.04 6.04 0 0 0-4.797 2.127 6.052 6.052 0 0 0-4.787-2.127A6.985 6.985 0 0 0 .5 9.122c0 3.61 2.55 5.827 5.015 7.97.283.246.569.494.853.747l1.027.918a44.998 44.998 0 0 0 3.518 3.018 2 2 0 0 0 2.174 0 45.263 45.263 0 0 0 3.626-3.115l.922-.824c.293-.26.59-.519.885-.774 2.334-2.025 4.98-4.32 4.98-7.94a6.985 6.985 0 0 0-6.708-7.218Z"></path>
              </svg>
            </div>
            <div>
              <svg
                aria-label="Comment"
                color="rgb(245, 245, 245)"
                fill="rgb(245, 245, 245)"
                height="24"
                role="img"
                viewBox="0 0 24 24"
                width="24"
              >
                <title>Comment</title>
                <path
                  d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
                  fill="none"
                  stroke="currentColor"
                  strokeLinejoin="round"
                  strokeWidth="2"
                ></path>
              </svg>
            </div>
            <div>
              <svg
                aria-label="Share Post"
                color="rgb(245, 245, 245)"
                fill="rgb(245, 245, 245)"
                height="24"
                role="img"
                viewBox="0 0 24 24"
                width="24"
              >
                <title>Share Post</title>
                <line
                  fill="none"
                  stroke="currentColor"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  x1="22"
                  x2="9.218"
                  y1="3"
                  y2="10.083"
                ></line>
                <polygon
                  fill="none"
                  points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
                  stroke="currentColor"
                  strokeLinejoin="round"
                  strokeWidth="2"
                ></polygon>
              </svg>
            </div>
          </div>
          <p>{likes ? `${likes} likes` : ""}</p>

          <div className={styles.post__comment}>
            <form>
              <input
                className={styles.post__input}
                type="text"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </form>
            <button
              className={styles.post__button}
              disabled={!comment}
              type="submit"
              onClick={postComment}
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Post;
