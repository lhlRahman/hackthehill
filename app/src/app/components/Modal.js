'use client'
import styles from '../styles/Modal.module.scss';
import AutoCompleteInput from './autoCompleteInput.js';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const SpringButton = ({setTokens, setMission, tokens}) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="place-content-center">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium px-4 py-2 rounded hover:opacity-90 transition-opacity"
        >
          Start Mission
        </button>
        <SpringModal isOpen={isOpen} setIsOpen={setIsOpen} setMission={setMission} setTokens={setTokens} tokens={tokens} />
      </div>
    );
  };

const SpringModal = ({ isOpen, setIsOpen, setMission, setTokens, tokens }) => {
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
        }

    }
    
    return (
        <AnimatePresence>
        {isOpen && (
            <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
            >
            <motion.div
                initial={{ scale: 0, rotate: "12.5deg" }}
                animate={{ scale: 1, rotate: "0deg" }}
                exit={{ scale: 0, rotate: "0deg" }}
                onClick={(e) => e.stopPropagation()}
                className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
            >
                <div className="w-100% h-100% flex flex-col justify-center items-center">
                    <h1 className='text-2xl font-extrabold mb-6'>Start a mission</h1>
                    <form method="post" action="/home" className="flex flex-col justify-center gap-3 w-3/4" onSubmit={(e)=>handleSubmit(e)}>
                        <input
                            className="bg-white text-black p-1 rounded"
                            id="title"
                            name="title"
                            placeholder="Title"
                        />
                        <input
                            className="bg-white text-black p-1 rounded"
                            id="description"
                            name="description"
                            placeholder="Description"
                        />
                        <div className={`mt-4 mb-3 text-black ${styles.locationWrapper} ${styles.box}`}>
                            <AutoCompleteInput
                                setCoordinates={setCoordinates}
                                setAddress={setAddress}
                            />
                        </div>
                        <button
                            className="rounded border border-solid border-white text-white"
                            onClick={() => setIsOpen(false)}
                            >
                                Submit
                        </button>
                    </form>
                </div>
            </motion.div>
            </motion.div>
        )}
        </AnimatePresence>
    );
};


export default SpringButton