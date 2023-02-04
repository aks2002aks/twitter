import { useSession } from "next-auth/react";
import Image from "next/image";
import { HiEmojiHappy, HiPhotograph } from "react-icons/hi";
import { useRef, useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { ref, uploadString, getDownloadURL } from "firebase/storage";
import { RxCrossCircled } from "react-icons/rx";

export default function Input() {
  const { data: session } = useSession();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const filePickerRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const sendPost = async () => {
    if (loading) return;
    setLoading(true);
    const docRef = await addDoc(collection(db, "posts"), {
      id: session.user.uid,
      text: input,
      userImg: session.user.image,
      timestamp: serverTimestamp(),
      name: session.user.name,
      username: session.user.username,
      verified: false,
      anonymous: anonymous,
    });

    const imageRef = ref(storage, `post/${docRef.id}/image`);

    if (selectedFile) {
      const uploadTask = await uploadString(
        imageRef,
        selectedFile,
        "data_url"
      ).then(async () => {
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(doc(db, "posts", docRef.id), {
          image: downloadURL,
        });
      });
    }

    setInput("");
    setSelectedFile(null);
    setLoading(false);
    setAnonymous(false);
  };

  const addImageToPost = async (e) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
      reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent) => {
      setSelectedFile(readerEvent.target.result);
    };
  };

  const handleChange = (event) => {
    if (event.target.checked) {
      setAnonymous(true);
    } else {
      setAnonymous(false);
    }
  };

  return (
    <>
      {session && (
        <div className="flex border-b border-gray-200 p-3 space-x-3">
          <div className=" h-11 w-11">
            <Image
              src={session.user.image}
              alt="user-Image"
              width={50}
              height={50}
              className=" rounded-full mr-2 cursor-pointer hover:brightness-90"
            ></Image>
          </div>

          <div className="w-full divide-y divide-gray-200">
            <div className="">
              <textarea
                className="w-full border-0 focus:ring-0 text-lg placeholder-gray-700 tracking-wide min-h-[50px] text-gray-700"
                row="2"
                placeholder="Whats Happening ?"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              ></textarea>
            </div>
            {selectedFile && (
              <>
                <div className="relative">
                  <RxCrossCircled
                    onClick={() => setSelectedFile(null)}
                    className="h-5 w-5 absolute cursor-pointer shadow-md shadow-white rounded-full hover:brightness-50"
                  />
                  <Image
                    src={selectedFile}
                    alt="user-Image"
                    width={1000}
                    height={1000}
                    className={`${loading && "animate-pulse"}`}
                  ></Image>
                </div>
              </>
            )}
            <div className="flex items-center justify-between pt-2.5">
              {!loading && (
                <>
                  <div className="flex">
                    <div
                      className="  "
                      onClick={() => filePickerRef.current.click()}
                    >
                      <HiPhotograph className="h-8 w-8 hoverEffect p-2 text-sky-500 hover:bg-sky-100" />
                      <input
                        type="file"
                        hidden
                        ref={filePickerRef}
                        onChange={addImageToPost}
                      />
                    </div>

                    <HiEmojiHappy className="h-8 w-8 hoverEffect p-2 text-sky-500 hover:bg-sky-100" />

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        value={anonymous}
                        onChange={handleChange}
                      />
                      <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[6px] after:left-[0px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                    <span className="ml-3 mt-2 text-xs font-medium text-gray-900 dark:text-gray-300">
                      upload as anonymous
                    </span>
                  </div>
                  <button
                    onClick={sendPost}
                    disabled={!input.trim()}
                    className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50"
                  >
                    Tweet
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
