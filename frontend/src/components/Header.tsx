'use client';

import Link from 'next/link';
import env from '../../env';
import { useState, useEffect, Fragment } from 'react';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch('https://ggcsgo.rahimi0151.ir/api/user/profile', {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => setIsAuthenticated(response.status === 401 ? false : true))
      .then((data) => console.log(data))
      .catch((error) => console.error('Error:', error));
  }, []);

  const logout = () => {
    fetch('https://ggcsgo.rahimi0151.ir/api/auth/logout').then((response) => {
      if (response.status === 200) setIsAuthenticated(false);
    });
  };

  const sell = () => {
    router.push('/sell');
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
          <Fragment>
            <div className="flex">
              <button
                className="bg-purple-900 hover:bg-purple-950 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out transform hover:scale-105 ml-4"
                onClick={sell}
              >
                Sell Youur Skins
              </button>

              <button
                className="bg-red-900 hover:bg-red-950 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out transform hover:scale-105 ml-4"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </Fragment>
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
