'use client'

import React, { useState, useEffect } from 'react'
import { format } from 'date-fns'
import SpringButton from '../components/Modal'
import EditMission from '../components/editMission'
import { useAppStates } from '../../contexts/user-context'
import PetViewer from "../components/PetViewer"
import StreetViewMap from "../components/streetViewMap"

function Title() {
  return (
    <div className="flex flex-row ml-52">
      <span className='text-black text-4xl font-black'>Paw</span>
      <img
        width="40"
        height="40"
        src="/logo.png"
        alt="Company Logo"
      />
      <span className='text-black text-4xl font-black'>sitivity</span>
    </div>
  )
}

const SortedMissions = ({ missions, onCompleteMission }) => {
  const sortedMissions = Array.isArray(missions) 
    ? [...missions].sort((a, b) => new Date(a.dateDue) - new Date(b.dateDue))
    : [];

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-10">
      <h2 className="text-2xl font-bold mb-4">Upcoming Missions</h2>
      {sortedMissions.length === 0 ? (
        <p className="text-gray-500">No missions scheduled.</p>
      ) : (
        <ul className="space-y-4">
          {sortedMissions.map((mission) => (
            <li key={mission._id} className="border-b pb-4 last:border-b-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg text-black">{mission.title}</h3>
                  <p className="text-sm text-black">{mission.location.name}</p>
                </div>
                <span className="text-sm font-medium text-blue-600">
                  {format(new Date(mission.dateDue), 'MMM d, yyyy HH:mm')}
                </span>
              </div>
              {mission.detail && (
                <p className="text-sm text-gray-700 mt-2">{mission.detail}</p>
              )}
              <div className="flex items-center mt-2 text-xs text-gray-500">
                <span className={`mr-2 px-2 py-1 rounded ${mission.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {mission.completed ? 'Completed' : 'Pending'}
                </span>
                {!mission.completed && (
                  <button
                    onClick={() => onCompleteMission(mission._id)}
                    className="ml-2 bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                  >
                    Complete Mission
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const getAllMissions = async (id) => {
  try {
    const response = await fetch("http://localhost:3001/mission/getbyid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ id }),
    })

    if (!response.ok) {
      throw new Error(response.statusText)
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error("There was a problem fetching the missions:", error)
    throw error
  }
}

export default function Home() {
  const { username, balance, allMissions, setBalance, id, pet } = useAppStates()
  const [missions, setMissions] = useState([])
  const [visible, setVisible] = useState(true)
  const [mission, setMission] = useState({
    active: false,
    title: "Add a new Mission!",
    dateDue: new Date(),
    location: "a place",
    coords: [45.4224016, -75.6819462]
  })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    console.log("Context values in Home:", { username, balance, allMissions })
  }, [username, balance, allMissions])

  const fetchMissions = async () => {
    try {
      const data = await getAllMissions(id)
      setMissions(data.missions || [])
    } catch (error) {
      console.error("Error fetching missions:", error)
      setError("Failed to fetch missions. Please try again.")
    }
  }

  useEffect(() => {
    if (id) {
      fetchMissions()
    }
  }, [id])

  useEffect(() => {
    if (allMissions.length > 0) {
      setMission(allMissions[0])
    }
  }, [allMissions])

  const handleTokenChange = (newTokens) => {
    setBalance(newTokens)
  }

  const handleCompleteMission = async (missionId) => {
    try {
      // Get the user's current position
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
  
      const { latitude, longitude } = position.coords;
      const coordinates = [longitude, latitude]; // Note: GeoJSON uses [longitude, latitude] order
  
      const response = await fetch("http://localhost:3001/mission/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ coordinates }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to complete mission');
      }
  
      const data = await response.json();
      setSuccess(data.msg);
      fetchMissions(); // Refresh the missions list
      setBalance(prevBalance => prevBalance + data.pointsEarned); // Update the balance
    } catch (error) {
      console.error("Error completing mission:", error);
      setError("Failed to complete mission. Please try again.");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-10">
      <div className="flex justify-between mx-auto max-w-5xl pt-8">
        <Title />
        <SpringButton setTokens={handleTokenChange} tokens={balance} setMission={setMission} id={id} />
      </div>

      <div className="flex flex-col center-items ml-64 mr-64 mt-8">
        <div className='flex flex-col my-6'>
          <span className="text-black px-2 m-0 text-xs font-black">WELCOME BACK</span>
          <span className="text-black px-2 pb-2 text-3xl">{username}</span>
        </div>
        <div className='flex flex-col my-6'>
          <span className="text-black px-2 m-0 text-xs font-black">CURRENT MISSION</span>
          <span className="text-black px-2 pb-2 text-lg">{mission.location}</span>
        </div>

        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
        {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{success}</div>}

        <SortedMissions missions={missions} onCompleteMission={handleCompleteMission} />

        <div className="text-black border-black box-border p-2 border-4 w-full">
          Tokens: {balance}
          {visible ? <PetViewer petUrl={pet} /> : <StreetViewMap visible={!visible} destination={mission.coords} setVisible={setVisible} />}
        </div>

        <div>
          <button className="bg-black min-w-full" onClick={() => setVisible(!visible)}>
            {visible ? "Switch to Map" : "Switch to Pet"}
          </button>
        </div>

        <div>
          <button className="bg-black min-w-full mt-2" onClick={() => handleCompleteMission()}>Check Missions</button>
        </div>
      </div>
    </div>
  )
}