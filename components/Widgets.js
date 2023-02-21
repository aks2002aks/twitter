import News from "./News";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/router";

export default function Widgets({ newsResults }) {
  const router = useRouter();
  const [articleNumber, setarticleNumber] = useState(3);
  const [userNumber, setUserNumber] = useState(3);
  const [users, setUsers] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    onSnapshot(
      query(collection(db, "users"), orderBy("timestamp", "desc")),
      (snapshot) => {
        setUsers(snapshot.docs);
      }
    );
  }, []);
  return (
    <div className="xl:w-[600px] hidden lg:inline ml-8 space-y-5 ">
      {/* <div className="w-[90%] xl:w-[75%] sticky top-0 bg-white py-1.5 z-50">
        <div className=" flex items-center p-3 rounded-full relative">
          <BiSearch className="h-5 w-5 z-50 text-gray-200 " />
          <input
            className="absolute inset-0 rounded-full pl-11 border-gray-500 text-gray-700 focus:shadow-lg focus:bg-white bg-gray-100"
            type="text"
            placeholder="Search Twitter"
          />
        </div>
      </div> */}
      <div className="text-gray-700 space-y-3 bg-gray-100 rounded-xl pt-2 w-[90%] xl:w-[75%] mt-5">
        <h4 className="font-bold text-xl px-4">Whats Happening</h4>

        <AnimatePresence>
          {newsResults.slice(0, articleNumber).map((article) => (
            <motion.div
              key={article.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <News key={article.title} article={article} />
            </motion.div>
          ))}
        </AnimatePresence>

        <button
          onClick={() => setarticleNumber(articleNumber + 3)}
          className="text-green-300 pl-4 pb-3 hover:text-green-500"
        >
          Show More
        </button>
      </div>

      <div className="text-gray-700 space-y-3 bg-gray-100 rounded-xl pt-2 w-[90%] xl:w-[75%]">
        <h4 className=" font-bold text-xl px-4">Top Accounts</h4>
        {/* map  */}

        <AnimatePresence>
          {users.slice(0, userNumber).map((user) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
            >
              <div
                className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-200"
                onClick={() => {
                  if (session) {
                    router.push(`/Profile/${user?.data()?.id}`);
                  } else {
                    router.push("/auth/signin");
                  }
                }}
              >
                <Image
                  className="rounded-xl"
                  width={40}
                  height={40}
                  src={user.data().userImg}
                  alt=""
                ></Image>
                <div className="truncate ml-4 leading-5">
                  <h4 className="font-bold hover:underline text-[14px] truncate">
                    {user.data().name}
                  </h4>
                  <h5 className="text-[13px] text-gray-500 truncate">
                    {user.data().username}
                  </h5>
                </div>
                {/* <button className="ml-auto bg-black text-white rounded-full px-3.5 py-1.5 font-bold">
                  Follow
                </button> */}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <button
          className="text-green-300 pl-4 pb-3 hover:text-green-500"
          onClick={() => setUserNumber(userNumber + 3)}
        >
          Show More
        </button>
      </div>
    </div>
  );
}
