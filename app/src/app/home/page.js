'use client'
import SpringButton from '../components/Modal.js'
import EditMission from '../components/editMission.js';
import StreetViewMap from '../components/streetViewMap.js';
import React, { useState } from 'react';

export default function Home() {

  const basepos = [45.420480, -75.681280];

  const basetext = {
    active:false,
    title:"Add a new Mission!",
    datetime: Date(),
    location: "a place"
  }

  const [mission, setMission] = useState(basetext);

  // Get from DB user's actual tokens
  const [tokens, setTokens] = useState(0);

    return (
      <div className="bg-gray-200 min-h-screen">
        <div className="flex justify-between ml-64 mr-64 pt-8 h-full">
          <h1>let's get some work done (woo)</h1>
          <SpringButton />
          </div>

          <div className="flex flex-col center-items ml-64 mr-64 mt-16">
            <h2>Current Mission: {mission.datetime}</h2>

            <div className=" border-red-500 border-4 w-full h-40">Tokens: {tokens}
              <StreetViewMap visible={true} position={basepos} destination={basepos}/>
            </div>

              <div>
                <EditMission setTokens={setTokens} tokens={tokens} setMission={setMission} mission={mission} ></EditMission>
              </div>
          </div>
      </div>

    );
  }