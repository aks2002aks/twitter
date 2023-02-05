import { useRouter } from "next/router";

export default function SidebarMenuitem({ text, Icon, active, tab }) {
  const router = useRouter();
  return (
    <div
      className={`hoverEffect flex items-center text-green-800 justify-center xl:justify-start text-lg space-x-3 ${
        active && "bg-green-100"
      } `}
    >
      <Icon className="h-7 w-7" />
      <span
        className={`${active && "font-bold"} hidden xl:inline`}
        onClick={() => {
          if (tab == "Home") {
            router.push("/");
          }
        }}
      >
        {text}
      </span>
    </div>
  );
}
