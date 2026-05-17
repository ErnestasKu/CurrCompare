import { authFetch } from "../utilities/authFetch";

// Admin only functions
class AdminService {
  //  fetches a list of every user
  async getUsers(auth, setAuth) {
    const url = `${import.meta.env.VITE_URL}/api/admin/users`;

    const response = await authFetch(
      url,
      {
        method: "GET",
      },
      auth,
      setAuth,
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  }

  // sets role for selected user
  async updateRole(id, newRole, auth, setAuth) {
    const url = `${import.meta.env.VITE_URL}/api/admin/users/${id}/role`;

    return await authFetch(
      url,
      {
        method: "PUT",
        body: JSON.stringify(newRole),
      },
      auth,
      setAuth,
    );
  }

  // deletes selected user and their associated data
  async deleteUser(id, auth, setAuth) {
    const url = `${import.meta.env.VITE_URL}/api/admin/users/${id}`;

    return await authFetch(
      url,
      {
        method: "DELETE",
      },
      auth,
      setAuth,
    );
  }
}

const adminService = new AdminService();
export default adminService;
