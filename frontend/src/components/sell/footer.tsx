import React from 'react';

interface FooterProps {
  addedItems: any[];
}

const Footer: React.FC<FooterProps> = ({ addedItems }) => {
  const handleClick = async () => {
    const response = await fetch('/api/inventory/sell', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: addedItems.map((item) => item.assetid),
      }),
    });

    if (!response.ok) {
      // handle error
    }
  };

  if (addedItems.length === 0) return null;

  return (
    <footer className="w-full bg-gray-800 text-white text-center p-4 fixed bottom-0 flex justify-end items-center px-8">
      <button
        onClick={handleClick}
        className="bg-purple-900 hover:bg-purple-950 text-white font-bold py-2 px-4 rounded transition duration-200 ease-in-out transform hover:scale-105"
      >
        Sell these {addedItems.length} items
      </button>
    </footer>
  );
};

export default Footer;
