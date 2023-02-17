import Posts from "../components/Posts";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  limit,
} from "firebase/firestore";
import { db } from "../firebase";
import { AnimatePresence, motion } from "framer-motion";
import InfiniteScroll from "react-infinite-scroll-component";
import { FaSpinner } from "react-icons/fa";

export default function MostViewed() {
  const [posts, setPosts] = useState([]);
  const [batchSize, setBatchSize] = useState(8);
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    return onSnapshot(
      query(collection(db, "posts"), orderBy("views", "desc")),
      (snapshot) => {
        setTotalPosts(snapshot.docs.length);
      }
    );
  }, []);

  useEffect(() => {
    return onSnapshot(
      query(
        collection(db, "posts"),
        orderBy("views", "desc"),
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
    <div>
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
          {posts.map((post, index) => (
            <div key={index}>
              {
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                >
                  <Posts id={post.id} post={post} />
                </motion.div>
              }
            </div>
          ))}
        </AnimatePresence>
      </InfiniteScroll>
    </div>
  );
}
