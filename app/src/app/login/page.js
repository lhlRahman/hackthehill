"use client";

import Background from "../components/background.js"
import "./style.css"

function Login() {
    const onSubmit = async (event) => {
        event.preventDefault()

        const data = new FormData(event.target)
        const username = data.get('username')
        const password = data.get('password')

        const response = await fetch('/api/auth/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username, password})
        })
        const content = await response.text();
    }

    return (
        <>
            <div id="wrapper" className="flex flex-col items-center justify-center min-h-screen">
                <form className="flex flex-col items-center gap-2 w-3/5 z-10 py-10" onSubmit={onSubmit}>
                    <div className='flex flex-col gap-4 w-4/5'>
                        <span className='text-2xl mt-4 mb-8 font-black'>Sign in to your account</span>
                        <label>
                            Username
                            <input 
                                type="text" 
                                title='username'
                                name="username"
                                placeholder="John Doe">
                            </input>
                        </label>
                        <label>
                            Password
                            <input 
                                type="password" 
                                title='password'
                                name="password" 
                                placeholder="***********">
                                </input>
                        </label>
                        <input className="cursor-pointer w-full mt-12 mb-3 py-1 rounded" type="submit"></input>
                    </div>
                </form>
                <Background />
            </div>
        </>
    );
  }

export default Login