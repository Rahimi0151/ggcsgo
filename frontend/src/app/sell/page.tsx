'use client';

import Card from '@/components/sell/card';
import Footer from '@/components/sell/footer';
import React, { useEffect, useState } from 'react';

interface Item {
  assetid: string;
  icon_url: string;
  market_hash_name: string;
  type: string;
}

const InventoryPage: React.FC = () => {
  const [items, setItems] = useState([]);
  const [addedItems, setAddedItems] = useState<Item[]>([]);

  useEffect(() => {
    fetch('http://localhost/api/inventory/', { credentials: 'include' })
      .then((response) => response.json())
      .then((data) => setItems(data));
  }, []);

  const handleButtonClick = (item: Item) => {
    if (addedItems.includes(item)) {
      setAddedItems(addedItems.filter((addedItem) => addedItem !== item));
    } else {
      setAddedItems([...addedItems, item]);
    }
    console.log(addedItems);
  };

  return (
    <div className="flex flex-wrap justify-center">
      {items.map((item: Item) => (
        <Card
          key={item.assetid}
          iconUrl={item.icon_url}
          market_hash_name={item.market_hash_name}
          type={item.type}
          isAdded={addedItems.includes(item)}
          onButtonClick={() => handleButtonClick(item)}
        />
      ))}
      <Footer addedItems={addedItems} />
    </div>
  );
};

export default InventoryPage;
