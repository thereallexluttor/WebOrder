"use client"

import { useState, useEffect } from 'react'

export function useMobile() {
  const [isMobile, setIsMobile] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    const checkMobile = () => {
      // Verificar que estamos en el cliente
      if (typeof window === 'undefined') return
      
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
      
      // Detectar dispositivos móviles
      const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i
      const isMobileDevice = mobileRegex.test(userAgent)
      
      // También verificar el tamaño de pantalla
      const isSmallScreen = window.innerWidth <= 768
      
      setIsMobile(isMobileDevice || isSmallScreen)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Retornar false durante SSR para evitar errores de hidratación
  if (!isClient) {
    return false
  }

  return isMobile
}
