'use client'
import Modal from '../components/Modal.js'
import EditMission from '../components/editMission.js';
import React, { useState } from 'react';

export default function Home() {

  const basetext = {
    active:false,
    title:"Add a new Mission!",
    datetime: new Date(),
    location: "a place"
  }

  const [mission, setMission] = useState(basetext);

  // Get from DB user's actual tokens
  const [tokens, setTokens] = useState(0);

  const [state, setState] = useState(false);

  const openModal = () => {
          setState(true);
  }

  const closeModal = () => setState(false);




    return (
      <div className="min-h-screen">
        <div className="flex justify-between ml-64 mr-64 pt-8 h-full">
          <h1>let's get some work done (woo)</h1>
            <div>
              <button className="bg-gray-500 font-bold" onClick={openModal}>Start Mission</button> 
              <Modal show={state} onClose={closeModal} setMission={setMission} mission={mission} setTokens={setTokens} tokens={tokens} />
            </div>
          </div>

          <div className="flex flex-col center-items ml-64 mr-64 mt-16">
            <h2>Current Mission: {mission.datetime}</h2>

            <div className=" border-red-500 border-4 w-full h-40">Tokens: {tokens}</div>

              <div>
                <EditMission setTokens={setTokens} tokens={tokens} mission={mission} setMission={setMission}></EditMission>
              </div>
          </div>
      </div>

    );
  }