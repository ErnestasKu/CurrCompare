import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import { Navigate, useParams } from "react-router-dom";
import {
  MdOutlineAccountCircle,
  MdOutlineMail,
  MdBadge,
  MdFingerprint,
  MdPersonOutline,
  MdShield,
  MdCalendarToday,
} from "react-icons/md";
import LoadingScreen from "./general/LoadingScreen";
import userService from "../services/userService";
import { FaFingerprint } from "react-icons/fa";
import { RiAccountCircleFill } from "react-icons/ri";
import { IoMdMail } from "react-icons/io";
import { CiLogin } from "react-icons/ci";
import { IoLogIn, IoLogInSharp } from "react-icons/io5";

export default function Profile() {
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    if (!id) return;

    const retrieveData = async () => {
      try {
        const data = await userService.getUserInfo(id);
        setUserInfo(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    retrieveData();
  }, [id]);

  if (!userInfo) return <LoadingScreen />;

  return (
    <div className="page-default space-y-8">
      <div className="page-title">Profile Page</div>

      <div className="flex w-[80%] mx-auto gap-8">
        <div className="bubble flex flex-col p-8 aspect-square w-64 h-64 items-center justify-between bg-linear-to-b from-bg-dark to-bg-dark2">
          <div className="w-32 aspect-square rounded-full bg-linear-to-tr from-primary to-blue-400 p-1 shadow-lg shadow-primary/20">
            <div className="w-full h-full bg-bg-dark rounded-full flex items-center justify-center text-primary text-6xl font-bold">
              {userInfo.username?.charAt(0).toUpperCase()}
            </div>
          </div>

          <span className="p-2 text-center w-full h-full font-bold text-2xl truncate mt-4">
            {userInfo.username}
          </span>
        </div>

        <div className="bubble w-full h-fit p-8 grid grid-cols-2 gap-y-3 gap-x-8 items-center">
          <h3 className="text-xl font-semibold mb-3 flex items-center gap-2 col-span-2">
            <span className="w-1 h-6 bg-primary rounded-full"></span>
            Account Information
          </h3>

          <div className="space-y-1 col-span-2">
            <label className="text-txt-dark text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <FaFingerprint />
              Id
            </label>
            <div className="px-4 py-3 bg-bg-dark2 rounded-xl border border-bg-border font-mono text-primary">
              {userInfo.id}
            </div>
          </div>

          <InfoField
            label="Username"
            value={userInfo.username}
            icon={<RiAccountCircleFill />}
          />
          <InfoField label="Email" value={userInfo.email} icon={<IoMdMail />} />
          <InfoField label="Role" value={userInfo.role} icon={<MdShield />} />
          <InfoField
            label="Created at"
            value={userInfo.createdAt.split("T")[0]}
            icon={<MdCalendarToday />}
          />
          <InfoField
            label="Last login"
            value={userInfo.lastLogin ? userInfo.lastLogin.split("T")[0] : "-"}
            icon={<IoLogIn />}
          />
        </div>
      </div>
    </div>
  );
}

function InfoField({ label, value, icon }) {
  return (
    <div className="space-y-1">
      <label className="text-txt-dark text-sm font-bold uppercase tracking-wider flex items-center gap-2">
        {icon} {label}
      </label>
      <div className="px-4 py-3 bg-bg-dark2 rounded-xl border border-bg-border">
        {value}
      </div>
    </div>
  );
}
