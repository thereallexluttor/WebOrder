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
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center p-4">
      <div
        className={`text-center transition-all duration-1000 ${
          fadeIn ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        {/* Logo and Brand */}
        <div className="mb-8">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <ChefHat className="w-12 h-12 text-orange-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Bella Vista</h1>
          <p className="text-white/80 text-lg">Authentic Italian Cuisine</p>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center mb-8">
          <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
        </div>

        {/* Welcome Message */}
        <div
          className={`transition-all duration-500 ${
            showOptions ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-white mb-2">¡Bienvenido!</h2>
                <p className="text-white/80 text-sm mb-4">
                  Disfruta de nuestra deliciosa cocina italiana
                </p>
                <p className="text-white/60 text-xs">
                  Cargando menú...
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
