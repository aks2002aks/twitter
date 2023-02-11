import React, { useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import { FcGoogle } from "react-icons/fc";
import { getProviders, signIn } from "next-auth/react";
import signinpng from "../../public/signin.png";
import Image from "next/image";

export default function Signin({ providers }) {
  const [Show, setShow] = useState(false);
  return (
    <>
      <section className="h-screen">
        <div className="h-screen md:flex">
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <div className="relative overflow-hidden md:flex w-1/2 bg-gradient-to-tr from-green-200 to-green-700 i justify-around items-center hidden">
            <video
              autoPlay
              loop
              muted
              className="absolute z-10 w-auto min-w-full min-h-full max-w-none"
            >
              <source
                src="https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-heights-in-a-sunset-26070-large.mp4"
                type="video/mp4"
              />
            </video>
          </div>
          <div className="flex flex-col md:w-1/2 justify-center py-10 items-center bg-white">
            <Image src={signinpng} width={400} height={400} alt="phoneimage" className="rotate-3" />
            {Object.values(providers).map((provider) => (
              <div className="" key={provider.id}>
                <p>Person inside Kiit University Can Login</p>
                <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5"></div>

                <button
                  className="px-7 py-3  text-black font-medium  text-sm leading-snug uppercase rounded-xl shadow-lg hover:shadow-xl focus:shadow-xl focus:outline-none focus:ring-0 active:shadow-xl transition duration-150 ease-in-out w-full flex justify-center items-center mb-3"
                  style={{ backgroundColor: "white" }}
                  onClick={() => signIn(provider.id, { callbackUrl: "/" })}
                >
                  <FcGoogle size={30} className="mx-2" />
                  Login with {provider.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
}
