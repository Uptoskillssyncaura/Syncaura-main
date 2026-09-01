import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

export default function LogoutConfirmationModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handleLogout = () => {
    dispatch(logout()); 
    localStorage.clear(); 
    sessionStorage.clear();
    navigate('/signin');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
      
      {/* Modal Box */}
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-200">
        
        {/* Warning Icon */}
        <div className="w-12 h-12 bg-red-100 dark:bg-red-950/50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Confirm Logout
        </h2>
        <p className="text-gray-500 dark:text-zinc-400 text-sm mb-6">
          Are you sure you want to log out of FlowBit? Your active session will be ended.
        </p>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors duration-200 text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleLogout}
            className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors duration-200 text-sm shadow-sm"
          >
            Yes, Log Out
          </button>
        </div>

      </div>
    </div>
  );
}
