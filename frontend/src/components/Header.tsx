'use client';

import Link from 'next/link';
import env from '../../env';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetch('http://localhost/api/user/profile', {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => setIsAuthenticated(response.status === 401 ? false : true))
      .then((data) => console.log(data))
      .catch((error) => console.error('Error:', error));
  }, []);

  const logout = () => {
    fetch('http://localhost/api/auth/logout').then((response) => {
      if (response.status === 200) setIsAuthenticated(false);
    });
  };

  return (
    <header className="bg-purple-950 text-white p-4">
      <nav className="flex justify-between items-center">
        <div>
          <Link className="text-lg font-bold p-4" href="/">
            Home
          </Link>
          <Link className="text-lg font-bold p-4" href="/about">
            About
          </Link>
        </div>
        {isAuthenticated ? (
          <button
            className="bg-red-900 hover:bg-red-950 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out transform hover:scale-105"
            onClick={logout}
          >
            Logout
          </button>
        ) : (
          <button
            className="bg-blue-900 hover:bg-blue-950 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out transform hover:scale-105"
            onClick={() => (window.location.href = `${env.apiUrl}/auth/steam`)}
          >
            Login With Steam
          </button>
        )}
      </nav>
    </header>
  );
}
