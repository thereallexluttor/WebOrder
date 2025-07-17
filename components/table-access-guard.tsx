"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Shield, AlertTriangle, ChefHat } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { validateTableAccess, parseQRParams, type TableId } from "@/lib/table-auth"

interface TableAccessGuardProps {
  children: React.ReactNode
  onAccessGranted: (tableId: TableId) => void
}

export function TableAccessGuard({ children, onAccessGranted }: TableAccessGuardProps) {
  const searchParams = useSearchParams()
  const [accessState, setAccessState] = useState<'checking' | 'granted' | 'denied'>('checking')
  const [error, setError] = useState<string>("")
  const [tableId, setTableId] = useState<TableId | null>(null)

  useEffect(() => {
    const checkAccess = () => {
      const { tableId: urlTableId } = parseQRParams(searchParams)
      
      // If no table parameter, deny access
      if (!urlTableId) {
        setAccessState('denied')
        setError("Acceso denegado. Escanea el código QR de tu mesa.")
        return
      }

      // Validate table access (simplified - no date needed)
      const validation = validateTableAccess(urlTableId)
      
      if (validation.isValid && validation.tableId) {
        setTableId(validation.tableId)
        setAccessState('granted')
        onAccessGranted(validation.tableId)
      } else {
        setAccessState('denied')
        setError(validation.error || "Acceso no válido")
      }
    }

    // Simulate loading time
    const timer = setTimeout(checkAccess, 1500)
    return () => clearTimeout(timer)
  }, [searchParams, onAccessGranted])

  // Show loading state
  if (accessState === 'checking') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <Shield className="w-12 h-12 text-orange-500 animate-pulse" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Validando acceso...</h1>
          <div className="flex justify-center mb-4">
            <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    )
  }

  // Show access denied
  if (accessState === 'denied') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-700 to-red-800 flex items-center justify-center p-4">
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 max-w-md w-full">
          <CardContent className="p-6 text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
            
            <h2 className="text-xl font-bold text-white mb-2">Acceso Restringido</h2>
            <p className="text-white/80 text-sm mb-4">{error}</p>
            
            <div className="bg-white/10 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-center mb-2">
                <ChefHat className="w-6 h-6 text-white mr-2" />
                <span className="text-white font-semibold">Bella Vista</span>
              </div>
              <p className="text-white/70 text-xs">
                Para acceder al menú digital, escanea el código QR de tu mesa en el restaurante.
              </p>
            </div>

            <Button
              onClick={() => window.location.reload()}
              className="w-full bg-white text-red-600 hover:bg-white/90"
            >
              Intentar de nuevo
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Access granted - show children (the menu)
  return (
    <div>
      {/* Table info header */}
      <div className="bg-green-600 text-white px-4 py-2 text-center text-sm">
        ✓ Conectado desde {tableId} - Bella Vista Restaurant
      </div>
      {children}
    </div>
  )
} 