import { LocationMarkerIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Image from "next/image";
import React from "react";
import Moment from "react-moment";
import { onSnapshot, query, doc } from "firebase/firestore";
import { db } from "../firebase";
import { async } from "@firebase/util";

export default function ProfileTab() {
  const { data: session } = useSession();
  const [user, setUser] = useState();

  useEffect(() => {
    async () => {
      await onSnapshot(
        query(doc(db, "users", session?.user?.uid)),
        (snapshot) => {
          setUser(snapshot);
        }
      );
    };
  }, [session?.user?.uid]);

  return (
    <div className="flex flex-col cursor-pointer  border-gray-200 relative">
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
        src={session?.user.image}
        alt="user-img"
        height={100}
        width={100}
      />
      {/* about user  */}

      <div className="font-extrabold flex justify-end mr-4 mt-2 rounded-full">
        <button className="text-white bg-[#24292F] hover:bg-[#24292F]/90 focus:ring-4 focus:outline-none focus:ring-[#24292F]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-gray-500 dark:hover:bg-[#050708]/30 ">
          SetUp Profile
        </button>
      </div>
      <div className="flex justify-end mr-10">
        <span className="text-xs">coming soon</span>
      </div>
      <div className="flex flex-col pb-2 pl-3 font-extrabold">
        <span>{session?.user.name}</span>
        <span>@{session?.user.username}</span>
        <div className="flex flex-row text-sm font-normal  mt-2">
          <LocationMarkerIcon className="w-5 h-5" />
          <span>Joined</span>
          <Moment format="MMMM,YYYY" className="ml-2">
            {user?.data()?.timestamp?.toDate()}
          </Moment>
        </div>
      </div>
    </div>
  );
}
