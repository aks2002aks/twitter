import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import { BiArrowFromBottom } from "react-icons/bi";
import { RecoilRoot } from "recoil";
import LoadingBar from "react-top-loading-bar";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    router.events.on("routeChangeStart", () => {
      setProgress(40);
    });
    router.events.on("routeChangeComplete", () => {
      setProgress(100);
    });
    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
    decodeUser();
  }, [router.query]);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const classNames = (...classes) => {
    return classes.filter(Boolean).join(" ");
  };
  return (
    <SessionProvider>
      <RecoilRoot>
        <LoadingBar
          color="#22C55D"
          height={3}
          progress={progress}
          waitingTime={1000}
          onLoaderFinished={() => setProgress(0)}
        />
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
          theme="light"
        />
        {/* Same as */}
        <ToastContainer />
        <Component {...pageProps} />
        <div className="float lg:block fixed bottom-12 md:bottom-2 right-2">
          <button
            type="button"
            onClick={scrollToTop}
            className={classNames(
              isVisible ? "opacity-100" : "opacity-0",
              "bg-pink-600 hover:bg-pink-700 focus:ring-pink-500 inline-flex items-center rounded-full p-3 text-white shadow-sm transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2"
            )}
          >
            <BiArrowFromBottom className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
      </RecoilRoot>
    </SessionProvider>
  );
}
