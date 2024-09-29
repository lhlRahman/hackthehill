'use client';

import { createContext, useContext, useState } from "react";
const Context = createContext();

export function AppStates({ children }) {

  const [allMissions, setAllMissions] = useState([]);
  const [allFriends, setAllFriends] = useState([]);
  const [currentLocation, setCurrentLocation] = useState([]);
  const [id, setId] = useState(0);
  const [username, setUsername] = useState('');
  const [balance, setBalance] = useState(0);


  const contextValue = {
    allMissions,
    setAllMissions,
    allFriends,
    setAllFriends,
    currentLocation,
    setCurrentLocation,
    id,
    setId,
    username,
    setUsername,
    balance,
    setBalance,
  };

  return (
    <Context.Provider value={contextValue}>
      {children}
    </Context.Provider>
  );
}

export function useAppStatesContext() {
  return useContext(Context);
}