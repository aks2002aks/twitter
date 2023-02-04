import Image from "next/image";
import SidebarMenuitem from "./SidebarMenuitem";
import {
  HiBell,
  HiBookmark,
  HiDotsCircleHorizontal,
  HiDotsHorizontal,
  HiHome,
  HiUserCircle,
  HiOutlineLogout,
  HiOutlineLogin,
} from "react-icons/hi";
import { MdListAlt, MdMessage, MdTravelExplore } from "react-icons/md";

import { useSession, signOut, signIn } from "next-auth/react";

export default function Sidebar({ tab }) {
  const { data: session } = useSession();
  return (
    <>
      <div className="hidden sm:flex flex-col p-2 xl:items-start fixed h-full">
        {/* twitter logo */}
        <div className="hoverEffect p-0 hover:bg-green-400 xl:px-1">
          <Image
            src="https://toppng.com/uploads/preview/twitter-logo-11549680523gyu1fhgduu.png"
            width={50}
            height={50}
            alt="twitter image"
          ></Image>
        </div>
        {/* menu */}
        <div className="mt-4 mb-2.5 xl:items-start">
          <SidebarMenuitem
            text="Home"
            Icon={HiHome}
            active={tab == "Home" ? true : false}
          />
          <SidebarMenuitem
            text="Explore"
            Icon={MdTravelExplore}
            active={tab == "Explore" ? true : false}
          />

          {session && (
            <>
              <SidebarMenuitem
                text="Notifications"
                Icon={HiBell}
                active={tab == "Notifications" ? true : false}
              />
              <SidebarMenuitem
                text="Messages"
                Icon={MdMessage}
                active={tab == "Messages" ? true : false}
              />
              <SidebarMenuitem
                text="BookMark"
                Icon={HiBookmark}
                active={tab == "BookMark" ? true : false}
              />
              <SidebarMenuitem
                text="Lists"
                Icon={MdListAlt}
                active={tab == "Lists" ? true : false}
              />
              <SidebarMenuitem
                text="Profile"
                Icon={HiUserCircle}
                active={tab == "Profile" ? true : false}
              />
              <SidebarMenuitem
                text="More"
                Icon={HiDotsCircleHorizontal}
                active={tab == "More" ? true : false}
              />
              <div onClick={signOut}>
                <SidebarMenuitem text="Logout" Icon={HiOutlineLogout} />
              </div>
            </>
          )}
        </div>

        {session ? (
          <>
            {/* button  */}
            <button className="bg-green-500 text-white rounded-full w-56 h-12 font-bold shadow-md hover:brightness-95 text-lg hidden xl:inline">
              Tweet
            </button>

            {/* mini profile */}
            <div className="hoverEffect text-green-800 flex items-center justify-center xl:justify-start mt-auto">
              <div className=" h-11 w-11">
                <Image
                  src={session.user.image}
                  alt="user-Image"
                  width={40}
                  height={40}
                  className=" rounded-full mr-2 cursor-pointer hover:brightness-90"
                ></Image>
              </div>
              <div className="leading-5 hidden xl:inline">
                <h4 className="font-bold">{session.user.name}</h4>
                <p className="text-green-700">@{session.user.username}</p>
              </div>
              <HiDotsHorizontal className="h-5 xl:ml-5 hidden xl:inline" />
            </div>
          </>
        ) : (
          <>
            <div onClick={signIn}>
              <SidebarMenuitem text="Login" Icon={HiOutlineLogin} />
            </div>
          </>
        )}
      </div>
    </>
  );
}
