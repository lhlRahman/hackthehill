'use client'
import React, { useState } from 'react';
import Modal from './Modal.js'


export default function AddMission( { setMission} ) {

    const [state, setState] = useState(false);

    const openModal = () => {
            setState(true);
    }

    const closeModal = () => setState(false);


    return (

        <div >
            <button className="bg-gray-500 font-bold" onClick={openModal}>Start Mission</button>
            
            <Modal show={state} onClose={closeModal} setMission={setMission} />
        </div>

    )
}