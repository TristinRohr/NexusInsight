import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Profile.css"; // Import the CSS file
import FavoriteList from "./FavoriteList"; // Import the FavoriteList component
import MatchHistoryWrapper from "./MatchHistoryWrapper"; // Import MatchHistoryWrapper component

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    gameName: "",
    tagLine: "",
  });
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.post(
          "/graphql",
          {
            query: `
              query {
                getUser {
                  username
                  email
                  gameName
                  tagLine
                  favoritePlayers
                }
              }
            `,
          },
          { withCredentials: true } // Make sure cookies (JWT) are sent with the request
        );

        const user = response.data.data.getUser;
        setUserData(user);
        setFormData({
          username: user.username || "",
          email: user.email || "",
          gameName: user.gameName || "",
          tagLine: user.tagLine || "",
        });
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError("Failed to fetch profile data. Please try again.");
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setSuccessMessage("");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage("");

    try {
      const response = await axios.post(
        "/graphql",
        {
          query: `
            mutation updateUser($input: UpdateUserInput!) {
              updateUser(input: $input) {
                username
                email
                gameName
                tagLine
              }
            }
          `,
          variables: {
            input: {
              username: formData.username,
              email: formData.email,
              gameName: formData.gameName,
              tagLine: formData.tagLine,
            },
          },
        },
        { withCredentials: true } // Ensure cookies are sent
      );

      const updatedUser = response.data.data.updateUser;
      setUserData(updatedUser);
      setSuccessMessage("Profile updated successfully!");
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
    }
  };

  if (error) {
    return <div className="profile-error">{error}</div>;
  }

  if (!userData) {
    return <div className="profile-loading">Loading...</div>;
  }

  return (
    <div>
      <h2 className="profile-title">Profile</h2>
      <div className="profile-content">
      <div className="profile-container">
        {isEditing ? (
          <form className="profile-form" onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="gameName">Game Name:</label>
              <input
                type="text"
                id="gameName"
                name="gameName"
                value={formData.gameName}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="tagLine">Tag Line:</label>
              <input
                type="text"
                id="tagLine"
                name="tagLine"
                value={formData.tagLine}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" className="profile-save-btn">
              Save Changes
            </button>
            <button
              type="button"
              className="profile-cancel-btn"
              onClick={handleEditToggle}
            >
              Cancel
            </button>
          </form>
        ) : (
          <div className="profile-info-container">
            <button className="profile-edit-btn" onClick={handleEditToggle}>
              Edit Profile
            </button>
            <p className="profile-info">
              <strong>Username:</strong> {userData.username}
            </p>
            <p className="profile-info">
              <strong>Email:</strong> {userData.email}
            </p>
            <p className="profile-info">
              <strong>Game Name:</strong> {userData.gameName}
            </p>
            <p className="profile-info">
              <strong>Tag Line:</strong> {userData.tagLine}
            </p>
          </div>
        )}
          
          {/* Display FavoriteList using the user's favoritePlayers */}
          <FavoriteList />
        </div>

        {/* Display MatchHistoryWrapper using the user's gameName and tagLine */}
        {userData.gameName && userData.tagLine && (
          <MatchHistoryWrapper
            gameName={userData.gameName}
            tagLine={userData.tagLine}
          />
        )}

        {successMessage && (
          <div className="profile-success">{successMessage}</div>
        )}
      </div>
    </div>
  );
};

export default Profile;
