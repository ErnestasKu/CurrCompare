import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../AuthContext";
import { Navigate, useParams } from "react-router-dom";
import {
  MdOutlineAccountCircle,
  MdOutlineMail,
  MdBadge,
  MdFingerprint,
  MdPersonOutline,
} from "react-icons/md";
import LoadingScreen from "./general/LoadingScreen";
import userService from "../services/userService";

export default function Profile() {
  const { auth } = useContext(AuthContext);
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState(false);

  useEffect(() => {
    if (!id) return;

    const retrieveData = async () => {
      // userService.getUserInfo()
      //   console.log("gggggg:", id);

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

  if (!auth) return <LoadingScreen />;

  return (
    <div className="page-default space-y-8">
      <div className="page-title">Profile Page</div>

      <div className="flex w-[80%] mx-auto gap-8">
        <div className="bubble flex flex-col p-8 aspect-square w-64 h-64 items-center justify-between bg-linear-to-b from-bg-dark to-bg-dark2">
          <div className="w-32 aspect-square rounded-full bg-linear-to-tr from-primary to-blue-400 p-1 shadow-lg shadow-primary/20">
            <div className="w-full h-full bg-bg-dark rounded-full flex items-center justify-center text-primary text-6xl font-bold">
              {auth.username?.charAt(0).toUpperCase()}
            </div>
          </div>

          <span className="p-2 text-center w-full h-full font-bold text-2xl truncate mt-4">
            {auth.username}
          </span>
        </div>

        <div className="w-full">
          <div className="bubble w-full mx-auto">
            <div className="p-6 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-start">
                <div className="md:col-span-1 flex items-center gap-2 text-txt-dark py-1">
                  <MdPersonOutline className="text-xl" />
                  <label className="text-sm font-medium">Username</label>
                </div>
                <div className="md:col-span-3">
                  <p className="text-xl font-medium px-4 py-2 bg-white/5 rounded-lg border border-bg-border inline-block min-w-[200px]">
                    {auth.username}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-2 items-start">
                <div className="md:col-span-1 flex items-center gap-2 text-txt-dark py-1">
                  <MdFingerprint className="text-xl" />
                  <label className="text-sm font-medium">Internal ID</label>
                </div>
                <div className="md:col-span-3">
                  <code className="text-xs font-mono bg-bg-dark2 text-primary p-4 rounded-xl border border-primary/20 block overflow-x-auto">
                    {auth.id}
                  </code>
                  <p className="text-[10px] text-gray-500 mt-2 italic">
                    This unique identifier is used for system-level
                    authentication.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
