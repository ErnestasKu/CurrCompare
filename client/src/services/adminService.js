// Admin only functions
class AdminService {
  //  fetches a list of every user
  async getUsers(token) {
    const url = `${import.meta.env.VITE_URL}/api/admin/users`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json();
  }

  // sets role for selected user
  async updateRole(id, newRole, token) {
    const url = `${import.meta.env.VITE_URL}/api/admin/users/${id}/role`;

    return await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(newRole),
    });
  }

  // deletes selected user and their associated data
  async deleteUser(id, token) {
    const url = `${import.meta.env.VITE_URL}/api/admin/users/${id}`;

    return await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });
  }
}

const adminService = new AdminService();
export default adminService;
