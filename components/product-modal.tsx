"use client"

import { useState, useEffect, useRef } from "react"
import { X, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface ProductModalProps {
  product: any
  onClose: () => void
  onAddToCart: (product: any, size?: string, quantity?: number) => void
}

export function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  const [fadeIn, setFadeIn] = useState(false)
  const [selectedSize, setSelectedSize] = useState("small")
  const [quantity, setQuantity] = useState(1)
  const [dragY, setDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startY, setStartY] = useState(0)
  const sheetRef = useRef<HTMLDivElement>(null)

  const sizes = [
    { id: "small", name: "Small, approx. Ø 26cm", price: 0 },
    { id: "medium", name: "Medium, approx. Ø 32cm", price: 1.50 },
    { id: "large", name: "Large, approx. Ø 50cm", price: 12.40 }
  ]

  const relatedProducts = [
    { id: 101, name: "Pasta Side", price: 3.50, image: "/placeholder.svg" },
    { id: 102, name: "Garlic Bread", price: 2.80, image: "/placeholder.svg" }
  ]

  useEffect(() => {
    setFadeIn(true)
  }, [])

  const getCurrentPrice = () => {
    const sizePrice = sizes.find(s => s.id === selectedSize)?.price || 0
    return product.price + sizePrice
  }

  const handleAddToOrder = () => {
    onAddToCart(product, selectedSize, quantity)
    onClose()
  }

  // Touch handlers for drag-to-close
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartY(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const currentY = e.touches[0].clientY
    const deltaY = Math.max(0, currentY - startY) // Only allow dragging down
    setDragY(deltaY)
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    if (dragY > 150) { // Close if dragged more than 150px
      onClose()
    } else {
      setDragY(0) // Snap back
    }
  }

  // Mouse handlers for desktop drag
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartY(e.clientY)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return
    const deltaY = Math.max(0, e.clientY - startY)
    setDragY(deltaY)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    if (dragY > 150) {
      onClose()
    } else {
      setDragY(0)
    }
  }

  return (
    <div 
      className={`fixed inset-0 flex items-end justify-center z-50 transition-opacity duration-300 ${
        fadeIn ? 'opacity-100 bg-black/40 backdrop-blur-sm' : 'opacity-0 bg-black/0'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div 
        ref={sheetRef}
        className={`bg-gray-900 w-full max-w-md rounded-t-3xl transition-all duration-300 ${
          fadeIn ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{
          transform: `translateY(${dragY}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={isDragging ? handleMouseMove : undefined}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-400 rounded-full cursor-grab active:cursor-grabbing"></div>
        </div>

        {/* Product Image */}
        <div className="relative">
          <div className="w-full h-64 bg-gray-200 overflow-hidden">
            <img
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <Button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-800/80 hover:bg-gray-700/80 text-white border-0 p-0"
            size="sm"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
          {/* Product Info */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{product.name}</h2>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold text-blue-400">€ {getCurrentPrice().toFixed(2)}</span>
              {product.rating >= 4.8 && (
                <div className="inline-flex items-center bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                  ⭐ POPULAR
                </div>
              )}
            </div>
          </div>

          {/* Size Selection */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-2">Choose size</h3>
            <p className="text-gray-400 text-sm mb-4">Choose at least one item</p>
            <div className="space-y-3">
              {sizes.map((size) => (
                <div 
                  key={size.id}
                  className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                    selectedSize === size.id 
                      ? 'border-blue-500 bg-blue-500/10' 
                      : 'border-gray-700 bg-gray-800 hover:bg-gray-750'
                  }`}
                  onClick={() => setSelectedSize(size.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      selectedSize === size.id ? 'border-blue-500 bg-blue-500' : 'border-gray-500'
                    }`}>
                      {selectedSize === size.id && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    </div>
                    <span className="text-white">{size.name}</span>
                  </div>
                  {size.price > 0 && (
                    <span className="text-gray-400">+ € {size.price.toFixed(2)}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Often bought with */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Often bought with</h3>
            <div className="flex gap-3">
              {relatedProducts.map((item) => (
                <div key={item.id} className="relative flex-1">
                  <Card className="bg-gray-800 border-gray-700 rounded-xl overflow-hidden hover:bg-gray-750 transition-colors">
                    <CardContent className="p-0">
                      <div className="h-24 bg-gray-200 relative">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        <div className="absolute top-2 left-2">
                          <div className="inline-flex items-center bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                            ⭐ POPULAR
                          </div>
                        </div>
                        <Button className="absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-500 hover:bg-blue-600 border-0 p-0">
                          <Plus className="w-3 h-3 text-white" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fixed Add to Order Section */}
        <div className="p-6 pt-0 bg-gray-900 border-t border-gray-800">
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-gray-800 rounded-lg">
              <Button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-12 h-12 bg-transparent hover:bg-gray-700 text-white border-0"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="text-white font-semibold px-4">{quantity}</span>
              <Button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-12 h-12 bg-transparent hover:bg-gray-700 text-white border-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <Button 
              onClick={handleAddToOrder}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-xl text-lg"
            >
              Add to order € {(getCurrentPrice() * quantity).toFixed(2)}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 