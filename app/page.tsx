"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Github, ArrowRight, Loader2 } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import Link from 'next/link';

type UserType = "agent" | "client"
type AuthTab = "login" | "signup"

// Simple function to save user data to localStorage (simulating file storage)
const saveUserData = (userData: any) => {
  try {
    // Get existing users
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]")

    // Add new user
    existingUsers.push(userData)

    // Save back to localStorage
    localStorage.setItem("users", JSON.stringify(existingUsers))

    // Also save to a downloadable file for demonstration
    const dataStr = JSON.stringify(existingUsers, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })

    // Create a download link (optional - for viewing the data)
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "users.json"

    console.log("User data saved:", userData)
    console.log("All users:", existingUsers)

    return true
  } catch (error) {
    console.error("Error saving user data:", error)
    return false
  }
}

export default function AuthPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [authTab, setAuthTab] = useState<AuthTab>("login")
  const [userType, setUserType] = useState<UserType>("client")
  const [isLoading, setIsLoading] = useState(false)

  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  })

  // Signup form state
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  // Error state for login form
  const [loginErrors, setLoginErrors] = useState<{ [key: string]: string }>({})

  // Error state for signup form
  const [signupErrors, setSignupErrors] = useState<{ [key: string]: string }>({})

  // Handle login form submission - Accept any credentials
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Basic validation - just check if fields are not empty
      if (!loginForm.email || !loginForm.password) {
        toast({
          title: "Login failed",
          description: "Please fill in all fields.",
          variant: "destructive",
        })
        return
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create user session data
      const userData = {
        id: `user_${Date.now()}`,
        name: loginForm.email.split("@")[0], // Use email prefix as name
        email: loginForm.email,
        userType,
        loginTime: new Date().toISOString(),
        sessionId: `session_${Date.now()}`,
      }

      // Save user data to localStorage (simulating file storage)
      saveUserData({
        ...userData,
        action: "login",
        password: loginForm.password, // In real app, never store passwords in plain text
      })

      // Store current user session
      localStorage.setItem("currentUser", JSON.stringify(userData))

      toast({
        title: "Login successful",
        description: `Welcome, ${userData.name}!`,
      })

      // Redirect to main app
      router.push("/")
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle signup form submission - Accept any credentials
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Basic validation
      if (!signupForm.name || !signupForm.email || !signupForm.password) {
        toast({
          title: "Signup failed",
          description: "Please fill in all fields.",
          variant: "destructive",
        })
        return
      }

      if (signupForm.password !== signupForm.confirmPassword) {
        toast({
          title: "Signup failed",
          description: "Passwords do not match.",
          variant: "destructive",
        })
        return
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create user data
      const userData = {
        id: `user_${Date.now()}`,
        name: signupForm.name,
        email: signupForm.email,
        userType,
        signupTime: new Date().toISOString(),
        sessionId: `session_${Date.now()}`,
      }

      // Save user data to localStorage (simulating file storage)
      saveUserData({
        ...userData,
        action: "signup",
        password: signupForm.password, // In real app, never store passwords in plain text
      })

      // Store current user session
      localStorage.setItem("currentUser", JSON.stringify(userData))

      toast({
        title: "Signup successful",
        description: `Welcome, ${signupForm.name}!`,
      })

      // Redirect to main app
      router.push("/")
    } catch (error) {
      toast({
        title: "Signup failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle social login
  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Create mock user data for social login
      const userData = {
        id: `user_${Date.now()}`,
        name: `${provider} User`,
        email: `user@${provider.toLowerCase()}.com`,
        userType,
        loginTime: new Date().toISOString(),
        sessionId: `session_${Date.now()}`,
        provider,
      }

      // Save user data
      saveUserData({
        ...userData,
        action: "social_login",
      })

      // Store current user session
      localStorage.setItem("currentUser", JSON.stringify(userData))

      toast({
        title: `${provider} login successful`,
        description: `Welcome, ${userData.name}!`,
      })

      // Redirect to main app
      router.push("/")
    } catch (error) {
      toast({
        title: "Login failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Update form values
  const updateLoginForm = (field: string, value: string) => {
    setLoginForm((prev) => ({ ...prev, [field]: value }))
    // Clear error when user types
    if (loginErrors && loginErrors[field]) {
      setLoginErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const updateSignupForm = (field: string, value: string) => {
    setSignupForm((prev) => ({ ...prev, [field]: value }))
    // Clear error when user types
    if (signupErrors && signupErrors[field]) {
      setSignupErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  return (
    <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl font-bold text-white mb-2">NotePad</h1>
            <p className="text-gray-400">Your ultimate note-taking companion</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-[#1E1E1E] rounded-xl shadow-xl overflow-hidden"
        >
          {/* User Type Selection */}
          <div className="p-6 pb-0">
            <div className="flex justify-center mb-6">
              <div className="bg-[#2A2A2A] p-1 rounded-lg inline-flex">
                <button
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    userType === "client" ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-gray-200"
                  }`}
                  onClick={() => setUserType("client")}
                >
                  Client
                </button>
                <button
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    userType === "agent" ? "bg-blue-600 text-white shadow-md" : "text-gray-400 hover:text-gray-200"
                  }`}
                  onClick={() => setUserType("agent")}
                >
                  Agent
                </button>
              </div>
            </div>
          </div>

          {/* Auth Tabs */}
          <Tabs defaultValue="login" value={authTab} onValueChange={(value) => setAuthTab(value as AuthTab)}>
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-2 bg-[#2A2A2A]">
                <TabsTrigger value="login" className="data-[state=active]:bg-[#333] data-[state=active]:text-white">
                  Login
                </TabsTrigger>
                <TabsTrigger value="signup" className="data-[state=active]:bg-[#333] data-[state=active]:text-white">
                  Sign Up
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="p-6">
              <AnimatePresence mode="wait">
                <TabsContent value="login" key="login">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <form onSubmit={handleLogin} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-300">
                          Email
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="you@example.com"
                          value={loginForm.email}
                          onChange={(e) => setLoginForm((prev) => ({ ...prev, email: e.target.value }))}
                          className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
                          disabled={isLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label htmlFor="password" className="text-sm font-medium text-gray-300">
                            Password
                          </label>
                          <a href="#" className="text-xs text-blue-500 hover:text-blue-400">
                            Forgot password?
                          </a>
                        </div>
                        <Input
                          id="password"
                          type="password"
                          placeholder="••••••••"
                          value={loginForm.password}
                          onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                          className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
                          disabled={isLoading}
                        />
                      </div>
                      <Link href="/NotePad">
                      <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Logging in...
                          </>
                        ) : (
                          <>
                            Login
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                      </Link>
                    </form>

                    <div className="mt-6">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-[#3A3A3A]"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                          <span className="px-2 bg-[#1E1E1E] text-gray-400">Or continue with</span>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleSocialLogin("Google")}
                          disabled={isLoading}
                          className="bg-[#2A2A2A] border-[#3A3A3A] text-white hover:bg-[#333]"
                        >
                          <Image
                            src="/placeholder.svg?height=20&width=20"
                            alt="Google"
                            width={20}
                            height={20}
                            className="mr-2"
                          />
                          Google
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleSocialLogin("GitHub")}
                          disabled={isLoading}
                          className="bg-[#2A2A2A] border-[#3A3A3A] text-white hover:bg-[#333]"
                        >
                          <Github className="mr-2 h-4 w-4" />
                          GitHub
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </TabsContent>

                <TabsContent value="signup" key="signup">
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <form onSubmit={handleSignup} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium text-gray-300">
                          Full Name
                        </label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="John Doe"
                          value={signupForm.name}
                          onChange={(e) => setSignupForm((prev) => ({ ...prev, name: e.target.value }))}
                          className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
                          disabled={isLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="signup-email" className="text-sm font-medium text-gray-300">
                          Email
                        </label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="you@example.com"
                          value={signupForm.email}
                          onChange={(e) => setSignupForm((prev) => ({ ...prev, email: e.target.value }))}
                          className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
                          disabled={isLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="signup-password" className="text-sm font-medium text-gray-300">
                          Password
                        </label>
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="••••••••"
                          value={signupForm.password}
                          onChange={(e) => setSignupForm((prev) => ({ ...prev, password: e.target.value }))}
                          className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
                          disabled={isLoading}
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="confirm-password" className="text-sm font-medium text-gray-300">
                          Confirm Password
                        </label>
                        <Input
                          id="confirm-password"
                          type="password"
                          placeholder="••••••••"
                          value={signupForm.confirmPassword}
                          onChange={(e) => setSignupForm((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                          className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
                          disabled={isLoading}
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating account...
                          </>
                        ) : (
                          <>
                            Create Account
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </form>

                    <div className="mt-6">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-[#3A3A3A]"></div>
                        </div>
                        <div className="relative flex justify-center text-xs">
                          <span className="px-2 bg-[#1E1E1E] text-gray-400">Or continue with</span>
                        </div>
                      </div>

                      <div className="mt-6 grid grid-cols-2 gap-3">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleSocialLogin("Google")}
                          disabled={isLoading}
                          className="bg-[#2A2A2A] border-[#3A3A3A] text-white hover:bg-[#333]"
                        >
                          <Image
                            src="/placeholder.svg?height=20&width=20"
                            alt="Google"
                            width={20}
                            height={20}
                            className="mr-2"
                          />
                          Google
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleSocialLogin("GitHub")}
                          disabled={isLoading}
                          className="bg-[#2A2A2A] border-[#3A3A3A] text-white hover:bg-[#333]"
                        >
                          <Github className="mr-2 h-4 w-4" />
                          GitHub
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </div>
          </Tabs>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-6 text-sm text-gray-500"
        >
          By continuing, you agree to our{" "}
          <a href="#" className="text-blue-500 hover:text-blue-400">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-blue-500 hover:text-blue-400">
            Privacy Policy
          </a>
          .
        </motion.p>
      </div>
    </div>
  )
}
