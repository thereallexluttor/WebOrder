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
  { id: "speisen", name: "Speisen", icon: "🍽️" },
  { id: "extras", name: "Extras", icon: "✨" },
  { id: "salsas", name: "Salsas", icon: "🥣" },
  { id: "desserts", name: "Postres / Desserts", icon: "🍮" },
  { id: "drinks", name: "Kalte Getränke", icon: "🥤" },
  { id: "alcohol", name: "Alkoholische Getränke", icon: "🍷" },
]

export const menuItems = {
  speisen: [
    {
      id: 1,
      name: "Empanada",
      description: "Eine kleine frittierte Teigtasche aus Mais mit Füllung und Salsa nach Wahl. Auswahl aus besonders zubereitetem Rindfleisch, Hähnchen, Veganem Soja-Hack oder Spinat mit veganem Frischkäse.",
      price: 4.9,
      image: "/menu/empanada.png",
      rating: 4.8,
      prepTime: "10 min",
    },
    {
      id: 2,
      name: "Arepa",
      description: "Runder Maisfladen mit Füllung und Salsa nach Wahl. Auswahl aus pulled Hähnchen, pulled Rindfleisch, Veganem Soja-Hack oder Schafskäse mit Cherrytomaten.",
      price: 9.5,
      image: "/menu/arepa.png",
      rating: 4.7,
      prepTime: "12 min",
    },
    {
      id: 3,
      name: "Patacon Tropicano",
      description: "Frittierte Kochbanane (grün und herzhaft) zubereitet mit Guacamole und pulled Rindfleisch, pulled Hähnchen oder veganem Soja-Hack.",
      price: 19.9,
      image: "/menu/pataconTropicano.png",
      rating: 4.9,
      prepTime: "15 min",
    },
    {
      id: 4,
      name: "Longaniza",
      description: "Kolumbianische luftgetrocknete Rohwurstspezialität aus Schweinefleisch, eine exquisit gewürzte und hausgemachte Delikatesse leicht pikant.",
      price: 19.9,
      image: "/menu/longaniza.png",
      rating: 4.7,
      prepTime: "15 min",
    },
    {
      id: 5,
      name: "Longaniza & Auswahl",
      description: "Nach traditioneller Art: Longaniza angerichtet mit der Wahl aus Papa Criolla, Yuca frita oder Boniatos fritos.",
      price: 25.9,
      image: "/menu/longaniza.png",
      rating: 4.8,
      prepTime: "18 min",
    },
    {
      id: 6,
      name: "Papa Criolla",
      description: "Eine kleine, gelbe Kartoffelsorte aus Kolumbien. Auch bekannt als 'Praline unter den Kartoffeln'. Sie zeichnet sich durch ihre weiche, buttrige Textur und ihren einzigartigen Geschmack aus.",
      price: 7.5,
      image: "/menu/papacriolla.png",
      rating: 4.6,
      prepTime: "8 min",
    },
    {
      id: 7,
      name: "Yuca Frita",
      description: "Knusprig frittierte Maniok-Wurzeln, außen goldbraun und innen zart und cremig. Eine tropische und einzigartige Beilage.",
      price: 7.5,
      image: "/menu/zucafrita.png",
      rating: 4.6,
      prepTime: "8 min",
    },
    {
      id: 8,
      name: "Boniatos fritos",
      description: "Frittierte Süßkartoffelpommes welche natürliche Süße und zarte Textur vereinen.",
      price: 7.5,
      image: "/menu/boniatos.png",
      rating: 4.6,
      prepTime: "8 min",
    },
    {
      id: 9,
      name: "Salchipapa",
      description: "Eine Kombination aus den Papa Criollas und herzhaften Hähnchenwürstchen. Bei Wunsch inklusive Röstzwiebeln.",
      price: 11.5,
      image: "/menu/salchipapa.png",
      rating: 4.7,
      prepTime: "10 min",
    },
    {
      id: 10,
      name: "Salchiyuca",
      description: "Eine Kombination aus den Yuca Fritas und herzhaften Hähnchenwürstchen. Bei Wunsch inklusive Röstzwiebeln.",
      price: 11.5,
      image: "/menu/salchiyuca.png",
      rating: 4.7,
      prepTime: "10 min",
    },
    {
      id: 11,
      name: "Salchiboniato",
      description: "Eine Kombination aus den Boniatos fritos und herzhaften Hähnchenwürstchen. Bei Wunsch inklusive Röstzwiebeln.",
      price: 11.5,
      image: "/menu/salchiboniato.png",
      rating: 4.7,
      prepTime: "10 min",
    },
    {
      id: 12,
      name: "Picada La Tropicana",
      description: "Ein kolumbianischer Streetfood-Teller für 1 Person mit einer verlockenden Auswahl an verschiedenen frittierten Fleischsorten, darunter zartes Rindfleisch, herzhafte Hähnchenwürstchen und würzige Sucuk. Begleitet werden sie von knusprigen Pataconsitos (frittierte grüne Kochbananen) und Arepitas (kleine Maisfladen), die eine perfekte Ergänzung zu diesem vielseitigen Gericht bilden.",
      price: 24.9,
      image: "/menu/picadalatropicana.png",
      rating: 4.9,
      prepTime: "20 min",
    },
  ],
  extras: [
    {
      id: 13,
      name: "Pataconsitos",
      description: "3 kleine Knusprig frittierte Scheiben aus grünen Kochbananen",
      price: 2.9,
      image: "/menu/pataconcitos.png",
      rating: 4.5,
      prepTime: "5 min",
    },
    {
      id: 14,
      name: "Arepitas",
      description: "2 kleine hausgemachte, runde Maisfladen aus Maismehl",
      price: 3.5,
      image: "/menu/arepitas.png",
      rating: 4.5,
      prepTime: "5 min",
    },
    {
      id: 15,
      name: "Chicharron",
      description: "Knusprig frittierter Schweinebauch, der traditionell in der Picada und weiteren kolumbianischen Gerichten serviert wird.",
      price: 4.9,
      image: "/menu/chicharron.png",
      rating: 4.6,
      prepTime: "6 min",
    },
    {
      id: 16,
      name: "Geriebener Schafskäse",
      description: "",
      price: 2.5,
      image: "/menu/queso costeno.png",
      rating: 4.5,
      prepTime: "2 min",
    },
    {
      id: 17,
      name: "Geriebener Gouda",
      description: "",
      price: 2.5,
      image: "/menu/gouda.png",
      rating: 4.5,
      prepTime: "2 min",
    },
  ],
  salsas: [
    {
      id: 18,
      name: "Aji",
      description: "Traditionelle, pikante Salsa aus Kolumbien, zubereitet aus frischen Zutaten",
      price: 2.5,
      image: "/menu/aji.png",
      rating: 4.5,
      prepTime: "2 min",
    },
    {
      id: 19,
      name: "Mango",
      description: "Leicht süß, säuerliche Salsa aus Mango",
      price: 2.5,
      image: "/menu/mango.png",
      rating: 4.5,
      prepTime: "2 min",
    },
    {
      id: 20,
      name: "Rosa Tropicana",
      description: "Fein gewürzte Cocktailsalsa mit Burger-Salsa-Charme",
      price: 2.5,
      image: "/menu/rosa.png",
      rating: 4.5,
      prepTime: "2 min",
    },
    {
      id: 21,
      name: "Mojo Picon rojo",
      description: "Traditionelle, pikante Knoblauchsalsa mit roter Paprika aus den kanarischen Inseln ( Pikant )",
      price: 2.5,
      image: "/menu/mojopiconrojo.png",
      rating: 4.5,
      prepTime: "2 min",
    },
    {
      id: 22,
      name: "Mojo Picon verde",
      description: "Traditionelle Knoblauchsalsa mit grüner Paprika aus den kanarischen Inseln. (Nicht pikant)",
      price: 2.5,
      image: "/menu/mojopiconverde.png",
      rating: 4.5,
      prepTime: "2 min",
    },
    {
      id: 23,
      name: "Guacamole",
      description: "",
      price: 3.5,
      image: "/menu/guacamole.png",
      rating: 4.7,
      prepTime: "3 min",
    },
  ],
  desserts: [
    {
      id: 24,
      name: "Churros",
      description: "Mit geschmolzener Churros-Schokolade, Zimt und Zucker",
      price: 8.5,
      image: "/menu/churros.png",
      rating: 4.8,
      prepTime: "10 min",
    },
    {
      id: 25,
      name: "2 Pan de Bono",
      description: "Traditionelles Gebäck aus Kolumbien mit Käse gebacken",
      price: 7.5,
      image: "/menu/pandebono.png",
      rating: 4.7,
      prepTime: "8 min",
    },
    {
      id: 26,
      name: "2 Buñuelos",
      description: "",
      price: 7.5,
      image: "/menu/bunuelos.png",
      rating: 4.7,
      prepTime: "8 min",
    },
    {
      id: 27,
      name: "Manjar blanco",
      description: "Eine traditionelle kolumbianische Karamellcreme, zubereitet aus Milch, Zucker und Vanille. Diese samtige Süßspeise wird mit kolumbianischen Salzkeksen serviert und bietet eine Balance aus süß und salzig. Nach Wahl und 1 € Aufpreis auch mit geschmolzener Schokolade serviert.",
      price: 4.9,
      image: "/menu/manjarblanco.png",
      rating: 4.7,
      prepTime: "8 min",
    },
  ],
  drinks: [
    {
      id: 28,
      name: "Wasser/Viva con Agua",
      description: "",
      price: 2.9,
      image: "/menu/vivaconagua.png",
      rating: 4.5,
      prepTime: "1 min",
    },
    {
      id: 29,
      name: "Coca Cola",
      description: "",
      price: 3.9,
      image: "/menu/cocacola.png",
      rating: 4.5,
      prepTime: "1 min",
    },
    {
      id: 30,
      name: "Colombiana",
      description: "",
      price: 4.9,
      image: "/menu/colombiana.png",
      rating: 4.5,
      prepTime: "1 min",
    },
    {
      id: 31,
      name: "Coca Cola Zero",
      description: "",
      price: 3.9,
      image: "/menu/cocacolazero.png",
      rating: 4.5,
      prepTime: "1 min",
    },
    {
      id: 32,
      name: "Postobon Uva",
      description: "",
      price: 4.9,
      image: "/menu/postobonuva.png",
      rating: 4.5,
      prepTime: "1 min",
    },
  ],
  alcohol: [
    {
      id: 33,
      name: "Club Colombia",
      description: "",
      price: 4.9,
      image: "/menu/clubcolombia.png",
      rating: 4.5,
      prepTime: "2 min",
    },
    {
      id: 34,
      name: "Desperados",
      description: "",
      price: 3.8,
      image: "/menu/desperado.png",
      rating: 4.5,
      prepTime: "2 min",
    },
    {
      id: 35,
      name: "Heineken",
      description: "",
      price: 3.6,
      image: "/menu/heineken.png",
      rating: 4.5,
      prepTime: "2 min",
    },
    {
      id: 36,
      name: "Karibik Rum",
      description: "",
      price: 4.9,
      image: "/menu/karibikrum.png",
      rating: 4.5,
      prepTime: "2 min",
    },
    {
      id: 37,
      name: "Brisa Blanca (Weißwein, Glas 0,2L)",
      description: "WEIßWEIN, halbtrocken, erfrischend wie der sanfte Hauch einer Sommerbrise, mit einem bleibenden Aroma von Citrusfrüchten und der Süße von Bartholomeosbirnen.",
      price: 7.5,
      image: "/menu/brisablanca.png",
      rating: 4.7,
      prepTime: "2 min",
    },
    {
      id: 38,
      name: "Brisa Blanca (Weißwein, Flasche 0,75L Vorort)",
      description: "",
      price: 23.5,
      image: "/menu/brisablanca.png",
      rating: 4.7,
      prepTime: "2 min",
    },
    {
      id: 39,
      name: "Brisa Blanca (Weißwein, Flasche 0,75L Mitnehmen)",
      description: "",
      price: 19.8,
      image: "/menu/brisablanca.png",
      rating: 4.7,
      prepTime: "2 min",
    },
    {
      id: 40,
      name: "Rio Rosada (Roséwein, Glas 0,2L)",
      description: "ROSÉWEIN, halbtrocken, erfrischend und tropisch wie ein Salsatanz unter funkelnden Sonnenstrahlen. Sein fruchtiges Aroma versprüht lebhafte Freude und belebt den Gaumen mit jeder rosigen Note.",
      price: 7.5,
      image: "/menu/riorosada.png",
      rating: 4.7,
      prepTime: "2 min",
    },
    {
      id: 41,
      name: "Tinto Tropical (Rotwein, Glas 0,2L)",
      description: "ROTWEIN, halbtrocken und verlockend wie ein exotischer Sonnenuntergang unter Palmen, mit einem Aroma von tropischen roten Früchten, Vanille und einem geschmeidigen Geschmack.",
      price: 7.5,
      image: "/menu/tintotropical.png",
      rating: 4.7,
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
  const [selectedCategory, setSelectedCategory] = useState("speisen")
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showWaiterCall, setShowWaiterCall] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  // Change paidOrders to store more details: id, date, items
  type PaidOrder = {
    id: string;
    date: string;
    items: CartItem[];
  };
  const [paidOrders, setPaidOrders] = useState<PaidOrder[]>([]);
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const categoryScrollContainerRef = useRef<HTMLDivElement>(null);
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

  // Handler to complete order: move cart to paidOrders and empty cart
  const handleOrderComplete = () => {
    if (cart.length > 0) {
      const newOrder = {
        id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
        date: new Date().toISOString(),
        items: cart.map(item => ({ ...item })),
      };
      setPaidOrders(prev => [...prev, newOrder]);
      setCart([]);
    }
  };

  // Scroll detection for category switching
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout | null = null;
    
    const handleScroll = () => {
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
      
      scrollTimeout = setTimeout(() => {
        const scrollPosition = window.scrollY + 250; // Increased offset for better detection
        let currentCategory = "speisen";
        let minDistance = Infinity;

      Object.entries(categoryRefs.current).forEach(([categoryId, element]) => {
        if (element) {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top + window.scrollY;
            const distance = Math.abs(scrollPosition - elementTop);
            
            // Find the closest category to current scroll position
            if (distance < minDistance && scrollPosition >= elementTop - 100) {
              minDistance = distance;
              currentCategory = categoryId;
            }
          }
        });

        setSelectedCategory(currentCategory);
      }, 50); // Debounce with 50ms delay
    };

    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (scrollTimeout) {
        clearTimeout(scrollTimeout);
      }
    };
  }, []);

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
      
      // If it's the first category, scroll to the beginning
      if (selectedCategory === "speisen") {
        scrollContainer.scrollTo({
          left: 0,
          behavior: 'smooth',
        });
      } else {
        // For other categories, center them
      const buttonCenter = buttonRect.left + buttonRect.width / 2;
      const containerCenter = containerRect.left + containerRect.width / 2;
      const offset = buttonCenter - containerCenter;
      scrollContainer.scrollBy({
        left: offset,
        behavior: 'smooth',
      });
      }
    }
  }, [selectedCategory]);

  // Persist paidOrders in Cache API (better for mobile)
  const savePaidOrdersToCache = async (orders: PaidOrder[]) => {
    try {
      const cache = await caches.open('restaurant-orders-v1');
      const response = new Response(JSON.stringify(orders), {
        headers: { 'Content-Type': 'application/json' }
      });
      await cache.put('/paid-orders', response);
    } catch (error) {
      console.error('Error saving to cache:', error);
      // Fallback to localStorage
      localStorage.setItem('paidOrders', JSON.stringify(orders));
    }
  };

  const loadPaidOrdersFromCache = async (): Promise<PaidOrder[]> => {
    try {
      const cache = await caches.open('restaurant-orders-v1');
      const response = await cache.match('/paid-orders');
      if (response) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.error('Error loading from cache:', error);
      // Fallback to localStorage
      const stored = localStorage.getItem('paidOrders');
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {}
      }
    }
    return [];
  };

  useEffect(() => {
    loadPaidOrdersFromCache().then(orders => {
      setPaidOrders(orders);
    });
  }, []);

  useEffect(() => {
    if (paidOrders.length > 0) {
      savePaidOrdersToCache(paidOrders);
    }
  }, [paidOrders]);


  return (
    <div className="min-h-screen bg-white font-[Helvetica Neue]">
      {/* Header */}
      <div
        className="sticky top-0 z-20 bg-[#18494E] border-b border-white/20 shadow-sm"
      >
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center">
                <img 
                  src="/logo.png" 
                  alt="La Tropicana Logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold" style={{ color: '#FFB25C' }}>La Tropicana</h1>
                <p className="text-xs" style={{ color: '#FFB25C' }}>Comida Colombiana Auténtica</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={() => setShowCart(true)}
                className="relative bg-[#18494E] hover:bg-[#18494E]/90 rounded-full w-10 h-10 flex items-center justify-center border border-white/70"
                size="sm"
              >
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 text-xs flex items-center justify-center bg-black text-white">
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
        <div
  className="
    sticky top-[64px] z-10 h-12 flex items-end
    bg-gradient-to-r from-white/40 via-white/30 to-white/40
    backdrop-blur-lg
    border-b border-white/30
    shadow-lg
    mt-0
  "
>
  <div className="w-full overflow-x-auto scrollbar-hide" ref={categoryScrollContainerRef}>
            <div className="flex items-end justify-start px-6 min-w-max h-full pb-1">
              {categories.map((category, index) => (
                <div key={category.id} className="relative">
                <Button
                  data-category={category.id}
                    variant="ghost"
                    className={`
                      relative flex items-center gap-3 px-6 py-3 mx-1 text-sm font-medium
                      whitespace-nowrap transition-all duration-300 ease-out
                      ${selectedCategory === category.id 
                        ? "text-[#18494E]" 
                        : "text-gray-600"
                      }
                      rounded-full border-0 min-h-[44px] bg-transparent
                      focus:outline-none focus:ring-0 focus:bg-transparent active:bg-transparent
                      hover:bg-transparent hover:text-gray-600
                    `}
                  onClick={() => scrollToCategory(category.id)}
                >
                    <span className="text-lg" style={{ position: 'relative', top: '10px' }}>{category.icon}</span>
                    <span className="font-medium tracking-wide relative" style={{ position: 'relative', top: '10px', fontFamily: 'Helvetica Neue' }}>
                  {category.name}
                      {selectedCategory === category.id && (
                        <span className="block absolute left-1/2 -translate-x-1/2 bottom-[-6px] w-8 h-0.5 bg-[#18494E] rounded-full transition-all duration-300" />
                      )}
                    </span>
                </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="p-4">
          {categories.map((category, idx) => (
            <div key={category.id} ref={(el) => { categoryRefs.current[category.id] = el }}>
              <h2 className="text-2xl font-bold text-black mb-4 mt-8 first:mt-0">
                <span className="mr-2 align-middle">{category.icon}</span>{category.name}
              </h2>
              <div className="grid gap-4">
                {menuItems[category.id as keyof typeof menuItems]?.map((item) => (
                  <Card key={item.id} className="overflow-hidden bg-white border-gray-100 rounded-xl cursor-pointer" onClick={() => setSelectedProduct(item)}>
                    <CardContent className="p-0">
                      <div className="flex gap-3 p-3 items-center">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <div className="flex-1 min-w-0">
                              <h3 className="font-normal text-black text-base mb-1" style={{ fontFamily: 'Helvetica Neue', fontWeight: 500 }}>{item.name}</h3>
                              {/* Removed description here */}
                              <div className="flex items-center gap-2 mt-1">
                                <div className="text-base font-normal text-black">€{item.price}</div>
                              {item.rating >= 4.8 && (
                                  <div className="inline-flex items-center bg-blue-500 text-white text-[9px] px-2 py-1 rounded-full">
                                  ⭐ POPULAR
                                </div>
                              )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center mt-2">
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                <span>{item.rating}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{item.prepTime}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="w-24 h-24 bg-gray-100 rounded-xl overflow-hidden relative">
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
              <div style={{ height: idx === categories.length - 1 ? 105 : 35 }} />
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
          paidOrders={paidOrders}
          onOrderComplete={handleOrderComplete}
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
