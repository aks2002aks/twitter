import Head from "next/head";
import CommentModal from "../components/CommentModal";
import Sidebar from "../components/Sidebar";
import Widgets from "../components/Widgets";
import { useRouter } from "next/router";
import ProfileTab from "@/components/ProfileTab";
import { useEffect, useState } from "react";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import { useSession, signOut } from "next-auth/react";
import ShareModal from "@/components/ShareModal";
import { AnimatePresence, motion } from "framer-motion";
import BottomBar from "@/components/BottomBar";
import { ArrowLeftIcon } from "@heroicons/react/outline";
import Posts from "@/components/Posts";
import { HiOutlineLogout } from "react-icons/hi";

export default function Profile({ newsResults }) {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [isKweet, setisKweet] = useState(true);
  const [isLikedPost, setisLikedPost] = useState(false);
  const { data: session } = useSession();
  

  useEffect(() => {
    onSnapshot(
      query(collection(db, "posts"), orderBy("timestamp", "desc")),
      (snapshot) => {
        setPosts(snapshot.docs);
      }
    );
  }, []);

  // get comments of the post

  return (
    <div>
      <Head>
        <title>Post Page</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex min-h-screen mx-auto">
        {/* Sidebar */}
        <Sidebar tab="Profile" />

        {/* Feed */}
        <div className="xl:ml-[375px] border-l sm:border-r xl:min-w-[576px] sm:ml-[73px] flex-grow max-w-[40rem] border-gray-200">
          <div className="flex items-center space-x-2  py-2 px-3 sticky top-0 z-50 bg-white border-b border-gray-200">
            <div className="hoverEffect" onClick={() => router.push("/")}>
              <ArrowLeftIcon className="p-3 xl:p-0 xl:h-5 " />
            </div>
            <h2 className="text-lg sm:text-xl font-bold cursor-pointer">
              {session?.user.name}
            </h2>
            <div
              onClick={() => {
                signOut({ callbackUrl: "/" });
              }}
              className={`absolute sm:hidden right-4`}
            >
              <HiOutlineLogout className="h-7 w-7" />
            </div>
          </div>
          <ProfileTab />

          {/* user tweets */}
          <div className="grid grid-cols-2 divide-x  border-b font-bold cursor-pointer ">
            <div
              className={`${
                isKweet && "bg-gray-400 "
              } text-center hover:bg-gray-200 pt-2 pb-2 pl-8 pr-8`}
              onClick={() => {
                setisKweet(true);
                setisLikedPost(false);
              }}
            >
              Kweets
            </div>
            <div
              className={`${
                isLikedPost && "bg-gray-400"
              } text-center hover:bg-gray-200 pt-2 pb-2 pl-8 pr-8`}
              onClick={() => {
                setisKweet(false);
                setisLikedPost(true);
              }}
            >
              Liked Posts
            </div>
          </div>
          {isLikedPost && (
            <AnimatePresence>
              {posts.map((post) => (
                <div key={post.id}>
                  {Array.isArray(post.data().likes) &&
                    post.data().likes.includes(session?.user?.uid) && (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                      >
                        <Posts id={post.id} post={post} />
                      </motion.div>
                    )}
                </div>
              ))}
            </AnimatePresence>
          )}

          {isKweet && (
            <AnimatePresence>
              {posts.map((post) => (
                <div key={post.id}>
                  {" "}
                  {post.data().id == session?.user.uid && (
                    <motion.div
                      key={post.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 1 }}
                    >
                      <Posts id={post.id} post={post} />
                    </motion.div>
                  )}
                </div>
              ))}
            </AnimatePresence>
          )}
        </div>
        {/* Widgets */}
        <Widgets newsResults={newsResults.articles} />
        {/* Modal */}
        <CommentModal />
        <ShareModal />
        <BottomBar tab="Profile" />
      </main>
    </div>
  );
}

export async function getServerSideProps() {
  const newsResults = await fetch(
    "https://saurav.tech/NewsAPI/top-headlines/category/general/in.json"
  ).then((res) => res.json());

  return {
    props: {
      newsResults: JSON.parse(JSON.stringify(newsResults)),
    },
  };
}
