import { useState } from "react";
import "./App.css";
import Dashboard from "./components/Dashboard";
import UsersTable from "./components/UsersTable";

function App() {
  return (
    <div className="min-h-screen bg-white text-gray-800">
      <h1 className="text-2xl font-bold text-center py-6">
        Transaction Tracker
      </h1>
      <UsersTable />
      <Dashboard />
    </div>
  );
}

export default App;
