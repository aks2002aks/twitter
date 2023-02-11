import { useRecoilState } from "recoil";
import { modalState, postIdState, shareModalState } from "../atom/modalAtom";
import { useRouter } from "next/router";
import Modal from "react-modal";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { XIcon } from "@heroicons/react/outline";

export default function ShareModal() {
  const [openShare, setOpenShare] = useRecoilState(shareModalState);
  const [postId] = useRecoilState(postIdState);
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div>
      {openShare && (
        <Modal
          isOpen={openShare}
          onRequestClose={() => setOpenShare(false)}
          className="max-w-sm w-[70%]  absolute top-24 left-[50%] translate-x-[-50%] bg-white border-2 border-gray-200 rounded-xl shadow-md"
        >
          <div className="p-1">
            <div className="border-b border-gray-200 py-2 px-1.5">
              <div
                onClick={() => setOpenShare(false)}
                className="hoverEffect w-10 h-10 flex items-center justify-center"
              >
                <XIcon className="h-[23px] text-gray-700 p-0" />
              </div>
            </div>

            <div className="flex justify-between pl-5 pr-5">
              <EmailShareButton
                subject="Shared a Kweet Post"
                body={`Link to the Post is :`}
                url={`https://kweet.vercel.app/posts/${postId}`}
              >
                <EmailIcon
                  className="mt-2 mb-2"
                  size={32}
                  round={true}
                ></EmailIcon>
              </EmailShareButton>
              <WhatsappShareButton
                title="Shared a Kweet Post"
                url={`https://kweet.vercel.app/posts/${postId}`}
              >
                <WhatsappIcon
                  className="mt-2 mb-2"
                  size={32}
                  round={true}
                ></WhatsappIcon>
              </WhatsappShareButton>

              <FacebookShareButton
                quote="Shared a Kweet Post"
                url={`https://kweet.vercel.app/posts/${postId}`}
              >
                <FacebookIcon
                  className="mt-2 mb-2"
                  size={32}
                  round={true}
                ></FacebookIcon>
              </FacebookShareButton>

              <TwitterShareButton
                title="Shared a Kweet Post"
                url={`https://kweet.vercel.app/posts/${postId}`}
              >
                <TwitterIcon
                  className="mt-2 mb-2"
                  size={32}
                  round={true}
                ></TwitterIcon>
              </TwitterShareButton>

              <RedditShareButton
                title="Shared a Kweet Post"
                url={`https://kweet.vercel.app/posts/${postId}`}
              >
                <RedditIcon
                  className="mt-2 mb-2"
                  size={32}
                  round={true}
                ></RedditIcon>
              </RedditShareButton>

              <TelegramShareButton
                title="Shared a Kweet Post"
                url={`https://kweet.vercel.app/posts/${postId}`}
              >
                <TelegramIcon
                  className="mt-2 mb-2"
                  size={32}
                  round={true}
                ></TelegramIcon>
              </TelegramShareButton>
            </div>

            <div className="border-t border-gray-200 py-2 px-1.5 ">
              <div className="flex items-center">
                <input
                  type="text"
                  value={`https://kweet.vercel.app/posts/${postId}`}
                  readonly
                  className="rounded-xl w-[170px] sm:w-[250px] mr-2"
                ></input>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full m-auto hover:brightness-75 text-xs"
                  onClick={() => {
                    navigator.clipboard
                      .writeText(`https://kweet.vercel.app/posts/${postId}`)
                      .then(
                        () => {
                          toast.success("Text copied to clipboard", {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                          });
                          setOpenShare(false)
                        },
                        (err) => {
                          toast.success("Could not copy text", {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                          });
                        }
                      );
                  }}
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
