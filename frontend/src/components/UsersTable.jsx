import { useEffect, useState } from "react";
import axios from "axios";

function UsersTable() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/users")
      .then(res => setUsers(res.data))
      .catch(err => console.error("Error fetching users:", err));
  }, []);

  return (
    <div className="p-6 overflow-x-auto bg-gray-900 rounded-2xl shadow-xl">
      <h2 className="text-3xl font-bold mb-6 text-white tracking-tight">📊 Users by Region</h2>
      <br />
      <table className="min-w-full table-auto border-collapse text-left">
      <thead className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <tr>
          <th className="p-4 text-sm font-semibold uppercase tracking-wide">Name</th>
          <th className="p-4 text-sm font-semibold uppercase tracking-wide">Email</th>
          <th className="p-4 text-sm font-semibold uppercase tracking-wide">Region</th>
          <th className="p-4 text-sm font-semibold uppercase tracking-wide">CRDB Region</th>
          <th className="p-4 text-sm font-semibold uppercase tracking-wide">Products</th>
        </tr>
      </thead>
      <tbody>
      {users.map((u, index) => (
        <tr
          key={u.id}
          className={`${
            index % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
          } text-gray-100 hover:bg-gray-600 transition-colors duration-200`}
        >
          <td className="p-4 whitespace-nowrap">{u.name}</td>
          <td className="p-4 whitespace-nowrap text-sm text-gray-300">{u.email}</td>
          <td className="p-4 whitespace-nowrap">{u.region}</td>
          <td className="p-4 whitespace-nowrap">{u.crdb_region}</td>
          <td className="p-4">
            {u.products && u.products.length > 0
              ? u.products.join(", ")
              : <span className="text-gray-500">—</span>}
          </td>
        </tr>
      ))}
      </tbody>
    </table>
  </div>

  );
}

export default UsersTable;