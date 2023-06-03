import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

// Stored route as constant to increase readbility and reusability
const API_URL = 'https://randomuser.me/api';

interface User {
  name: {
    title: string;
    first: string;
    last: string;
  };
  email: string;
}

const UserDisplay: React.FC = () => {
  // State variables
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch user data from API
  const fetchUser = async () => {
    try {
      const { data } = await axios.get(API_URL);
      const userData = data.results[0];
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setError(null);
    } catch (error) {
      console.error('Error fetching user:', error);
      setError('Error fetching user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load user data from localStorage or fetch from API if not available
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsLoading(false);
    } else {
      fetchUser();
    }
  }, []);

  // Refresh user data
  const refreshUser = () => {
    localStorage.removeItem('user');
    setIsLoading(true);
    fetchUser();
  };

  // Render loading state with animation
  if (isLoading) {
    return (
      <div className="user-display-loading">
        <div className="user-display-loading__animation"></div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Destructure user data
  const { name, email } = user ?? {};
  const { title, first, last } = name ?? {};

  // Render user details
  return (
    <div className="user-display">
      <h2 className="user-display__name">Name: {title} {first} {last}</h2>
      <h2 className="user-display__email">Email: {email}</h2>
      <button className="user-display__button" onClick={refreshUser} disabled={isLoading}>
        Refresh
      </button>
    </div>
  );
};

export default UserDisplay;
