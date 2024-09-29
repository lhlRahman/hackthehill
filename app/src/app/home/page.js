'use client'
import SpringButton from '../components/Modal.js'
import EditMission from '../components/editMission.js';
import React, { useState } from 'react';
import { useAppStatesContext } from '../components/user-context.js';
import PetViewer from "../components/PetViewer.js";

export default function Home() {

  const basetext = {
    active:false,
    title:"Add a new Mission!",
    datetime: Date(),
    location: "a place"
  }

  const [mission, setMission] = useState(basetext);
  const { username } = useAppStatesContext();
  const [tokens, setTokens] = useState(0);

    return (
        <div className="bg-slate-50 min-h-screen pb-10">
          <div className="flex justify-between ml-52 mr-52 pt-8 h-full">
            <h1 className='text-black text-4xl font-black'>Paw_sitivity</h1>
            <SpringButton setTokens={setTokens} tokens={tokens} setMission={setMission} />
            </div>

            <div className="flex flex-col center-items ml-64 mr-64 mt-8">
            <div className='flex flex-col my-6'>
                <span className="text-black px-2 m-0 text-xs font-black">CURRENT BALANCE</span>
                <span className="text-black px-2 pb-2 text-lg">{username}</span>
              </div>

              <div className='flex flex-col my-6'>
                <span className="text-black px-2 m-0 text-xs font-black">CURRENT MISSION</span>
                <span className="text-black px-2 pb-2 text-lg">{mission.location}</span>
              </div>

              <div className="text-black border-black box-border p-2 border-4 w-full">
                Tokens: {tokens}
                <PetViewer />
                </div>

                <div>
                  <EditMission setTokens={setTokens} tokens={tokens} active={mission.active} ></EditMission>
                </div>
            </div>
        </div>
    );
  }