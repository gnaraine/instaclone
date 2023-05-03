import React, { useState, useEffect, Suspense } from "react";
import { useParams } from "react-router-dom";
import styles from "./style/Profile.module.css";
import Layout from "./Layout";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  limit,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db, storage } from "./firebase";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { ref, deleteObject } from "firebase/storage";
import { useAuth } from "./AuthContext";
import PostWide from "./PostWide";

function Profile() {
  const { user } = useAuth();
  const params = useParams().slug;
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [popPost, setPopPost] = useState("");
  const [popPostId, setPopPostId] = useState("");

  const handleLike = () => {};

  const handleDelete = async (post) => {
    console.log("delete");
    //delete image
    const imageRef = ref(storage, popPost.imageUrl);
    console.log(imageRef);
    // Delete the file
    deleteObject(imageRef)
      .then(() => {
        // File deleted successfully
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
      });

    //delete post comments
    await deleteDoc(doc(db, "posts", popPostId));
  };

  const handleOpen = (post, id) => {
    setPopPost(post);
    setPopPostId(id);
    setOpen(true);

    console.log(popPostId);
    console.log(popPost);
  };
  const handleClose = () => setOpen(false);

  useEffect(() => {
    //get posts
    const q = query(
      collection(db, "posts"),
      where("username", "==", params),
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
  }, [params]);

  return (
    <Layout>
      <div className={styles.main}>
        <div className={styles.profile}>
          <div className={styles.profile_avatar}>
            <img
              src="default_profile.jpg"
              alt="Profile"
              loading="lazy"
              width={150}
              height={150}
            />
          </div>
          <div className={styles.profile_info}>
            <div className={styles.user}>
              <p>{params}</p>
              <button>Following?</button>
            </div>
            <div className={styles.stats}>
              <p>99 posts</p>
              <p>99 followers</p>
              <p>99 following</p>
            </div>
            <div>Name</div>
            <div className={styles.bio}>
              Bio Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Pariatur dolorum nulla aut.
            </div>{" "}
          </div>
        </div>
        <div className={styles.profile__feed}>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box className={styles.profile__box}>
              <button
                onClick={handleClose}
                className={styles.profile__button__close}
              >
                <svg
                  aria-label="Close"
                  class="x1lliihq x1n2onr6"
                  color="rgb(255, 255, 255)"
                  fill="rgb(255, 255, 255)"
                  height="18"
                  role="img"
                  viewBox="0 0 24 24"
                  width="18"
                >
                  <title>Close</title>
                  <polyline
                    fill="none"
                    points="20.643 3.357 12 12 3.353 20.647"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="3"
                  ></polyline>
                  <line
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="3"
                    x1="20.649"
                    x2="3.354"
                    y1="20.649"
                    y2="3.354"
                  ></line>
                </svg>
              </button>
              <div id="post__modal" className={styles.post__modal}>
                {user === params ? (
                  <>
                    <button
                    // onClick={() => {
                    //   handleDelete(popPost.id);
                    // }}
                    >
                      Delete
                    </button>
                  </>
                ) : (
                  ""
                )}

                <PostWide
                  className={styles.post__info}
                  key={popPostId}
                  postId={popPostId}
                  username={popPost.username}
                  caption={popPost.caption}
                  imageUrl={popPost.imageUrl}
                />

                {/* <p>{popPost.likes} likes</p> */}
              </div>
            </Box>
          </Modal>

          {posts.map(({ id, post }) => (
            <div
              className={styles.feed__item}
              key={id}
              onClick={() => {
                handleOpen(post, id);
              }}
            >
              <Suspense fallback={<div> Please Wait... </div>}>
                <img
                  className={styles.post__image}
                  src={post.imageUrl}
                  alt=""
                  loading="lazy"
                />
              </Suspense>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Profile;
