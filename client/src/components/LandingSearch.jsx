import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingSearch.css";

const LandingSearch = ({ onSearch }) => {
  const [summonerName, setSummonerName] = useState("");
  const [tagLine, setTagLine] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    console.log("Form Submitted"); // Debugging log to ensure submit is being triggered
    console.log("Summoner Name:", summonerName); // Check the summoner name
    console.log("Tag Line:", tagLine); // Check the tag line

    if (summonerName && tagLine) {
      console.log("onSearch called"); // Debugging log for onSearch
      onSearch(summonerName, tagLine); // Call the search function
      console.log("Navigating to /match-history"); // Check if navigate is being called
      navigate(`/match-history/${summonerName}/${tagLine}`); // Navigate to match history page
    } else {
      console.log("Summoner Name or Tag Line missing"); // Check if fields are missing
    }
  };

  return (
    <div className="landing-search">
      <h1 className="landing-search-title">Welcome to Nexus Insight</h1>
      <p className="landing-search-description">
        Enter your summoner name and tagline to get started
      </p>
      <div className="landing-search-container">
        <form className="landing-search-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              value={summonerName}
              onChange={(e) => setSummonerName(e.target.value)}
              required
              placeholder="Summoner Name"
            />
          </div>
          <div className="landing-hash-symbol">#</div>
          <div className="form-group">
            <input
              type="text"
              value={tagLine}
              onChange={(e) => setTagLine(e.target.value)}
              required
              placeholder="Tag Line"
            />
          </div>
          <button type="submit">Search</button>
        </form>
      </div>
    </div>
  );
};

export default LandingSearch;
