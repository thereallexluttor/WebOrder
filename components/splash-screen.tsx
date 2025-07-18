"use client"

import { useEffect, useState } from "react"
import { ChefHat } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface SplashScreenProps {
  onEnterMenu: () => void
}

export function SplashScreen({ onEnterMenu }: SplashScreenProps) {
  const [fadeIn, setFadeIn] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  useEffect(() => {
    setFadeIn(true)
    // Show options after initial animation
    const timer = setTimeout(() => {
      setShowOptions(true)
    }, 1500)
    
    // Auto-transition to menu after 5 seconds
    const autoTransition = setTimeout(() => {
      onEnterMenu()
    }, 5000)
    
    return () => {
      clearTimeout(timer)
      clearTimeout(autoTransition)
    }
  }, [onEnterMenu])

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#18494E] via-[#2a5f5f] to-[#1a3e3e] flex items-center justify-center p-4 font-[Helvetica Neue]">
      <div
        className={`text-center transition-all duration-1000 ${
          fadeIn ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Logo and Brand */}
        <div className="mb-8">
          <div className="w-48 h-48 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl overflow-hidden">
            <img 
              src="/logo.png" 
              alt="Bella Vista Logo" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center mb-8">
          <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  )
}
