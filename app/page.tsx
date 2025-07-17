"use client"

import { useState, Suspense } from "react"
import { SplashScreen } from "@/components/splash-screen"
import { MenuApp } from "@/components/menu-app"
import { TableAccessGuard } from "@/components/table-access-guard"
import { type TableId } from "@/lib/table-auth"

function PageContent() {
  const [currentView, setCurrentView] = useState<'access' | 'splash' | 'menu'>('access')
  const [currentTable, setCurrentTable] = useState<TableId | null>(null)

  const handleAccessGranted = (tableId: TableId) => {
    setCurrentTable(tableId)
    setCurrentView('splash')
  }

  const handleEnterMenu = () => {
    setCurrentView('menu')
  }

  // Access validation phase
  if (currentView === 'access') {
    return (
      <TableAccessGuard onAccessGranted={handleAccessGranted}>
        <div /> {/* This won't be shown during access checking */}
      </TableAccessGuard>
    )
  }

  // Splash screen phase
  if (currentView === 'splash') {
    return (
      <div className="min-h-screen">
        <div className="bg-green-600 text-white px-4 py-2 text-center text-sm">
          ✓ Conectado desde {currentTable} - Bella Vista Restaurant
        </div>
        <SplashScreen onEnterMenu={handleEnterMenu} />
      </div>
    )
  }

  // Menu phase
  return (
    <div className="min-h-screen">
      <div className="bg-green-600 text-white px-4 py-2 text-center text-sm">
        ✓ Conectado desde {currentTable} - Bella Vista Restaurant
      </div>
      <MenuApp />
    </div>
  )
}

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p>Cargando...</p>
        </div>
      </div>
    }>
      <PageContent />
    </Suspense>
  )
}
