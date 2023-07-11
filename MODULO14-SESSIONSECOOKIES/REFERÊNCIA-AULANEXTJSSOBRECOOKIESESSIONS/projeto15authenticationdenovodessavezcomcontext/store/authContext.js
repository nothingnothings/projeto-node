import { useState, createContext, useEffect } from 'react';

const AuthContext = createContext({
  auth: null,
});

export const AuthContextProvider = (props) => {
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);

  const context = {
    auth: isUserAuthenticated,
  };

  return (
    <AuthContext.Provider value={context}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
