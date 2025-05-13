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
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Users by Region</h2>
      <table className="table-auto w-full border-collapse text-left">
        <thead className="bg-gray-700 text-white">
          <tr>
            <th className="p-3">Name</th>
            <th className="p-3">Email</th>
            <th className="p-3">Region</th>
            <th className="p-3">CRDB Region</th>
            <th className="p-3">Products</th>
          </tr>
        </thead>
        <tbody className="text-gray-200">
          {users.map((u) => (
            <tr key={u.id} className="border-b border-gray-800 hover:bg-gray-800">
              <td className="p-3">{u.name}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3">{u.region}</td>
              <td className="p-3">{u.crdb_region}</td>
              <td className="p-3">
                {u.products && u.products.length > 0
                  ? u.products.join(", ")
                  : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UsersTable;