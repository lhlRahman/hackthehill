'use client'
import { useState } from 'react';
export default function EditMission( { setTokens, tokens, active } ) {

    const onClick = () => {
        if(active) {
            setTokens(tokens-1);
        }
    }

    return (
        <div>
            <button className="bg-black min-w-full" onClick={onClick} >Give Up</button>
        </div>
    )
}