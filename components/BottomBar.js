import Image from "next/image";
import {
  HiHome,
  HiUserCircle,
  HiBell,
  HiLogin,
  HiBookmark,
} from "react-icons/hi";
import { MdTravelExplore, MdMessage } from "react-icons/md";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";

function BottomBar({ tab }) {
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <div>
      {/* <!-- component --> */}
      <section
        id="bottom-navigation"
        className="sm:hidden fixed inset-x-0 bottom-0 z-10 bg-white shadow flex flex-row justify-center items-center p-2  "
      >
        {tab == "Home" ? (
          <div
            id="tabs"
            className={`flex justify-center items-center  m-auto text-blue-800 `}
            onClick={() => router.push("/")}
          >
            <HiHome size={20} />
          </div>
        ) : (
          <div
            id="tabs"
            className={`flex justify-center items-center  m-auto text-green-800 `}
            onClick={() => router.push("/")}
          >
            <HiHome size={20} />
          </div>
        )}
        {/* {session && (
          <div
            id="tabs"
            className={`${
              tab == "Messages" ? "text-green-800 " : ""
            }flex justify-center items-center  m-auto `}
          >
            <MdMessage size={20} />
          </div>
        )} */}
        {tab == "Explore" ? (
          <div
            id="tabs"
            className={`flex justify-center items-center  m-auto text-blue-800`}
            onClick={() => router.push("/explore")}
          >
            <MdTravelExplore size={20} />
          </div>
        ) : (
          <div
            id="tabs"
            className={`flex justify-center items-center  m-auto text-green-800 `}
            onClick={() => router.push("/explore")}
          >
            <MdTravelExplore size={20} />
          </div>
        )}

        {tab == "BookMark" && session ? (
          <div
            id="tabs"
            className={`flex justify-center items-center  m-auto text-blue-800`}
            onClick={() => router.push("/bookmark")}
          >
            <HiBookmark size={20} />
          </div>
        ) : (
          <div
            id="tabs"
            className={`flex justify-center items-center  m-auto text-green-800 `}
            onClick={() => router.push("/bookmark")}
          >
            <HiBookmark size={20} />
          </div>
        )}

        {session ? (
          <div
            id="tabs"
            className={`flex justify-center items-center  m-auto `}
            onClick={() => router.push("/profile")}
          >
            <div className=" h-6 w-6">
              <Image
                src={session.user.image}
                alt="user-Image"
                width={50}
                height={50}
                className=" rounded-full mr-2 cursor-pointer hover:brightness-90"
              ></Image>
            </div>
          </div>
        ) : (
          <div
            id="tabs"
            className={`flex justify-center items-center  m-auto text-green-800`}
            onClick={signIn}
          >
            <HiLogin size={20} />
          </div>
        )}
      </section>
    </div>
  );
}

export default BottomBar;
