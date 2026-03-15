import { CgProfile } from "react-icons/cg";

export default function Header({}) {

  return (
    <div
      className={
        "h-16 p-4 flex items-center border border-bg-border justify-between text-xl"
      }
    >
      <div className="font-semibold text-3xl">CurrCompare</div>
      <div className="flex  items-center gap-2 rounded-2xl p-2 hover:bg-bg-lighter2">
        <CgProfile className="text-3xl" />
        <span> Sign in</span>
      </div>
    </div>
  );
}
