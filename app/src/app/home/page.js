'use client'

import React, { useState, useEffect } from 'react'
import SpringButton from '../components/Modal.js'
import EditMission from '../components/editMission.js'
import { useAppStatesContext } from '../../contexts/user-context.js'
import PetViewer from "../components/PetViewer.js"
import StreetViewMap from "../components/streetViewMap";

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
  );
}

function Dashboard({ missions }) {
  return (
    <div className='flex flex-col'>
      {missions.map((mission, index) => (
        <div key={index} className='flex flex-col my-6'>
          <span className="text-black px-2 m-0 text-xs font-black">MISSION {index + 1}</span>
          <span className="text-black px-2 pb-2 text-lg">{mission.location}</span>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  const { username, balance, allMissions, setBalance, id, pet } = useAppStatesContext()
  console.log("Home context values:", { username, balance, allMissions, id, pet })

  useEffect(() => {
    console.log("Context values in Home:", { username, balance, allMissions })
  }, [username, balance, allMissions])

  const basepos = [45.4224016, -75.6819462];

  const basetext = {
    active: false,
    title: "Add a new Mission!",
    dateDue: Date(),
    location: "a place",
    coords: basepos
  } 

  const [visible, setVisible] = useState(true);
  const [mission, setMission] = useState(basetext)

  useEffect(() => {
    if (allMissions.length > 0) {
      setMission(allMissions[0])
    }
  }, [allMissions])

  const handleTokenChange = (newTokens) => {
    setBalance(newTokens)
  }

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

              <Dashboard missions={allMissions}></Dashboard>

        <div className="text-black border-black box-border p-2 border-4 w-full">
          Tokens: {balance}
          <PetViewer visible={visible} petUrl={pet}/>
          <StreetViewMap visible={!visible} destination={mission.coords} setVisible={setVisible} />
        </div>

              <div>
                <button className="bg-black min-w-full" onClick={()=> {setVisible(!visible)}}>{visible ? "Switch to Map" : "Switch to Pet"}</button>
              </div>
          </div>
      </div>

    );
  }
