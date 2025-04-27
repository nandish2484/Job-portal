import React, { useEffect, useContext } from 'react';
import { useUser } from '@clerk/clerk-react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

const AuthProvider = ({ children }) => {
  const { isLoaded, user } = useUser();
  const { backendUrl } = useContext(AppContext);

  useEffect(() => {
    const syncUser = async () => {
      if (user) {
        try {
          // Create/sync user in your database
          const { data } = await axios.post(`${backendUrl}/api/users/sync`, {
            _id: user.id, // Use Clerk's user ID
            name: `${user.firstName} ${user.lastName}`,
            email: user.primaryEmailAddress?.emailAddress,
            image: user.imageUrl
          });
          
          if (!data.success) {
            console.error('Error syncing user:', data.message);
          }
        } catch (error) {
          console.error('Error syncing user:', error.message);
        }
      }
    };

    if (isLoaded && user) {
      syncUser();
    }
  }, [isLoaded, user, backendUrl]);

  if (!isLoaded) {
    return null; // Don't render anything until auth is loaded
  }

  return children;
};

export default AuthProvider;