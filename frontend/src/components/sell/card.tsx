import React from 'react';
import Image from 'next/image';

interface CardProps {
  iconUrl: string;
  market_hash_name: string;
  type: string;
  isAdded: boolean;
  onButtonClick: () => void;
}

const Card: React.FC<CardProps> = ({ iconUrl, market_hash_name, type, isAdded, onButtonClick }) => {
  return (
    <div className="w-64 rounded-lg overflow-hidden shadow-lg m-4 bg-gray-900 text-center">
      <Image width={200} height={200} className="w-full" src={iconUrl} alt={market_hash_name} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2 h-12 overflow-hidden">{market_hash_name}</div>
        <p className="text-gray-700 text-base">{type}</p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <button
          onClick={onButtonClick}
          className={`w-full font-bold py-2 px-4 rounded transition duration-200 ease-in-out transform hover:scale-105 ${isAdded ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
        >
          {isAdded ? 'Selling' : 'Not Selling'}
        </button>
      </div>
    </div>
  );
};

export default Card;
