import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  setDoc,
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

import { useRouter } from "next/router";

export default function Posts({ post, id }) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState([]);
  const [comments, setComments] = useState([]);
  const [hasliked, setHasLiked] = useState(false);
  const [open, setOpen] = useRecoilState(modalState);
  const [openShare, setOpenShare] = useRecoilState(shareModalState);
  const [postId, setPostId] = useRecoilState(postIdState);

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

  async function likePost() {
    if (session) {
      if (hasliked) {
        await deleteDoc(doc(db, "posts", id, "likes", session?.user.uid));
      } else {
        await setDoc(doc(db, "posts", id, "likes", session?.user.uid), {
          username: session?.user.username,
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
      <div className="flex-1">
        {/* Header */}

        <div className="flex items-center  justify-between md:whitespace-nowrap">
          {/* post user info */}
          <div className="flex md:items-center sm:flex-row flex-col space-x-1  ">
            {!post?.data()?.anonymous ? (
              <>
                <h4 className="  font-bold text-[15px] sm:text-[16px] hover:underline">
                  {post?.data()?.name}
                </h4>
                <div className="md:flex">
                  <span className="  text-sm sm:text-[15px]">
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
          <BiDotsHorizontal className="h-10 hoverEffect w-10 hover:bg-sky-100 hover:text-sky-500 p-2 " />
        </div>

        {/* post text */}

        <p
          onClick={() => router.push(`/posts/${id}`)}
          className="text-gray-800 text-[15px sm:text-[16px] mb-2 break-all"
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
              <span className="">{post?.data()?.views}</span>
            )}
          </div>

          <BiShareAlt
            onClick={() => {
              if (!session) {
                // signIn();
                router.push("/auth/signin");
              } else {
                setPostId(id);
                setOpenShare(!openShare);
              }
            }}
            className="h-9 w-9 hoverEffect p-2 hover:text-sky-500 hover:bg-sky-100"
          />

          {(session?.user.uid === post?.data()?.id || session?.user.admin) && (
            <BiTrashAlt
              className="h-9 w-9 hoverEffect p-2 hover:text-red-600 hover:bg-red-100"
              onClick={deletePost}
            />
          )}
        </div>
      </div>
    </div>
  );
}
