'use client'
import React, { useState } from 'react';
import Modal from './Modal.js'


export default function AddMission() {

   const [state, setState] = useState(false);

   const openModal = () => {
        setState(true);
   }

   const closeModal = () => setState(false);

    return (

        <div >
            <button className="bg-gray-500 font-bold" onClick={openModal}>Start Mission {String(state)} </button>
            <Modal show={state} onClose={closeModal} />
        </div>

    )
}