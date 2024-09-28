"use client";

import './style.css'

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
      <div id="wrapper" className="flex flex-col items-center justify-center min-h-screen">
        <form className="flex flex-col items-center gap-2 w-3/5" onSubmit={onSubmit}>
            <div className='flex flex-col gap-2 w-4/5'>
                <span className='text-2xl my-6 font-extrabold'>Sign in to your account</span>
                <label>
                    Username
                    <input 
                        className="w-full py-2 px-1 rounded"
                        type="text" 
                        title='username'
                        name="username"
                        placeholder="John Doe">
                    </input>
                </label>
                <label>
                    Password
                    <input 
                        className="w-full py-2 px-1 rounded"
                        type="password" 
                        title='password'
                        name="password" 
                        placeholder="***********">
                        </input>
                </label>
            </div>
            <input className="w-full mt-20" type="submit"></input>
        </form>
      </div>
    );
  }

export default Login