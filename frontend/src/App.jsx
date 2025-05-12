import { useState } from 'react'
import './App.css'
import UsersTable from "./components/UsersTable";


function App() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <h1 className="text-2xl font-bold text-center py-6">CRDB Ecommerce Dashboard</h1>
      <UsersTable />
    </div>
  );
}

export default App;
