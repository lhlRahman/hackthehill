"use client";

import { useState } from "react";
import "./style.css";

export default function Login() {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [reveal, setReveal] = useState(false);

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://hackthehill.onrender.com/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      window.location.replace("/");
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  };

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
              value={inputs.username}
              onChange={onChange}
            />
          </label>
          <label>
            Password
            <input
              className="w-full py-2 px-1 rounded"
              type={reveal ? "text" : "password"}
              title='password'
              name="password"
              value={inputs.password}
              onChange={onChange}
            />
          </label>
          <div
            className={`${reveal ? "reveal" : "lock"}`}
            onClick={() => {
              setReveal(!reveal);
            }}
          >
            <img src="/icons/lockIcon.svg" alt="lock icon" />
            <img src="/icons/eyeIcon.svg" alt="open icon" />
          </div>
          <button type="submit" className="mt-4 py-2 px-4 bg-blue-500 text-white rounded">Sign In</button>
        </div>
      </form>
    </div>
  );
}