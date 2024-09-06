import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ItemImages = () => {
  const [items, setItems] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('https://ddragon.leagueoflegends.com/cdn/14.14.1/data/en_US/item.json');
        setItems(Object.values(response.data.data));
      } catch (error) {
        setError('Failed to fetch item data');
      }
    };

    fetchItems();
  }, []);

  if (error) return <div>{error}</div>;
  if (items.length === 0) return <div>Loading...</div>;

  return (
    <div>
      <h2>Item Images</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {items.map((item) => (
          <div key={item.id} style={{ margin: '10px' }}>
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/14.14.1/img/item/${item.image.full}`}
              alt={item.name}
              style={{ width: '50px', height: '50px' }}
            />
            <p>{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default itemImages;