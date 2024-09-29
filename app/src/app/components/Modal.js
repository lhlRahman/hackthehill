'use client'
import styles from '../styles/Modal.module.scss';
import AutoCompleteInput from './autoCompleteInput.js';
import React, { useState } from 'react';

export default function Modal({show, onClose, setMission, mission, setTokens, tokens}) {
    
    let message = "Add a Mission!";

    const [coordinates, setCoordinates] = useState([]);
    const [address, setAddress] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
    
        console.log("submitted");
        const active = true;
        let title = e.target.title.value;
        let description = e.target.description.value;
        let location = address || null;
        
        
        if (title && description && location){
            setTokens(tokens+1);
            setMission({title, description, location});
            onClose();
        }

    }


    if (show==false) {
        return null;
    }
    else {
        console.log(String(show));
        return (
            <div className="fixed top-0 left-0 w-100% h-100% bg-opacity-50 bg-white flex justify-center items-center">
                <h1>{message}</h1>
                <form method="post" action="/home" className="flex flex-col gap-1" onSubmit={(e)=>handleSubmit(e)}>
                    <input
                        className="bg-white text-gray-500"
                        id="title"
                        name="title"
                        placeholder="Title"
                    />
                    <input
                        className="bg-white text-gray-500"
                        id="description"
                        name="description"
                        placeholder="Description"
                    />
                    <div className={`${styles.locationWrapper} ${styles.box}`}>
                        <AutoCompleteInput
                            setCoordinates={setCoordinates}
                            setAddress={setAddress}
                        />
                    </div>
                    <button
                        className="bg-gray-500 text-white">
                            Add!
                    </button>
                </form>
                
            </div>
        )
    }
}