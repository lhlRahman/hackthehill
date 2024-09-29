'use client'

import React, { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { useAppStatesContext } from "../../contexts/user-context.js"
import { AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const { setBalance, setUsername, setId, setAllFriends, setPet } = useAppStatesContext()
  const router = useRouter()

  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const onChange = useCallback((e) => {
    setInputs(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }, [])

  const onSubmit = useCallback(async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("http://localhost:3001/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      })

      if (!response.ok) {
        throw new Error(response.statusText)
      }

      const data = await response.json()
      console.log(data.user)

      // Update context state
      setBalance(data.user.balance)
      setUsername(data.user.username)
      setId(data.user._id)
      setAllFriends(data.user.friends)
      setPet(data.user.pet)

      
      // Log the updated values from the context
      console.log("Updated context values:", {
        balance: data.user.balance,
        username: data.user.username,
        id: data.user.id,
        allFriends: data.user.friends,
        pet: data.user.pet
      })
      
      // Store token in local storage
      localStorage.setItem("token", data.token)

      if (data.user && data.user.pet && data.user.pet !== "") {
        router.push("/home")
      } else {
        router.push("/create")
      }
    } catch (error) {
      setError("There was a problem with the login operation.")
      console.error("There was a problem with the fetch operation:", error)
    } finally {
      setIsLoading(false)
    }
  }, [inputs, setBalance, setUsername, setId, setAllFriends, router])

  return (
    <section className="grid min-h-screen grid-cols-1 bg-slate-50 md:grid-cols-[1fr,_400px] lg:grid-cols-[1fr,_600px]">
      <Logo />
      <motion.div
        initial="initial"
        animate="animate"
        transition={{
          staggerChildren: 0.05,
        }}
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
              className="mb-1.5 w-full rounded bg-indigo-600 px-4 py-2 text-center font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? "Signing In..." : "Sign In"}
            </motion.button>

            {error && (
              <motion.div variants={primaryVariants} className="mt-2 text-red-600 flex items-center">
                <AlertCircle className="inline-block mr-2" />
                <span>{error}</span>
              </motion.div>
            )}
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
      src="/logo.png"
      alt="Company Logo"
      className="absolute left-[50%] top-4 -translate-x-[50%] fill-slate-950 md:left-4 md:-translate-x-0"
    />
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
      <motion.div 
        initial="initial"
        animate="animate"
        variants={primaryVariants}
        className="absolute inset-0 flex flex-col items-start justify-end bg-gradient-to-t from-slate-950/90 to-slate-950/0 p-8"
      >
        <h2 className="mb-2 text-3xl font-semibold leading-[1.25] text-white lg:text-4xl">
          Unlock Your Full Potential
        </h2>
        <p className="mb-6 max-w-md text-sm text-white/80">
          Join a community focused on self-growth and start your journey today.
        </p>
      </motion.div>
    </div>
  )
}