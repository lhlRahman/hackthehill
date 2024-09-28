'use client'
import { useState } from 'react';
export default function EditMission( { setTokens, tokens, mission, setMission } ) {

    const onClick = () => {
        if(mission.active) {
            setTokens(tokens-1);
            setMission( {active:false});
        }
    }

    return (
        <div>
            <button className="bg-gray-500 min-w-full" onClick={onClick} >Give Up</button>
        </div>
    )
}