// components/Navbar.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface NavbarProps {
  isLoggedIn: boolean;
  username?: string;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn, username }) => {
  const [showLogout, setShowLogout] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove('token');
    router.push('/login');
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white text-xl font-bold">
          DegiTips
        </Link>
        <div>
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setShowLogout(!showLogout)}
                className="text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-full focus:outline-none"
              >
                {username || 'User'}
              </button>
              {showLogout && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <Link href="/login" className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded mr-2">
                Login
              </Link>
              <Link href="/register" className="text-white bg-green-500 hover:bg-green-600 px-4 py-2 rounded">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
