import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './Search.css';

const Search = ({ onSearch, isHeader }) => {
  const { summonerName: paramSummonerName, tagLine: paramTagLine } = useParams(); // Get URL params
  const [summonerName, setSummonerName] = useState(paramSummonerName || ''); // Initialize with URL param
  const [tagLine, setTagLine] = useState(paramTagLine || ''); // Initialize with URL param
  const navigate = useNavigate();

  useEffect(() => {
    // Update input fields when the URL parameters change
    if (paramSummonerName) setSummonerName(paramSummonerName);
    if (paramTagLine) setTagLine(paramTagLine);
  }, [paramSummonerName, paramTagLine]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (summonerName && tagLine) {
      onSearch(summonerName, tagLine);
      navigate(`/match-history/${summonerName}/${tagLine}`);
    }
  };

  const searchClass = isHeader ? "search-container header" : "search-container";

  return (
    <div className={searchClass}>
      <form onSubmit={handleSubmit} className="search-form">
        <div className="form-group">
          <input
            type="text"
            value={summonerName}
            onChange={(e) => setSummonerName(e.target.value)}
            required
            placeholder="Summoner Name"
          />
        </div>
        <div className="hash-symbol">#</div>
        <div className="form-group">
          <input
            type="text"
            value={tagLine}
            onChange={(e) => setTagLine(e.target.value)}
            required
            placeholder="Tag Line"
          />
        </div>
        <button type="submit" className="search-icon">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </form>
    </div>
  );
};

export default Search;