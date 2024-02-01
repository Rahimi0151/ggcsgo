'use client';

import Link from 'next/link';
import env from '../../env';

export default function Header() {
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
        <button
          className="bg-blue-900 hover:bg-blue-950 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out transform hover:scale-105"
          onClick={() => window.open(`${env.apiUrl}/auth/steam`, '_blank')}
        >
          Login With Steam
        </button>
      </nav>
    </header>
  );
}
