'use client'
import styles from '../styles/Modal.module.scss';
import AutoCompleteInput from './autoCompleteInput.js';
import { useState, useEffect,useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const SpringButton = ({setTokens, setMission, tokens, id}) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="place-content-center mr-52">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium px-4 py-2 rounded hover:opacity-90 transition-opacity"
        >
          Start Mission
        </button>
        <SpringModal isOpen={isOpen} setIsOpen={setIsOpen} setMission={setMission} setTokens={setTokens} tokens={tokens} id={id}/>
      </div>
    );
  };

const SpringModal = ({ isOpen, setIsOpen, setMission, setTokens, tokens, id }) => {
    const [coordinates, setCoordinates] = useState([]);
    const [address, setAddress] = useState("");


    const [inputs, setInputs] = useState({
        title: "",
        detail: "",
        amount: 0,
        location: { name: "", type: "Point", coordinates: "" },
        dateDue: "",
        link: "",
        priority: 0,
        _id: id,
      })

      const onChange = useCallback((e) => {
        setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))
      }, [])

      useEffect(() => {
        setInputs(prev => ({
            ...prev,
            location: {
                name: address,   
                type: "Point", 
                coordinates: coordinates
                }
        }));
    }, [address, coordinates]);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        console.log("submitted");
        const active = true;

        console.log(inputs.title);
        console.log(address);
        console.log(inputs.dateDue);
        

        if (inputs.title && inputs.dateDue && address){
            console.log("proceeded");

            setTokens(tokens+1);
            setMission({title: inputs.title, dateDue: inputs.dateDue, location: address});

            console.log(JSON.stringify(inputs))

            try {
                const response = await fetch("http://localhost:3001/mission", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify(inputs),
                  });
            
                  if (!response.ok) {
                    throw new Error(response.statusText)
                  }

                  try {
                    const content = {
                        points: tokens + 1,
                        id: id
                    }

                    const response = await fetch("http://localhost:3001/user/updatepoints", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `${localStorage.getItem("token")}`
                        },
                        body: JSON.stringify(content),
                    });

                    if (!response.ok) {
                        throw new Error(response.statusText)
                      }
    
                      const data = await response.json()
                }
                catch (error) {
                    console.error("There was a problem with the fetch operation:", error)
                }

                  const data = await response.json()
            } catch (error) {
                console.error("There was a problem with the fetch operation:", error)
            }

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
                            value={inputs.title}
                            onChange={onChange}
                            placeholder="Title"
                        />
                        <input
                            className="bg-white text-black p-1 rounded"
                            id="datetime"
                            name="dateDue"
                            type="datetime-local"
                            value={inputs.dateDue}
                            onChange={onChange}
                        />
                        <div className={`mt-4 mb-3 text-black ${styles.locationWrapper} ${styles.box}`}>
                            <AutoCompleteInput
                                setCoordinates={setCoordinates}
                                setAddress={setAddress}
                                value={address}
                                onChange={onChange}
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