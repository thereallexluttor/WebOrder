"use client"

import { useState, useEffect } from "react"
import { Bell, X, CheckCircle, User, ChefHat } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface WaiterCallProps {
  tableNumber?: string
  onClose: () => void
}

export function WaiterCall({ tableNumber, onClose }: WaiterCallProps) {
  const [isCalling, setIsCalling] = useState(false)
  const [callSent, setCallSent] = useState(false)
  const [fadeIn, setFadeIn] = useState(false)

  useEffect(() => {
    setFadeIn(true)
  }, [])

  const handleCallWaiter = () => {
    setIsCalling(true)
    // Simulate waiter call
    setTimeout(() => {
      setCallSent(true)
      setIsCalling(false)
    }, 2000)
  }

  const handleClose = () => {
    if (callSent) {
      // Reset state after a delay
      setTimeout(() => {
        setCallSent(false)
        onClose()
      }, 1000)
    } else {
      onClose()
    }
  }

  return (
    <div className={`fixed inset-0 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${fadeIn ? 'opacity-100 bg-black/40 backdrop-blur-sm' : 'opacity-0 bg-black/0'}`}>
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#18494E]" />
            Llamar al Camarero
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={handleClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {tableNumber && (
            <div className="flex items-center justify-center">
              <Badge variant="secondary" className="text-sm">
                {tableNumber}
              </Badge>
            </div>
          )}

          {!callSent ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <User className="w-8 h-8 text-orange-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ¿Necesitas ayuda?
                </h3>
                <p className="text-gray-600 text-sm">
                  Presiona el botón para llamar a un camarero a tu mesa
                </p>
              </div>

              <Button
                onClick={handleCallWaiter}
                disabled={isCalling}
                className="w-full bg-[#18494E] hover:bg-[#18494E]/90"
                size="lg"
              >
                <Bell className="w-5 h-5 mr-2" />
                {isCalling ? "Llamando..." : "Llamar Camarero"}
              </Button>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  ¡Llamada Enviada!
                </h3>
                <p className="text-gray-600 text-sm">
                  Un camarero llegará a tu mesa en breve
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Floating Waiter Call Button Component
interface FloatingWaiterButtonProps {
  onClick: () => void
  tableNumber?: string
}

export function FloatingWaiterButton({ onClick, tableNumber }: FloatingWaiterButtonProps) {
  return (
    <div className="fixed bottom-6 right-6 z-40">
      <Button
        onClick={onClick}
        className="w-12 h-12 rounded-full bg-[#18494E] hover:bg-[#18494E]/90 shadow-lg border-0 p-0 flex items-center justify-center"
        size="lg"
      >
        <Bell className="w-6 h-6 text-white" />
      </Button>
      {tableNumber && (
        <div className="absolute -top-2 -right-2">
          <Badge variant="destructive" className="text-xs px-1 py-0">
            {tableNumber}
          </Badge>
        </div>
      )}
    </div>
  )
} 