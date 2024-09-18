import React, { useState, useEffect } from "react"; 
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate for redirection
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
  const [loading, setLoading] = useState(true); // To handle loading state

  const navigate = useNavigate(); // Hook for programmatic navigation

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true); // Start loading when fetching data
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

        if (user) {
          setUserData(user); // Ensure user data exists before updating state
          setFormData({
            username: user.username || "",
            email: user.email || "",
            gameName: user.gameName || "",
            tagLine: user.tagLine || "",
          });
          setError(null); // Clear any previous errors
        } else {
          setError("User data is not available.");
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);

        // Check if the error is due to session expiration (401 Unauthorized)
        if (error.response && error.response.status === 401) {
          setError("Session expired. Redirecting to login...");
          
          // Redirect to login page after a brief timeout (optional delay)
          setTimeout(() => {
            navigate("/login"); // Redirect to the login page
          }, 2000); // Delay redirect by 2 seconds for UX
        } else {
          setError("Failed to fetch profile data. Please try again.");
        }
      } finally {
        setLoading(false); // Stop loading regardless of success or failure
      }
    };

    fetchProfile();
  }, [navigate]); // Add navigate to dependency array

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

  // Display error message if there's an error
  if (error) {
    return <div className="profile-error">{error}</div>;
  }

  // Show loading state while data is being fetched
  if (loading) {
    return <div className="profile-loading">Loading...</div>;
  }

  // If there's no error and the data is still null, display appropriate message
  if (!userData) {
    return <div className="profile-no-data">No profile data available.</div>;
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
  </div>
  );
};

export default Profile;
