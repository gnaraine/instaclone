import React, { useState } from "react";
import { db, storage } from "./firebase";
import Compressor from "compressorjs";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { collection, addDoc, serverTimestamp, doc } from "firebase/firestore";
import styles from "./style/ImageUpload.module.css";

import { useAuth } from "./AuthContext";
function ImageUpload({ username }) {
  const [caption, setCaption] = useState("");
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [imgSrc, setImgSrc] = useState("");
  const { user } = useAuth();

  const handleBack = (e) => {
    console.log("back");
  };
  const handleNext = (e) => {
    console.log("next");

    const upload__preview = document.querySelector("#upload__preview");
    upload__preview.style.display = "none";

    const upload__caption = document.querySelector("#upload__caption");
    upload__caption.style.display = "block";
  };

  const handleCompressUpload = (e) => {
    const rawimage = image;
    new Compressor(rawimage, {
      quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
      success: (compressedResult) => {
        // compressedResult has the compressed file.
        // Use the compressed file to upload the images to your server.

        handleUpload(compressedResult);
      },
    });
  };

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }

    const imageSrc = URL.createObjectURL(e.target.files[0]);
    const imagePreviewElement = document.querySelector(
      "#preview-selected-image"
    );
    imagePreviewElement.src = imageSrc;
    imagePreviewElement.style.display = "block";

    setImgSrc(imageSrc);

    const upload__selector = document.querySelector("#upload__selector");
    upload__selector.style.display = "none";

    const upload__preview = document.querySelector("#upload__preview");
    upload__preview.style.display = "block";
  };

  const handleUpload = (compressedResult) => {
    setProgress(0);
    const randomId = doc(collection(db, "post")).id;

    console.log(randomId);

    const storage = getStorage();
    const storageRef = ref(
      storage,
      `images/${user}/${randomId}${compressedResult.name}`
    );

    // 'file' comes from the Blob or File API
    // uploadBytes(storageRef, image).then((snapshot) => {
    //   console.log('Uploaded a blob or file!');
    // });

    const uploadTask = uploadBytesResumable(storageRef, compressedResult);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          const docRef = await addDoc(collection(db, "posts"), {
            timestamp: serverTimestamp(),
            caption: caption,
            imageUrl: downloadURL,
            username: username,
          });
        });

        console.log("DONE");
        setCaption("");
        setImage(null);
      }
    );
  };

  return (
    <div className={styles.upload}>
      <div id="upload__selector" className={styles.upload__selector}>
        <div className={styles.upload_header}>
          <button className={`${styles.btn__back} ${styles.hidden}`}>
            Back
          </button>
          <p className={styles.title}>Create new post</p>
          <button className={`${styles.btn__next} ${styles.hidden}`}>
            Next
          </button>
        </div>

        <div>
          <svg
            aria-label="Icon to represent media such as images or videos"
            color="rgb(245, 245, 245)"
            fill="rgb(245, 245, 245)"
            height="77"
            role="img"
            viewBox="0 0 97.6 77.3"
            width="96"
          >
            <title>Icon to represent media such as images or videos</title>
            <path
              d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z"
              fill="currentColor"
            ></path>
            <path
              d="M84.7 18.4 58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z"
              fill="currentColor"
            ></path>
            <path
              d="M78.2 41.6 61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z"
              fill="currentColor"
            ></path>
          </svg>
        </div>

        <label className={styles.btn_choose} htmlFor="image_uploads">
          Choose images to upload (PNG, JPG)
        </label>
        <input
          type="file"
          id="image_uploads"
          onChange={handleChange}
          accept="image/png, image/jpeg"
        />
      </div>

      <div id="upload__preview" className={styles.upload__preview}>
        <div className={`${styles.upload_header} ${styles.headerWithButtons}`}>
          <button className={styles.btn__back} onClick={handleBack}>
            Back
          </button>
          <p className={styles.title}>Preview</p>
          <button className={styles.btn__next} onClick={handleNext}>
            Next
          </button>
        </div>

        <img
          className={styles.upload__image}
          id="preview-selected-image"
          alt=""
        />
      </div>

      <div id="upload__caption" className={styles.upload__caption}>
        <div className={`${styles.upload_header} ${styles.headerWithButtons}`}>
          <button className={styles.btn__back}>Back</button>
          <p className={styles.title}>Preview</p>
          <button className={styles.btn__next} onClick={handleCompressUpload}>
            Upload
          </button>
        </div>

        <div className={styles.caption__grid}>
          <img className={styles.upload__image} src={imgSrc} alt="" />

          <div className={styles.caption}>
            <div className={styles.profile}>
              <img
                className={styles.profile_avatar}
                src="default_profile.jpg"
                alt="Profile"
              />

              <p>{user}</p>
            </div>

            <textarea
              className={styles.caption__input}
              type="text"
              placeholder="Write a caption..."
              maxLength="200"
              onChange={(event) => setCaption(event.target.value)}
            />
            {/* <Button onClick={handleUpload}>Upload</Button> */}

            {progress === 100 ? (
              "Done"
            ) : (
              <progress
                className={styles.imageUpload__progress}
                value={progress}
              ></progress>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ImageUpload;
