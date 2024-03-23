'use client';

import React from 'react';
import Image from 'next/image';

interface ItemCardProps {
  icon_url: string;
  market_hash_name: string;
  inCart: boolean;
  onButtonClick: () => void;
}

const ItemCard: React.FC<ItemCardProps> = ({
  icon_url,
  market_hash_name,
  onButtonClick: onButtonClick,
  inCart,
}) => {
  return (
    <div
      className={`item-card bg-purple-900 p-4 rounded-md shadow-lg flex flex-col items-center justify-between h-full`}
    >
      <div>
        <Image src={icon_url} alt={market_hash_name} layout="responsive" width={100} height={100} />
        <h2 className="mt-4 text-lg text-center font-bold">{market_hash_name}</h2>
      </div>
      <button
        className={`w-full mt-4 text-white px-4 py-2 rounded ${inCart ? 'bg-red-500' : 'bg-blue-500'}`}
        onClick={onButtonClick}
      >
        {inCart ? `I'm selling this` : `I'm keeping this`}
      </button>
    </div>
  );
};

export default ItemCard;
