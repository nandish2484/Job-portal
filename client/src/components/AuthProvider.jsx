import React from 'react';
import { useUser } from '@clerk/clerk-react';

const AuthProvider = ({ children }) => {
  const { isLoaded } = useUser();

  if (!isLoaded) {
    return null; // Don't render anything until auth is loaded
  }

  return children;
};

export default AuthProvider; 