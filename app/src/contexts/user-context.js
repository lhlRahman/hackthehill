'use client';

import { useState, useEffect } from "react";

const initialState = {
  allMissions: [],
  allFriends: [],
  currentLocation: [],
  id: 0,
  username: '',
  balance: 0,
  pet: '',
};

function getStateFromLocalStorage() {
  if (typeof window === 'undefined') {
    return initialState;
  }
  const storedState = localStorage.getItem('appState');
  return storedState ? JSON.parse(storedState) : initialState;
}

function setStateToLocalStorage(state) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('appState', JSON.stringify(state));
  }
}

export function useAppStates() {
  const [state, setState] = useState(getStateFromLocalStorage);

  useEffect(() => {
    setStateToLocalStorage(state);
    console.log("AppStates updated:", state);
  }, [state]);

  const setAllMissions = (missions) => setState(prev => ({ ...prev, allMissions: missions }));
  const setAllFriends = (friends) => setState(prev => ({ ...prev, allFriends: friends }));
  const setCurrentLocation = (location) => setState(prev => ({ ...prev, currentLocation: location }));
  const setId = (id) => setState(prev => ({ ...prev, id }));
  const setUsername = (username) => setState(prev => ({ ...prev, username }));
  const setBalance = (balance) => setState(prev => ({ ...prev, balance }));
  const setPet = (pet) => setState(prev => ({ ...prev, pet }));

  return {
    ...state,
    setPet,
    setAllMissions,
    setAllFriends,
    setCurrentLocation,
    setId,
    setUsername,
    setBalance,
  };
}

export function AppStates({ children }) {
  return <>{children}</>;
}