'use client';

import ItemCard from '@/components/itemCard';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface Item {
  icon_url: string;
  market_hash_name: string;
  assetid: string;
}

export default function Sell() {
  const [items, setItems] = useState<Item[]>([]);
  const [cartItems, setCartItems] = useState<string[]>([]);

  const router = useRouter();

  useEffect(() => {
    fetch('https://ggcsgo.rahimi0151.ir/api/inventory', {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        setItems(data);
        console.log(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  const handleAddToCart = (item: Item) => {
    setCartItems((prevCartItems) => [...prevCartItems, item.assetid]);
  };

  const handleRemoveFromCart = (item: Item) => {
    setCartItems((prevCartItems) => prevCartItems.filter((id) => id !== item.assetid));
  };

  const handleSellItems = () => {
    fetch('https://ggcsgo.rahimi0151.ir/api/inventory/sell', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(cartItems),
    });
    setCartItems([]);
    router.push('/');
  };

  return (
    <div className="flex flex-wrap justify-center">
      {items.map((item) => (
        <div className="w-64 m-4" key={item.assetid}>
          <ItemCard
            icon_url={item.icon_url}
            key={item.assetid}
            market_hash_name={item.market_hash_name}
            inCart={cartItems.includes(item.assetid)}
            onButtonClick={() =>
              cartItems.includes(item.assetid) ? handleRemoveFromCart(item) : handleAddToCart(item)
            }
          />
        </div>
      ))}
      {cartItems.length > 0 && (
        <div className="fixed bottom-0 w-full flex justify-end bg-purple-950 p-4 shadow-upward">
          <button onClick={handleSellItems} className="bg-blue-500 text-white px-4 py-2 rounded">
            Sell Items
          </button>
        </div>
      )}
    </div>
  );
}
