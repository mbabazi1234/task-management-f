import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React from "react";

const Header = () => {
  const { currentUser, logout } = useAuth();

  return (
    <header className="bg-indigo-600 shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-white text-2xl font-bold">TaskManager</Link>
        
        <nav>
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <span className="text-white">Hi, {currentUser.name}</span>
              <Link to="/" className="text-white hover:text-indigo-200">Dashboard</Link>
              <Link to="/tasks/new" className="text-white hover:text-indigo-200">New Task</Link>
              <button
               type='button'
                onClick={logout}
                className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-100 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-white hover:text-indigo-200"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-indigo-600 px-4 py-2 rounded-md hover:bg-indigo-100 transition-colors"
              >
                Register
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;