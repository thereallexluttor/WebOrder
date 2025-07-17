"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ChefHat, 
  Clock, 
  Star, 
  ShoppingCart, 
  Plus,
  Bell,
  MapPin
} from "lucide-react"
import { WaiterCall, FloatingWaiterButton } from "./waiter-call"
import { CartCheckout } from "./cart-checkout"
import { ProductModal } from "./product-modal"

const categories = [
  { id: "appetizers", name: "Entrantes", icon: "🥗" },
  { id: "pasta", name: "Pasta", icon: "🍝" },
  { id: "pizza", name: "Pizza", icon: "🍕" },
  { id: "mains", name: "Platos Principales", icon: "🥩" },
  { id: "desserts", name: "Postres", icon: "🍰" },
  { id: "drinks", name: "Bebidas", icon: "🥤" },
]

const menuItems = {
  appetizers: [
    {
      id: 1,
      name: "Bruschetta Classica",
      description: "Pan tostado con tomates frescos, albahaca y ajo",
      price: 8.5,
      image: "/placeholder.svg?height=120&width=120",
      rating: 4.8,
      prepTime: "10 min",
    },
    {
      id: 2,
      name: "Antipasto Platter",
      description: "Selección de embutidos, quesos, aceitunas y vegetales asados",
      price: 16.9,
      image: "/placeholder.svg?height=120&width=120",
      rating: 4.9,
      prepTime: "5 min",
    },
    {
      id: 3,
      name: "Arancini",
      description: "Bolitas de risotto crujientes rellenas de mozzarella con marinara",
      price: 12.5,
      image: "/placeholder.svg?height=120&width=120",
      rating: 4.7,
      prepTime: "15 min",
    },
  ],
  pasta: [
    {
      id: 4,
      name: "Spaghetti Carbonara",
      description: "Pasta romana clásica con huevos, queso pecorino y panceta",
      price: 18.9,
      image: "/placeholder.svg?height=120&width=120",
      rating: 4.9,
      prepTime: "20 min",
    },
    {
      id: 5,
      name: "Penne Arrabbiata",
      description: "Salsa de tomate picante con ajo, pimientos rojos y hierbas frescas",
      price: 16.5,
      image: "/placeholder.svg?height=120&width=120",
      rating: 4.6,
      prepTime: "18 min",
    },
    {
      id: 6,
      name: "Fettuccine Alfredo",
      description: "Salsa cremosa de parmesano con mantequilla y pimienta negra",
      price: 17.9,
      image: "/placeholder.svg?height=120&width=120",
      rating: 4.8,
      prepTime: "15 min",
    },
  ],
  pizza: [
    {
      id: 7,
      name: "Margherita",
      description: "Tomates San Marzano, mozzarella fresca, albahaca y aceite de oliva",
      price: 14.9,
      image: "/placeholder.svg?height=120&width=120",
      rating: 4.8,
      prepTime: "25 min",
    },
    {
      id: 8,
      name: "Quattro Stagioni",
      description: "Pizza cuatro estaciones con alcachofas, jamón, champiñones y aceitunas",
      price: 19.9,
      image: "/placeholder.svg?height=120&width=120",
      rating: 4.7,
      prepTime: "28 min",
    },
    {
      id: 9,
      name: "Diavola",
      description: "Salami picante, mozzarella, salsa de tomate y aceite de chile",
      price: 17.5,
      image: "/placeholder.svg?height=120&width=120",
      rating: 4.9,
      prepTime: "25 min",
    },
  ],
  mains: [
    {
      id: 10,
      name: "Osso Buco",
      description: "Carne de ternera estofada con vegetales, vino blanco y caldo",
      price: 28.9,
      image: "/placeholder.svg?height=120&width=120",
      rating: 4.9,
      prepTime: "35 min",
    },
    {
      id: 11,
      name: "Branzino al Sale",
      description: "Lubina mediterránea horneada en sal marina con hierbas",
      price: 24.5,
      image: "/placeholder.svg?height=120&width=120",
      rating: 4.8,
      prepTime: "30 min",
    },
  ],
  desserts: [
    {
      id: 12,
      name: "Tiramisu",
      description: "Postre italiano clásico con bizcochos empapados en café y mascarpone",
      price: 8.9,
      image: "/placeholder.svg?height=120&width=120",
      rating: 4.9,
      prepTime: "5 min",
    },
    {
      id: 13,
      name: "Panna Cotta",
      description: "Crema de vainilla sedosa con compota de bayas",
      price: 7.5,
      image: "/placeholder.svg?height=120&width=120",
      rating: 4.7,
      prepTime: "5 min",
    },
  ],
  drinks: [
    {
      id: 14,
      name: "Aperol Spritz",
      description: "Aperol, prosecco y agua con gas con rodaja de naranja",
      price: 9.5,
      image: "/placeholder.svg?height=120&width=120",
      rating: 4.8,
      prepTime: "3 min",
    },
    {
      id: 15,
      name: "Soda Italiana",
      description: "Agua con gas con tu elección de sabor de jarabe",
      price: 4.5,
      image: "/placeholder.svg?height=120&width=120",
      rating: 4.5,
      prepTime: "2 min",
    },
  ],
}

interface CartItem {
  id: number
  name: string
  description: string
  price: number
  image: string
  rating: number
  prepTime: string
  quantity: number
}

interface MenuAppProps {}

export function MenuApp({}: MenuAppProps) {
  const [selectedCategory, setSelectedCategory] = useState("appetizers")
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showWaiterCall, setShowWaiterCall] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const categoryScrollContainerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const addToCart = (item: any) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id)
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      } else {
        return [...prevCart, { ...item, quantity: 1 }]
      }
    })
  }

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    )
  }

  const removeFromCart = (itemId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== itemId))
  }

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  // Scroll detection for category switching
  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling) return

      const scrollPosition = window.scrollY + 200 // Offset for header
      let currentCategory = "appetizers"

      Object.entries(categoryRefs.current).forEach(([categoryId, element]) => {
        if (element) {
          const rect = element.getBoundingClientRect()
          const elementTop = rect.top + window.scrollY
          
          if (scrollPosition >= elementTop) {
            currentCategory = categoryId
          }
        }
      })

      setSelectedCategory(currentCategory)
    }

    const throttledScroll = () => {
      setIsScrolling(true)
      handleScroll()
      setTimeout(() => setIsScrolling(false), 100)
    }

    window.addEventListener('scroll', throttledScroll)
    return () => window.removeEventListener('scroll', throttledScroll)
  }, [isScrolling])

  const scrollToCategory = (categoryId: string) => {
    const element = categoryRefs.current[categoryId]
    if (element) {
      // Adjust these values if your header/category bar heights change
      const headerHeight = 64; // px, adjust if your header is taller/shorter
      const categoryBarHeight = 80; // px, adjust if your category bar is taller/shorter
      const totalOffset = headerHeight + categoryBarHeight;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY - totalOffset;
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
      });
    }
  }

  // Scroll category navigation to show selected category
  useEffect(() => {
    const categoryButton = document.querySelector(`[data-category="${selectedCategory}"]`) as HTMLElement;
    const scrollContainer = categoryScrollContainerRef.current;
    if (categoryButton && scrollContainer) {
      const containerRect = scrollContainer.getBoundingClientRect();
      const buttonRect = categoryButton.getBoundingClientRect();
      const buttonCenter = buttonRect.left + buttonRect.width / 2;
      const containerCenter = containerRect.left + containerRect.width / 2;
      const offset = buttonCenter - containerCenter;
      scrollContainer.scrollBy({
        left: offset,
        behavior: 'smooth',
      });
    }
  }, [selectedCategory]);



  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Bella Vista</h1>
                <p className="text-sm text-gray-600">Cocina Italiana Auténtica</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowCart(true)}
                className="relative bg-orange-500 hover:bg-orange-600"
                size="sm"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 text-xs">
                    {cartItemCount}
                  </Badge>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Categories */}
        <div className="bg-white border-b sticky top-20 z-10">
          <div className="w-full overflow-x-auto whitespace-nowrap" ref={categoryScrollContainerRef}>
            <div className="flex gap-2 p-4 min-w-max"
              onMouseDown={e => {
                setIsDragging(true)
                setStartX(e.pageX - (e.currentTarget.scrollLeft || 0))
                setScrollLeft(e.currentTarget.scrollLeft)
              }}
              onMouseLeave={e => setIsDragging(false)}
              onMouseUp={e => setIsDragging(false)}
              onMouseMove={e => {
                if (!isDragging) return
                e.preventDefault()
                const x = e.pageX - (e.currentTarget.scrollLeft || 0)
                const walk = x - startX
                e.currentTarget.scrollLeft = scrollLeft - walk
              }}
              onTouchStart={e => {
                setIsDragging(true)
                setStartX(e.touches[0].pageX - (e.currentTarget.scrollLeft || 0))
                setScrollLeft(e.currentTarget.scrollLeft)
              }}
              onTouchEnd={e => setIsDragging(false)}
              onTouchCancel={e => setIsDragging(false)}
              onTouchMove={e => {
                if (!isDragging) return
                const x = e.touches[0].pageX - (e.currentTarget.scrollLeft || 0)
                const walk = x - startX
                e.currentTarget.scrollLeft = scrollLeft - walk
              }}
            >
              {categories.map((category) => (
                <Button
                  key={category.id}
                  data-category={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  className={`flex items-center gap-2 whitespace-nowrap ${
                    selectedCategory === category.id ? "bg-orange-500 hover:bg-orange-600" : "hover:bg-gray-50"
                  }`}
                  onClick={() => scrollToCategory(category.id)}
                >
                  <span>{category.icon}</span>
                  {category.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-4">
          {categories.map((category) => (
            <div key={category.id} ref={(el) => { categoryRefs.current[category.id] = el }}>
              <h2 className="text-2xl font-bold text-white mb-4 mt-8 first:mt-0">{category.name}</h2>
              <div className="grid gap-4">
                {menuItems[category.id as keyof typeof menuItems]?.map((item) => (
                  <Card key={item.id} className="overflow-hidden bg-gray-900 border-gray-800 rounded-xl cursor-pointer" onClick={() => setSelectedProduct(item)}>
                    <CardContent className="p-0">
                      <div className="flex gap-4 p-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-white text-xl mb-1">{item.name}</h3>
                              <p className="text-gray-400 text-sm leading-relaxed line-clamp-2 mb-3">{item.description}</p>
                              <div className="text-xl font-bold text-white">${item.price}</div>
                              {item.rating >= 4.8 && (
                                <div className="inline-flex items-center bg-blue-500 text-white text-xs px-2 py-1 rounded-full mt-2">
                                  ⭐ POPULAR
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span>{item.rating}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{item.prepTime}</span>
                              </div>
                            </div>
                            
                            <Button
                              onClick={(e) => {
                                e.stopPropagation()
                                addToCart(item)
                              }}
                              size="sm"
                              className="bg-orange-500 hover:bg-orange-600 text-white rounded-full w-8 h-8 p-0"
                            >
                              <Plus className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="w-32 h-32 bg-gray-800 rounded-xl overflow-hidden flex-shrink-0">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Bottom spacing for better scrolling */}
        <div className="h-64"></div>
      </div>

      {/* Floating Waiter Button */}
      <FloatingWaiterButton 
        onClick={() => setShowWaiterCall(true)} 
      />

      {/* Modals */}
      {showWaiterCall && (
        <WaiterCall
          onClose={() => setShowWaiterCall(false)}
        />
      )}

      {showCart && (
        <CartCheckout
          cart={cart}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          onClose={() => setShowCart(false)}
        />
      )}

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(product, size, quantity = 1) => {
            for (let i = 0; i < quantity; i++) {
              addToCart({ ...product, selectedSize: size })
            }
          }}
        />
      )}
    </div>
  )
}
