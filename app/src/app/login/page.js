"use client"

import React, { useState } from "react"
import { motion } from "framer-motion"
import { useAppStatesContext } from "../components/user-context.js"

export default function Component() {
  const { setUserId, username, setUserName, setAllFriends, setBalance  } = useAppStatesContext()

  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  })

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch("https://hackthehill.onrender.com/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: inputs.username,
          password: inputs.password,
        }),
      })

      if (!response.ok) {
        throw new Error("Network response was not ok")
      }

      const data = await response.json()

      // Setting
      setUserId(data.user._id);
      setUserName(data.user.username);
      setAllFriends(data.user.friends);
      setBalance(data.user.balance);

      console.log(username);

      localStorage.setItem("token", data.token)
      window.location.replace("home")
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error)
    }
  }

  return (
    <section className="grid min-h-screen grid-cols-1 bg-slate-50 md:grid-cols-[1fr,_400px] lg:grid-cols-[1fr,_600px]">
      <Logo />
      <motion.div
        initial="initial"
        whileInView="animate"
        transition={{
          staggerChildren: 0.05,
        }}
        viewport={{ once: true }}
        className="flex items-center justify-center pb-4 pt-20 md:py-20"
      >
        <div className="mx-auto max-w-lg px-4 md:pr-0">
          <motion.h1
            variants={primaryVariants}
            className="mb-2 text-center text-4xl font-semibold text-black"
          >
            Sign in to your account
          </motion.h1>

          <form onSubmit={onSubmit} className="w-full">
            <motion.div variants={primaryVariants} className="mb-2 w-full">
              <label
                htmlFor="username-input"
                className="mb-1 inline-block text-sm font-medium text-black"
              >
                Username
              </label>
              <input
                id="username-input"
                type="text"
                name="username"
                value={inputs.username}
                onChange={onChange}
                placeholder="Enter your username"
                className="w-full rounded border-[1px] border-slate-300 px-2.5 py-1.5 focus:outline-indigo-600 text-black"
                required
              />
            </motion.div>

            <motion.div variants={primaryVariants} className="mb-4 w-full">
              <label
                htmlFor="password-input"
                className="mb-1 inline-block text-sm font-medium text-black"
              >
                Password
              </label>
              <input
                id="password-input"
                type="password"
                name="password"
                value={inputs.password}
                onChange={onChange}
                placeholder="Enter your password"
                className="w-full rounded border-[1px] border-slate-300 px-2.5 py-1.5 focus:outline-indigo-600 text-black"
                required
              />
            </motion.div>

            <motion.button
              variants={primaryVariants}
              whileTap={{
                scale: 0.985,
              }}
              type="submit"
              className="mb-1.5 w-full rounded bg-indigo-600 px-4 py-2 text-center font-medium text-white transition-colors hover:bg-indigo-700"
            >
              Sign In
            </motion.button>
          </form>
        </div>
      </motion.div>
      <SupplementalContent />
    </section>
  )
}

const Logo = () => {
  return (
    <img
      width="50"
      height="50"
      viewBox="0 0 50 39"
      fill="none"
      src="/logo.png"
      xmlns="http://www.w3.org/2000/svg"
      className="absolute left-[50%] top-4 -translate-x-[50%] fill-slate-950 md:left-4 md:-translate-x-0"
    
    >
    </img>
  )
}

const primaryVariants = {
  initial: {
    y: 25,
    opacity: 0,
  },
  animate: {
    y: 0,
    opacity: 1,
  },
}

const SupplementalContent = () => {
  return (
    <div className="group sticky top-4 m-4 h-80 overflow-hidden rounded-3xl rounded-tl-[4rem] bg-gradient-to-r from-violet-600 to-indigo-600 md:h-[calc(100vh_-_2rem)]">
      <motion.div className="absolute inset-0 flex flex-col items-start justify-end bg-gradient-to-t from-slate-950/90 to-slate-950/0 p-8">
        <motion.h2 className="mb-2 text-3xl font-semibold leading-[1.25] text-white lg:text-4xl">
          Unlock Your Full Potential
        </motion.h2>
        <motion.p className="mb-6 max-w-md text-sm ">
          Join a community focused on self-growth and start your journey today.
        </motion.p>
      </motion.div>
    </div>
  )
}