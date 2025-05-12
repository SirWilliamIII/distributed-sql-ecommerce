import { useState } from 'react'
import './App.css'
import UsersTable from "./components/UsersTable";
import Dashboard from "./components/Dashboard";



function App() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <h1 className="text-2xl font-bold text-center py-6">CRDB Ecommerce Dashboard</h1>
        <UsersTable />
        <Dashboard />
    </div>
  );
}

export default App;
