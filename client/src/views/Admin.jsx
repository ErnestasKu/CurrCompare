import { useContext, useEffect, useRef, useState, useMemo } from "react";
import {
  FaTrash,
  FaUserShield,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import LoadingScreen from "./general/LoadingScreen";
import adminService from "../services/adminService";
import { AuthContext } from "../AuthContext";
import MessageConfirmation from "./general/MessageConfirmation";

export default function Admin() {
  const { auth } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "username",
    direction: "asc",
  });

  const titleRef = useRef();
  const actionRef = useRef();

  useEffect(() => {
    fetchUsers();
  }, [auth]);

  const fetchUsers = async () => {
    if (!auth?.token) return;
    try {
      const data = await adminService.getUsers(auth.token);
      setUsers(data.filter((u) => u.id !== auth.id));
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  // if same label selected, sort in reverse
  // otherwise sort by new label in asc order
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // memoize list, so it's not remade each time
  const sortedUsers = useMemo(() => {
    let sortableUsers = [...users];
    if (sortConfig.key !== null) {
      sortableUsers.sort((a, b) => {
        const aValue = a[sortConfig.key] || "";
        const bValue = b[sortConfig.key] || "";

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortableUsers;
  }, [users, sortConfig]);

  const getSortIcon = (name) => {
    if (sortConfig.key !== name) return <FaSort className="opacity-30" />;
    return sortConfig.direction === "asc" ? (
      <FaSortUp className="text-primary" />
    ) : (
      <FaSortDown className="text-primary" />
    );
  };

  // adds/removes admin priveledges
  // if I had more than 2 roles, this method would need to be scrapped
  const handleRoleChange = (userId, currentRole) => {
    const newRole = currentRole === "Admin" ? "User" : "Admin";
    actionRef.current = async () => {
      try {
        await adminService.updateRole(userId, newRole, auth.token);
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)),
        );
        setConfirmOpen(false);
      } catch (err) {
        console.error(err);
      }
    };
    titleRef.current = `Change role to ${newRole}?`;
    setConfirmOpen(true);
  };

  const handleDelete = (userId) => {
    actionRef.current = async () => {
      try {
        await adminService.deleteUser(userId, auth.token);
        setUsers(users.filter((u) => u.id !== userId));
        setConfirmOpen(false);
      } catch (err) {
        console.error(err);
      }
    };
    titleRef.current = "Permanently delete this user?";
    setConfirmOpen(true);
  };

  return (
    <div className="page-default space-y-6">
      <div className="page-title">User Management</div>

      <div className="border border-bg-border rounded-xl shadow-xl overflow-hidden">
        <table className="w-full border-separate">
          <thead>
            <tr className="bg-bg-dark/50 divide-x">
              {["username", "email", "lastLogin", "role"].map((key) => (
                <th
                  key={key}
                  onClick={() => requestSort(key)}
                  className="group p-4 border-b border-bg-border text-xs uppercase tracking-widest text-txt-dark hover:text-primary"
                >
                  <div className="flex items-center gap-2">
                    {key === "lastLogin" ? "Last login" : key}
                    {getSortIcon(key)}
                  </div>
                </th>
              ))}
              <th className="p-4 border-b border-bg-border text-xs uppercase tracking-widest text-txt-dark">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedUsers.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-bg-dark2 transition-colors group"
              >
                <td className="p-4 text-primary font-mono">{user.username}</td>
                <td className="p-4 font-mono">{user.email}</td>
                <td className="p-4  font-mono">
                  {user.lastLogin
                    ? new Date(user.lastLogin).toLocaleDateString()
                    : "-"}
                </td>
                <td className="p-4 text-center">
                  <span
                    className={`px-2 py-1 rounded-xl text-sm font-mono uppercase tracking-wider font-semibold ${
                      user.role === "Admin"
                        ? "bg-good/10 text-good border border-good/20"
                        : "bg-bg-lighter text-txt-dark border border-bg-lighter3"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td>
                  <div className="flex justify-center gap-2 text-xl">
                    <button
                      onClick={() => handleRoleChange(user.id, user.role)}
                      className="p-2 hover:bg-primary/20 text-primary rounded-md"
                      title="Toggle role"
                    >
                      <FaUserShield />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-2 hover:bg-bad/20 text-bad rounded-md"
                      title="Delete user"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {confirmOpen && (
        <MessageConfirmation
          title={titleRef.current}
          onClose={() => setConfirmOpen(false)}
          onConfirm={actionRef.current}
        />
      )}
    </div>
  );
}
