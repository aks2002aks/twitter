import { ArrowLeftIcon, LocationMarkerIcon } from "@heroicons/react/outline";
import Head from "next/head";
import CommentModal from "../../components/CommentModal";
import Sidebar from "../../components/Sidebar";
import Widgets from "../../components/Widgets";
import Posts from "../../components/Posts";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "../../firebase";
import { AnimatePresence, motion } from "framer-motion";
import { useSession } from "next-auth/react";
import ShareModal from "@/components/ShareModal";
import Image from "next/image";
import Moment from "react-moment";

export default function ProfilePage({ newsResults, randomUsersResults }) {
  const router = useRouter();
  const { userId } = router.query;
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState();
  const { data: session } = useSession();

  useEffect(() => {
    return onSnapshot(
      query(collection(db, "posts"), orderBy("timestamp", "desc")),
      (snapshot) => {
        setPosts(snapshot.docs);
      }
    );
  }, [userId]);

  useEffect(() => {
    updateDoc(doc(db, "users", userId), { views: increment(1) });
  }, []);

  useEffect(() => {
    return onSnapshot(query(doc(db, "users", userId)), (snapshot) => {
      setUser(snapshot);
    });
  }, [userId]);

  return (
    <div>
      <Head>
        <title>{user?.data()?.name}</title>
        <meta name="description" content="user profile for Kweet users" />
      </Head>

      <main className="flex min-h-screen mx-auto">
        {/* Sidebar */}
        <Sidebar />

        <div className="xl:ml-[370px] border-l border-r border-gray-200  xl:min-w-[576px] sm:ml-[73px] flex-grow max-w-xl">
          {/* back button */}
          <div className="flex items-center space-x-2  py-2 px-3 sticky top-0 z-50 bg-white border-b border-gray-200">
            <div className="hoverEffect" onClick={() => router.push("/")}>
              <ArrowLeftIcon className="p-3 xl:p-0 xl:h-5 " />
            </div>
            <h2 className="text-lg sm:text-xl font-bold cursor-pointer">
              {user?.data()?.name}
            </h2>
          </div>

          {/* profile tab  */}
          <div className="flex flex-col cursor-pointer  border-gray-200 relative border-b">
            {/* background image  */}
            <div className="flex ">
              <Image
                className="sm:h-[180px] h-[150px]"
                src="https://cdn.pixabay.com/photo/2017/08/30/01/05/milky-way-2695569_960_720.jpg"
                alt="user-img"
                height={400}
                width={1000}
              />
            </div>

            {/* userImage */}
            <Image
              className=" h-15 w-15 rounded-full mr-4 absolute sm:top-32 border-4   top-24 ml-3 border-gray-400"
              src={user?.data()?.userImg}
              alt="user-img"
              height={100}
              width={100}
            />
            {/* about user  */}

            <div className="flex flex-col pb-2 pl-3 font-bold mt-14">
              <span>{user?.data()?.name}</span>
              <span>@{user?.data()?.username}</span>
              <div className="flex flex-row text-sm font-normal  mt-2">
                <LocationMarkerIcon className="w-5 h-5" />
                <span>Joined</span>
                <Moment format="MMMM,YYYY" className="ml-2">
                  {user?.data()?.timestamp?.toDate()}
                </Moment>
              </div>
            </div>
          </div>

          <AnimatePresence>
            {posts.map((post) => (
              <div key={post.id}>
                {post.data().id == userId && !post.data().anonymous && (
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
        </div>

        {/* Widgets */}

        <Widgets newsResults={newsResults.articles} />

        {/* Modal */}

        <CommentModal />
        <ShareModal />
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
