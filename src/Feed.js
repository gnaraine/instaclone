import React, { useState, useEffect, Suspense } from "react";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "./firebase";
import { useAuth } from "./AuthContext";
import styles from "./style/Feed.module.css";

const Post = React.lazy(() => import("./Post"));

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    //get posts
    const q = query(
      collection(db, "posts"),
      orderBy("timestamp", "desc"),
      limit(10)
    );
    let unsubscribe;
    unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          post: doc.data(),
        }))
      );
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className={styles.feed}>
      <div>
        <Suspense fallback={<div> Please Wait... </div>}>
          {posts.map(({ id, post }) => (
            <Post
              key={id}
              postId={id}
              username={post.username}
              caption={post.caption}
              imageUrl={post.imageUrl}
            />
          ))}
        </Suspense>
      </div>
    </div>
  );
};

export default Feed;
