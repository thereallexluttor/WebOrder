"use client"

import { useState } from "react"
import { ShoppingCart, X, Plus, Minus, CreditCard, DollarSign, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface MenuItem {
  id: number
  name: string
  description: string
  price: number
  image: string
  rating: number
  prepTime: string
}

interface CartItem extends MenuItem {
  quantity: number
  opciones?: Record<string, string>
  extras?: any[]
  salsa?: any
}

interface PaidOrder {
  id: string;
  date: string;
  items: CartItem[];
}

interface CartCheckoutProps {
  cart: CartItem[]
  onUpdateQuantity: (itemId: number, quantity: number) => void
  onRemoveItem: (itemId: number) => void
  onClose: () => void
  tableNumber?: string
  paidOrders: PaidOrder[] // New: paid orders history
  onOrderComplete: () => void // New: handler to complete order
}

export function CartCheckout({ cart, onUpdateQuantity, onRemoveItem, onClose, tableNumber, paidOrders, onOrderComplete }: CartCheckoutProps) {
  const [showCheckout, setShowCheckout] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [orderComplete, setOrderComplete] = useState(false)
  // Helper to get real price per item (base + extras + salsa)
  function getItemTotal(item: any) {
    let base = item.price;
    if (item.extras && Array.isArray(item.extras)) {
      base += item.extras.reduce((sum: number, e: any) => sum + (e.price || 0), 0);
    }
    if (item.salsa && item.salsa.price) {
      base += item.salsa.price;
    }
    return base * item.quantity;
  }
  // Helper to get unit price (for display)
  function getItemUnitPrice(item: any) {
    let base = item.price;
    if (item.extras && Array.isArray(item.extras)) {
      base += item.extras.reduce((sum: number, e: any) => sum + (e.price || 0), 0);
    }
    if (item.salsa && item.salsa.price) {
      base += item.salsa.price;
    }
    return base;
  }

  const total = cart.reduce((sum, item) => sum + getItemTotal(item), 0)
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  const handleCheckout = () => {
    setShowCheckout(true)
  }

  const handlePayment = (method: "cash" | "card") => {
    setPaymentMethod(method)
    setIsProcessing(true)
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setOrderComplete(true)
    }, 3000)
  }

  const handleBackToCart = () => {
    setShowCheckout(false)
    setPaymentMethod(null)
  }

  const handleComplete = () => {
    onOrderComplete();
    onClose();
    setShowCheckout(false);
    setPaymentMethod(null);
    setIsProcessing(false);
    setOrderComplete(false);
  }

  if (orderComplete) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md max-h-[90vh] overflow-hidden">
          <CardContent className="p-6 text-center overflow-y-auto max-h-[70vh]">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">¡Pedido Confirmado!</h2>
            <p className="text-gray-600 mb-4">
              Tu pedido ha sido enviado a la cocina. Te notificaremos cuando esté listo.
            </p>
            {tableNumber && (
              <Badge variant="secondary" className="mb-4">
                {tableNumber}
              </Badge>
            )}
            {/* Mostrar detalles del pedido pagado */}
            {cart.length > 0 && (
              <div className="mb-4 text-left">
                <h3 className="font-semibold text-gray-900 mb-2">Detalles de la orden</h3>
                <div className="text-xs text-gray-500 mb-1">{new Date().toLocaleString()}</div>
                <div className="space-y-2">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="font-medium text-gray-900 text-sm">{item.name}</div>
                        <div className="text-xs text-gray-600">Cantidad: {item.quantity}</div>
                      </div>
                      <div className="font-semibold text-gray-900 text-sm">€{getItemTotal(item).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Mostrar historial de compras */}
            {paidOrders.length > 0 && (
              <div className="mb-4 text-left">
                <h3 className="font-semibold text-gray-900 mb-2">Historial de compras</h3>
                <div className="space-y-4">
                  {paidOrders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-2">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-gray-500">{new Date(order.date).toLocaleString()}</span>
                        <span className="text-xs text-gray-400">ID: {order.id.slice(-6)}</span>
                      </div>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={item.id + '-' + idx} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                            <div className="w-10 h-10 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 text-left">
                              <div className="font-medium text-gray-900 text-sm">{item.name}</div>
                              <div className="text-xs text-gray-600">Cantidad: {item.quantity}</div>
                            </div>
                            <div className="font-semibold text-gray-900 text-sm">€{getItemTotal(item).toFixed(2)}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <Button onClick={handleComplete} className="w-full bg-[#18494E] hover:bg-[#18494E]/90 text-white mt-2">
              Continuar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (showCheckout) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
        <Card className="w-full max-w-md max-h-[90vh] overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleBackToCart}>
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <CardTitle className="text-lg font-semibold">Finalizar Pedido</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4 overflow-y-auto max-h-[70vh]">
            {/* Order Summary */}
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900">Resumen del Pedido</h3>
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.name}</p>
                    {/* Opciones seleccionadas */}
                    {item.opciones && (
                      <ul className="text-xs text-gray-700 mb-1 mt-1 space-y-0.5">
                        {Object.entries(item.opciones).map(([key, value]) => (
                          <li key={key}>
                            <span className="font-semibold capitalize">{key.replace(/_/g, ' ')}:</span> {value}
                          </li>
                        ))}
                      </ul>
                    )}
                    {/* Extras seleccionados */}
                    {item.extras && item.extras.length > 0 && (
                      <div className="text-xs text-gray-700 mb-1">
                        <span className="font-semibold">Extras:</span> {item.extras.map((e: any) => e.name).join(', ')}
                      </div>
                    )}
                    {/* Salsa seleccionada */}
                    {item.salsa && (
                      <div className="text-xs text-gray-700 mb-1">
                        <span className="font-semibold">Salsa:</span> {item.salsa.name}
                      </div>
                    )}
                    <p className="text-sm text-gray-600">Cantidad: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-gray-900">€{getItemTotal(item).toFixed(2)}</p>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between items-center">
                <p className="font-semibold text-gray-900">Total</p>
                <p className="text-xl font-bold text-[#18494E]">€{total.toFixed(2)}</p>
              </div>
            </div>

            {/* Payment Methods */}
            {!paymentMethod ? (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900">Método de Pago</h3>
                <div className="space-y-2">
                  <Button
                    onClick={() => handlePayment("cash")}
                    variant="outline"
                    className="w-full justify-start h-16"
                  >
                    <DollarSign className="w-6 h-6 mr-3 text-green-500" />
                    <div className="text-left">
                      <p className="font-medium">Pagar en Efectivo</p>
                      <p className="text-sm text-gray-600">Paga al camarero cuando llegue tu pedido</p>
                    </div>
                  </Button>
                  <Button
                    onClick={() => handlePayment("card")}
                    variant="outline"
                    className="w-full justify-start h-16"
                  >
                    <CreditCard className="w-6 h-6 mr-3 text-blue-500" />
                    <div className="text-left">
                      <p className="font-medium">Pagar con Tarjeta</p>
                      <p className="text-sm text-gray-600">Pago seguro con tarjeta de crédito/débito</p>
                    </div>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-600">
                  {paymentMethod === "cash" 
                    ? "Procesando pedido..." 
                    : "Procesando pago con tarjeta..."
                  }
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={`fixed inset-0 flex items-center justify-center p-4 z-50 transition-opacity duration-300 bg-black/40 backdrop-blur-sm`}>
      <Card className="w-full max-w-md max-h-[80vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Carrito ({itemCount})
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Historial de compras */}
          {paidOrders.length > 0 && (
            <div className="mb-4 text-left">
              <h3 className="font-semibold text-gray-900 mb-2">Historial de compras</h3>
              <div className="space-y-4">
                {paidOrders.map((order) => (
                  <div key={order.id} className="border border-gray-200 rounded-lg p-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500">{new Date(order.date).toLocaleString()}</span>
                      <span className="text-xs text-gray-400">ID: {order.id.slice(-6)}</span>
                    </div>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={item.id + '-' + idx} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2">
                          <div className="w-10 h-10 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1 text-left">
                            <div className="font-medium text-gray-900 text-sm">{item.name}</div>
                            <div className="text-xs text-gray-600">Cantidad: {item.quantity}</div>
                          </div>
                          <div className="font-semibold text-gray-900 text-sm">€{getItemTotal(item).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* Carrito actual */}
          {cart.length > 0 && (
            <>
              <div className="mb-2">
                <h3 className="font-semibold text-gray-900 mb-2 text-left">Carrito</h3>
                <div className="space-y-3">
                  {cart.map((item) => (
                    <Card key={item.id} className="relative border border-gray-100 rounded-xl p-3 flex gap-3 bg-white">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRemoveItem(item.id)}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-gray-100 hover:bg-red-100 text-red-500 hover:text-red-700 flex items-center justify-center shadow-none"
                        aria-label="Eliminar"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.name}</h4>
                        {/* Opciones seleccionadas */}
                        {item.opciones && (
                          <ul className="text-xs text-gray-700 mb-1 mt-1 space-y-0.5">
                            {Object.entries(item.opciones).map(([key, value]) => (
                              <li key={key}>
                                <span className="font-semibold capitalize">{key.replace(/_/g, ' ')}:</span> {value}
                              </li>
                            ))}
                          </ul>
                        )}
                        {/* Extras seleccionados */}
                        {item.extras && item.extras.length > 0 && (
                          <div className="text-xs text-gray-700 mb-1">
                            <span className="font-semibold">Extras:</span> {item.extras.map((e: any) => e.name).join(', ')}
                          </div>
                        )}
                        {/* Salsa seleccionada */}
                        {item.salsa && (
                          <div className="text-xs text-gray-700 mb-1">
                            <span className="font-semibold">Salsa:</span> {item.salsa.name}
                          </div>
                        )}
                        <p className="text-sm text-[#18494E] font-semibold">€{getItemUnitPrice(item).toFixed(2)}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 p-0 border-[#18494E] text-[#18494E] hover:bg-[#18494E] hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 p-0 border-[#18494E] text-[#18494E] hover:bg-[#18494E] hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                <Separator />
                {/* Total and Checkout */}
                <div className="space-y-3 mt-3">
                  <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-900">Total</p>
                    <p className="text-xl font-bold text-[#18494E]">€{total.toFixed(2)}</p>
                  </div>
                  <Button onClick={handleCheckout} className="w-full bg-[#18494E] hover:bg-[#18494E]/90 text-white" size="lg">
                    Finalizar Pedido
                  </Button>
                </div>
              </div>
            </>
          )}
          {/* Si ambos están vacíos, mostrar mensaje */}
          {cart.length === 0 && paidOrders.length === 0 && (
            <div className="text-center py-8">
              <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Tu carrito está vacío</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 