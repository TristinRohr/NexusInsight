import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ChampionImages = () => {
  const [champions, setChampions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChampions = async () => {
      try {
        const response = await axios.get('https://ddragon.leagueoflegends.com/cdn/14.14.1/data/en_US/champion.json');
        setChampions(Object.values(response.data.data));
      } catch (error) {
        console.error('Error fetching champion data:', error); // Log error
        setError('Failed to fetch champion data. Please try again later.');
      }
    };

    fetchChampions();
  }, []);

  if (error) return <div>{error}</div>;
  if (champions.length === 0) return <div>Loading...</div>;

  return (
    <div>
      <h2>Champion Images</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {champions.map((champion) => (
          <div key={champion.id} style={{ margin: '10px' }}>
            <img
              src={`https://ddragon.leagueoflegends.com/cdn/14.14.1/img/champion/${champion.image.full}`}
              alt={champion.name}
              style={{ width: '50px', height: '50px' }}
              loading="lazy" // Lazy load images
            />
            <p>{champion.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default championImages;