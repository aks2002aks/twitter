import {
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import Image from "next/image";
import { BiDotsHorizontal, BiShareAlt, BiTrashAlt } from "react-icons/bi";
import { FaEye } from "react-icons/fa";
import { HiChat, HiHeart } from "react-icons/hi";
import { MdVerified } from "react-icons/md";
import Moment from "react-moment";
import { db, storage } from "../firebase";
import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { deleteObject, ref } from "firebase/storage";
import { useRecoilState } from "recoil";
import { modalState, postIdState, shareModalState } from "@/atom/modalAtom";
import { useRef } from "react";
import { useRouter } from "next/router";
import { BookmarkIcon } from "@heroicons/react/solid";

export default function Posts({ post, id }) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [menu, setMenu] = useState(false);
  const [comments, setComments] = useState([]);
  const [hasliked, setHasLiked] = useState(false);
  const [hasBookmarked, setHasBookmarked] = useState(false);
  const [open, setOpen] = useRecoilState(modalState);
  const [openShare, setOpenShare] = useRecoilState(shareModalState);
  const [postId, setPostId] = useRecoilState(postIdState);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts", id, "likes"),
      (snapshot) => {
        setLikes(snapshot.docs);
      }
    );
  }, [db]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts", id, "bookmarks"),
      (snapshot) => {
        setBookmarks(snapshot.docs);
      }
    );
  }, [db]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "posts", id, "comments"),
      (snapshot) => {
        setComments(snapshot.docs);
      }
    );
  }, [db]);

  useEffect(() => {
    setHasLiked(
      likes.findIndex((like) => like.id === session?.user.uid) !== -1
    );
  }, [likes, session?.user.uid]);

  useEffect(() => {
    setHasBookmarked(
      bookmarks.findIndex((bookmark) => bookmark.id === session?.user.uid) !==
        -1
    );
  }, [bookmarks, session?.user.uid]);

  function nFormatter(num, digits) {
    const lookup = [
      { value: 1, symbol: "" },
      { value: 1e3, symbol: "k" },
      { value: 1e6, symbol: "M" },
      { value: 1e9, symbol: "G" },
      { value: 1e12, symbol: "T" },
      { value: 1e15, symbol: "P" },
      { value: 1e18, symbol: "E" },
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    var item = lookup
      .slice()
      .reverse()
      .find(function (item) {
        return num >= item.value;
      });
    return item
      ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
      : "0";
  }

  async function likePost() {
    if (session) {
      if (hasliked) {
        await deleteDoc(doc(db, "posts", id, "likes", session?.user.uid));
        await updateDoc(doc(db, "posts", id), {
          likes: arrayRemove(session?.user.uid),
        });
      } else {
        await setDoc(doc(db, "posts", id, "likes", session?.user.uid), {
          username: session?.user.username,
        });
        await updateDoc(doc(db, "posts", id), {
          likes: arrayUnion(session?.user.uid),
        });
      }
    } else {
      signIn();
    }
  }

  async function bookmarkPost() {
    if (session) {
      if (hasBookmarked) {
        await deleteDoc(doc(db, "posts", id, "bookmarks", session?.user.uid));
        await updateDoc(doc(db, "posts", id), {
          bookmarks: arrayRemove(session?.user.uid),
        });
      } else {
        await setDoc(doc(db, "posts", id, "bookmarks", session?.user.uid), {
          username: session?.user.username,
        });
        await updateDoc(doc(db, "posts", id), {
          bookmarks: arrayUnion(session?.user.uid),
        });
      }
    } else {
      signIn();
    }
  }

  async function deletePost() {
    if (window.confirm("Are you sure you want to delete?")) {
      deleteDoc(doc(db, "posts", id));
      if (post.data()?.image) {
        deleteObject(ref(storage, `posts/${id}/image`));
      }
      router.push("/");
    }
  }

  return (
    <div className="flex p-3 cursor-pointer border-b border-gray-200 pb-8 sm:pb-0">
      {/* user image */}
      {!post?.data()?.anonymous ? (
        <Image
          className=" h-11 w-11 rounded-full mr-4"
          src={post?.data()?.userImg}
          alt="user-img"
          height={44}
          width={44}
          onClick={() => {
            if (session) {
              if (post?.data()?.id == session.user.uid) {
                router.push(`/profile`);
              } else {
                router.push(`/Profile/${post?.data()?.id}`);
              }
            } else {
              router.push("/auth/signin");
            }
          }}
        />
      ) : (
        <Image
          className=" h-11 w-11 rounded-full mr-4"
          src="https://e7.pngegg.com/pngimages/178/595/png-clipart-user-profile-computer-icons-login-user-avatars-monochrome-black.png"
          alt="user-img"
          height={44}
          width={44}
        />
      )}

      {/* right side */}
      <div className="flex-1 relative">
        {/* Header */}

        <div className="flex items-center  justify-between md:whitespace-nowrap">
          {/* post user info */}
          <div className="flex md:items-center sm:flex-row flex-col space-x-1  ">
            {!post?.data()?.anonymous ? (
              <>
                <h4
                  className="  font-bold text-[15px] sm:text-[16px] hover:underline"
                  onClick={() => {
                    if (session) {
                      if (post?.data()?.id == session.user.uid) {
                        router.push("/profile");
                      } else {
                        router.push(`/Profile/${post?.data()?.id}`);
                      }
                    } else {
                      router.push("/auth/signin");
                    }
                  }}
                >
                  {post?.data()?.name}
                </h4>
                <div className="md:flex">
                  <span
                    className="  text-sm sm:text-[15px]"
                    onClick={() => {
                      if (session) {
                        if (post?.data()?.id == session.user.uid) {
                          router.push("/profile");
                        } else {
                          router.push(`/Profile/${post?.data()?.id}`);
                        }
                      } else {
                        router.push("/auth/signin");
                      }
                    }}
                  >
                    @{post?.data()?.username} -
                  </span>
                  <span className="text-sm sm:text-[15px] hover:underline">
                    <Moment fromNow>{post?.data()?.timestamp?.toDate()}</Moment>
                  </span>
                </div>
              </>
            ) : (
              <>
                <h4 className=" font-bold text-[15px] sm:text-[16px] hover:underline">
                  Anonymous
                </h4>
                <div className="md:flex">
                  <span className=" text-sm sm:text-[15px]">@Anonymous -</span>
                  <span className="text-sm sm:text-[15px] hover:underline">
                    <Moment fromNow>{post?.data()?.timestamp?.toDate()}</Moment>
                  </span>
                </div>
              </>
            )}
          </div>

          {/* dot icon */}
          {post?.data()?.verified ? (
            <MdVerified className=" text-green-500" title="Verified Post" />
          ) : (
            <MdVerified
              className=" text-orange-500"
              title="Not Verified Post"
            />
          )}
          <BiDotsHorizontal
            className="h-10 hoverEffect w-10 hover:bg-sky-100 hover:text-sky-500 p-2 "
            onClick={() => {
              setMenu(!menu);
            }}
          />

          <div
            className={`${
              menu ? "inline" : "hidden"
            } p-2 text-gray-800 bg-gray-200 absolute top-0 right-0 mt-7 mr-2 rounded-xl w-28 `}
            ref={ref}
          >
            <div
              className="flex  justify-center items-center  rounded-xl hover:text-sky-800 hover:bg-sky-400 p-1"
              onClick={() => {
                if (!session) {
                  // signIn();
                  router.push("/auth/signin");
                } else {
                  setOpenShare(!openShare);
                  setPostId(id);
                }
              }}
            >
              <BiShareAlt className="h-6 w-6 p-1" /> Share
            </div>
            <div
              className="flex  justify-center items-center rounded-xl  hover:text-red-800 hover:bg-red-400 p-1"
              onClick={deletePost}
            >
              {(session?.user.uid === post?.data()?.id ||
                session?.user.admin) && <BiTrashAlt className="h-6 w-6 p-1" />}
              Delete
            </div>
          </div>
        </div>

        {/* post text */}

        <p
          onClick={() => router.push(`/posts/${id}`)}
          className="text-gray-800 text-[15px sm:text-[16px] mb-2 break-all mr-3"
        >
          {post?.data()?.text}
        </p>

        {/* post image */}
        {post?.data()?.image && (
          <Image
            onClick={() => router.push(`/posts/${id}`)}
            className="rounded-2xl mr-2"
            src={post?.data()?.image}
            alt=""
            width={500}
            height={500}
            priority
          />
        )}

        {/* icons */}

        <div className="flex justify-between text-gray-500 p-2">
          <div className="flex items-center select-none">
            <HiChat
              onClick={() => {
                if (!session) {
                  // signIn();
                  router.push("/auth/signin");
                } else {
                  setPostId(id);
                  setOpen(!open);
                }
              }}
              className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100"
            />
            {comments.length >= 0 && (
              <span className="text-sm">{comments.length}</span>
            )}
          </div>

          <div className=" flex items-center">
            {hasliked ? (
              <HiHeart
                className="h-9 w-9 hoverEffect p-2 text-red-600 hover:bg-red-100"
                onClick={likePost}
              />
            ) : (
              <HiHeart
                onClick={likePost}
                className="h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100"
              />
            )}
            {likes.length >= 0 && (
              <span className={`${hasliked && "text-red-600"}`}>
                {likes.length}
              </span>
            )}
          </div>

          <div className=" flex items-center">
            <FaEye className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100" />

            {post?.data()?.views >= 0 && (
              <span className="">{nFormatter(post?.data()?.views, 1)}</span>
            )}
          </div>

          <div className=" flex items-center">
            {hasBookmarked ? (
              <BookmarkIcon
                className="h-9 w-9 hoverEffect p-2 text-sky-500
               hover:bg-sky-100"
                onClick={bookmarkPost}
              />
            ) : (
              <BookmarkIcon
                className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100"
                onClick={bookmarkPost}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
