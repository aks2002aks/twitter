import { db } from "../firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useEffect } from "react";
import { HiSparkles } from "react-icons/hi";
import Input from "./Input";
import Posts from "./Posts";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    return onSnapshot(
      query(collection(db, "posts"), orderBy("timestamp", "desc")),
      (snapshot) => {
        setPosts(snapshot.docs);
      }
    );
  }, []);

  return (
    <div className="xl:ml-[375px] border-l sm:border-r xl:min-w-[576px] sm:ml-[73px] flex-grow max-w-[40rem] border-gray-200">
      <div className="flex py-2 px-3 sticky top-0 z-50 bg-white border-b border-gray-200">
        <h2 className="text-lg sm:text-xl font-bold cursor-pointer">Home</h2>
        <div className="text-green-800 hoverEffect items-center justify-center flex px-0 ml-auto w-9 h-9">
          <HiSparkles className="h-6" />
        </div>
      </div>
      <Input />
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
    </div>
  );
}
