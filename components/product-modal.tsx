"use client"

import { useState, useEffect } from "react"
import { X, Plus, Minus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { menuItems } from "./menu-app";

interface ProductOptionChoice {
  id: string;
  name: string;
  image?: string; // Added image property
}
interface ProductOption {
  label: string;
  required: boolean;
  choices: ProductOptionChoice[];
}
type ProductOptionsMap = Record<string, ProductOption>;

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  rating: number;
  prepTime: string;
  [key: string]: any;
}

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product, size?: string, quantity?: number) => void;
}

// Opciones por producto
const OPCIONES_PRODUCTO: Record<string, ProductOptionsMap> = {
  Empanada: {
    relleno: {
      label: "Elige el relleno",
      required: true,
      choices: [
        { id: "rindfleisch", name: "Rindfleisch (Carne de res)", image: "/menu/empanada.png" },
        { id: "hähnchen", name: "Hähnchen (Pollo)", image: "/menu/empanada.png" },
        { id: "soja", name: "Soja-Hack (Vegano)", image: "/menu/empanada.png" },
        { id: "spinat", name: "Spinat & veganer Frischkäse", image: "/menu/empanada.png" },
      ],
    },
  },
  Arepa: {
    relleno: {
      label: "Elige el relleno",
      required: true,
      choices: [
        { id: "pollo", name: "Pulled Hähnchen (Pollo)", image: "/menu/arepa.png" },
        { id: "rindfleisch", name: "Pulled Rindfleisch (Carne de res)", image: "/menu/arepa.png" },
        { id: "soja", name: "Soja-Hack (Vegano)", image: "/menu/arepa.png" },
        { id: "schafskäse", name: "Schafskäse & Cherrytomaten", image: "/menu/arepa.png" },
      ],
    },
  },
  "Patacon Tropicano": {
    topping: {
      label: "Elige el topping",
      required: true,
      choices: [
        { id: "rindfleisch", name: "Guacamole + Pulled Rindfleisch", image: "/menu/pataconTropicano.png" },
        { id: "hähnchen", name: "Guacamole + Pulled Hähnchen", image: "/menu/pataconTropicano.png" },
        { id: "soja", name: "Guacamole + Soja-Hack (Vegano)", image: "/menu/pataconTropicano.png" },
      ],
    },
  },
  "Longaniza & Auswahl": {
    guarnicion: {
      label: "Elige la guarnición",
      required: true,
      choices: [
        { id: "papacriolla", name: "Papa Criolla", image: "/menu/papacriolla.png" },
        { id: "yucafrita", name: "Yuca frita", image: "/menu/zucafrita.png" },
        { id: "boniatos", name: "Boniatos fritos", image: "/menu/boniatos.png" },
      ],
    },
  },
  Salchipapa: {
    roestzwiebeln: {
      label: "¿Con Röstzwiebeln?",
      required: false,
      choices: [
        { id: "si", name: "Sí", image: "/menu/salchipapa.png" },
        { id: "no", name: "No", image: "/menu/salchipapa.png" },
      ],
    },
  },
  Salchiyuca: {
    roestzwiebeln: {
      label: "¿Con Röstzwiebeln?",
      required: false,
      choices: [
        { id: "si", name: "Sí", image: "/menu/salchiyuca.png" },
        { id: "no", name: "No", image: "/menu/salchiyuca.png" },
      ],
    },
  },
  Salchiboniato: {
    roestzwiebeln: {
      label: "¿Con Röstzwiebeln?",
      required: false,
      choices: [
        { id: "si", name: "Sí", image: "/menu/salchiboniato.png" },
        { id: "no", name: "No", image: "/menu/salchiboniato.png" },
      ],
    },
  },
  "Picada La Tropicana": {
    salsaextra: {
      label: "Elige salsa extra",
      required: false,
      choices: [
        { id: "aji", name: "Ají", image: "/menu/aji.png" },
        { id: "guacamole", name: "Guacamole", image: "/menu/guacamole.png" },
        { id: "mojopiconrojo", name: "Mojo Picon rojo", image: "/menu/mojopiconrojo.png" },
      ],
    },
  },
};

export function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  const [fadeIn, setFadeIn] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [opciones, setOpciones] = useState<Record<string, string>>({});
  const [selectedExtras, setSelectedExtras] = useState<number[]>([]);
  const [selectedSalsas, setSelectedSalsas] = useState<number | null>(null);

  // Get extras and salsas from menuItems
  const extrasList: Product[] = menuItems.extras || [];
  const salsasList: Product[] = menuItems.salsas || [];

  // Detect if product is a drink
  const isDrink =
    (menuItems.drinks && menuItems.drinks.some((d: Product) => d.id === product.id)) ||
    (menuItems.alcohol && menuItems.alcohol.some((d: Product) => d.id === product.id));

  useEffect(() => {
    setFadeIn(true);
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${window.scrollY}px`;
    document.body.style.width = '100%';
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      window.scrollTo(0, window.scrollY);
    };
  }, []);

  // Opciones para este producto
  const opcionesProducto: ProductOptionsMap | undefined = OPCIONES_PRODUCTO[product.name];

  const handleOpcion = (key: string, value: string) => {
    setOpciones((prev) => ({ ...prev, [key]: value }));
  };

  const handleExtraToggle = (id: number) => {
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((eid: number) => eid !== id) : [...prev, id]
    );
  };
  const handleSalsaSelect = (id: number) => {
    setSelectedSalsas(id);
  };

  const getCurrentPrice = () => {
    let price = product.price;
    // Sum extras
    price += selectedExtras.reduce((sum: number, eid: number) => {
      const extra = extrasList.find((e: Product) => e.id === eid);
      return sum + (extra ? extra.price : 0);
    }, 0);
    // Sum salsa
    if (selectedSalsas) {
      const salsa = salsasList.find((s: Product) => s.id === selectedSalsas);
      price += salsa ? salsa.price : 0;
    }
    return price;
  };

  const handleAddToOrder = () => {
    const extras = extrasList.filter((e: Product) => selectedExtras.includes(e.id));
    const salsa = salsasList.find((s: Product) => s.id === selectedSalsas) || null;
    onAddToCart({ ...product, opciones, extras, salsa }, undefined, quantity);
    onClose();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        fadeIn ? 'opacity-100 bg-black/50 backdrop-blur-sm' : 'opacity-0 bg-black/0'
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden transition-all duration-300 ${
          fadeIn ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
        }`}
      >
        {/* Header with close button */}
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
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-black border-0 p-0 shadow-lg"
            size="sm"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Scrollable content */}
        <div className="max-h-[calc(80vh-16rem)] overflow-y-auto apple-scrollbar">
          <div className="p-6 space-y-6">
            {/* Product Info */}
            <div>
              <h2 className="text-2xl font-bold text-black mb-2">{product.name}</h2>
              <p className="text-gray-800 text-sm mb-4">{product.description}</p>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-[#18494E]">€ {getCurrentPrice().toFixed(2)}</span>
                {product.rating >= 4.8 && (
                  <div className="inline-flex items-center bg-[#18494E] text-white text-xs px-2 py-1 rounded-full">
                    ⭐ POPULAR
                  </div>
                )}
              </div>
            </div>

            {/* Opciones dinámicas */}
            {opcionesProducto && (
              <div className="space-y-4">
                {Object.entries(opcionesProducto).map(([key, opcion]) => (
                  <div key={key}>
                    <h3 className="text-black text-lg font-semibold mb-2">{opcion.label}</h3>
                    <div className="flex flex-col gap-2">
                      {opcion.choices.map((choice) => (
                        <div
                          key={choice.id}
                          className={`flex items-center border rounded-lg p-2 gap-3 shadow-sm transition-all bg-white hover:bg-gray-50 cursor-pointer ${opciones[key] === choice.id ? 'border-[#18494E] bg-[#18494E]/10' : 'border-gray-200'}`}
                          onClick={() => handleOpcion(key, choice.id)}
                        >
                          <img src={choice.image} alt={choice.name} className="w-12 h-12 object-cover rounded-md" />
                          <div className="flex-1">
                            <div className="font-medium text-sm text-black">{choice.name}</div>
                          </div>
                          <input type="radio" checked={opciones[key] === choice.id} readOnly className="accent-[#18494E]" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Extras as cards */}
            {!isDrink && (
              <div>
                <h3 className="text-black text-lg font-semibold mb-2">Extras</h3>
                <div className="flex flex-col gap-2">
                  {extrasList.map((extra: Product) => (
                    <div
                      key={extra.id}
                      className={`flex items-center border rounded-lg p-2 gap-3 shadow-sm transition-all bg-white hover:bg-gray-50 cursor-pointer ${selectedExtras.includes(extra.id) ? 'border-[#18494E] bg-[#18494E]/10' : 'border-gray-200'}`}
                      onClick={() => handleExtraToggle(extra.id)}
                    >
                      <img src={extra.image} alt={extra.name} className="w-12 h-12 object-cover rounded-md" />
                      <div className="flex-1">
                        <div className="font-medium text-sm text-black">{extra.name}</div>
                        <div className="text-xs text-gray-500">{extra.description}</div>
                      </div>
                      <div className="font-semibold text-sm text-[#18494E]">€ {extra.price.toFixed(2)}</div>
                      <input type="checkbox" checked={selectedExtras.includes(extra.id)} readOnly className="accent-[#18494E]" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Salsas as cards */}
            {!isDrink && (
              <div>
                <h3 className="text-black text-lg font-semibold mb-2">Salsas</h3>
                <div className="flex flex-col gap-2">
                  {salsasList.map((salsa: Product) => (
                    <div
                      key={salsa.id}
                      className={`flex items-center border rounded-lg p-2 gap-3 shadow-sm transition-all bg-white hover:bg-gray-50 cursor-pointer ${selectedSalsas === salsa.id ? 'border-[#18494E] bg-[#18494E]/10' : 'border-gray-200'}`}
                      onClick={() => handleSalsaSelect(salsa.id)}
                    >
                      <img src={salsa.image} alt={salsa.name} className="w-12 h-12 object-cover rounded-md" />
                      <div className="flex-1">
                        <div className="font-medium text-sm text-black">{salsa.name}</div>
                        <div className="text-xs text-gray-500">{salsa.description}</div>
                      </div>
                      <div className="font-semibold text-sm text-[#18494E]">€ {salsa.price.toFixed(2)}</div>
                      <input type="radio" checked={selectedSalsas === salsa.id} readOnly className="accent-[#18494E]" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity controls and add to cart button */}
            <div className="flex items-center gap-4 mt-6">
              <div className="flex items-center bg-gray-100 rounded-lg">
                <Button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 bg-transparent hover:bg-gray-200 text-black border-0"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-black font-semibold px-4 min-w-[2rem] text-center">{quantity}</span>
                <Button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 bg-transparent hover:bg-gray-200 text-black border-0"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              <Button
                onClick={handleAddToOrder}
                className="flex-1 bg-[#18494E] hover:bg-[#18494E]/90 text-white font-semibold h-12 rounded-[5px] text-lg"
              >
                Añadir € {(getCurrentPrice() * quantity).toFixed(2)}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 