import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import './Search.css';

const Search = ({ onSearch, isHeader }) => {
  const [summonerName, setSummonerName] = useState('');
  const [tagLine, setTagLine] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    if (summonerName && tagLine) {
      onSearch(summonerName, tagLine);
      navigate('/match-history');
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
        {/* Replace button with search icon */}
        <button type="submit" className="search-icon">
          <FontAwesomeIcon icon={faSearch} />
        </button>
      </form>
    </div>
  );
};

export default Search;
