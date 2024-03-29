import { db } from "../firebase";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  limit,
} from "firebase/firestore";
import { useEffect } from "react";
import { HiSparkles } from "react-icons/hi";
import Input from "./Input";
import Posts from "./Posts";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import InfiniteScroll from "react-infinite-scroll-component";
import { FaSpinner } from "react-icons/fa";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [batchSize, setBatchSize] = useState(8);
  const [totalPosts, setTotalPosts] = useState(8);

  useEffect(() => {
    return onSnapshot(
      query(collection(db, "posts"), orderBy("timestamp", "desc")),
      (snapshot) => {
        setTotalPosts(snapshot.docs.length);
      }
    );
  }, []);

  useEffect(() => {
    return onSnapshot(
      query(
        collection(db, "posts"),
        orderBy("timestamp", "desc"),
        limit(batchSize)
      ),
      (snapshot) => {
        setPosts(snapshot.docs);
      }
    );
  }, [batchSize]);

  const handleLoadMore = () => {
    setBatchSize(batchSize + 1);
  };

  return (
    <div className="xl:ml-[375px] border-l sm:border-r lg:min-w-[576px] sm:ml-[73px] flex-grow max-w-[40rem] border-gray-200">
      <div className="flex py-2 px-3 sticky top-0 z-50 bg-white border-b border-gray-200">
        <h2 className="text-lg sm:text-xl font-bold cursor-pointer">Home</h2>
        <div className="text-green-800 hoverEffect items-center justify-center flex px-0 ml-auto w-9 h-9">
          <HiSparkles className="h-6" />
        </div>
      </div>
      <Input />

      <InfiniteScroll
        dataLength={posts.length}
        next={handleLoadMore}
        hasMore={batchSize != totalPosts}
        loader={
          <div className="overflow-hidden">
            <FaSpinner className="animate-spin text-[red] w-6 h-6 mx-auto " />
          </div>
        }
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
      >
        <AnimatePresence>
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <Posts key={post.id} id={post.id} post={post} />
            </motion.div>
          ))}
        </AnimatePresence>
      </InfiniteScroll>
    </div>
  );
}
