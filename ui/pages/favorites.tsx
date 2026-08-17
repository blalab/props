import { useState, useEffect } from "react";
import { Plus, Star, StarOff } from "lucide-react";
import { MOCK_PROPS, PropItem } from "../lib/mock-data";
import CartSheet from "../components/cart-sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Favorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<(PropItem & { quantity: number })[]>([]);

  useEffect(() => {
    const storedFavs = localStorage.getItem('props_favorites');
    if (storedFavs) {
      try {
        setFavorites(JSON.parse(storedFavs));
      } catch (e) {
        console.error("Failed to parse favorites", e);
      }
    }
  }, []);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const isFav = prev.includes(id);
      const newFavs = isFav ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem('props_favorites', JSON.stringify(newFavs));
      return newFavs;
    });
  };

  const addToCart = (prop: PropItem) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === prop.id);
      if (existing) {
        return prev.map((item) =>
          item.id === prop.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...prop, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const favoriteProps = MOCK_PROPS.filter((prop) => favorites.includes(prop.id));

  return (
    <div className="flex flex-col min-h-screen w-full bg-background p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Star className="h-7 w-7 text-amber-500 fill-amber-500" />
            Starred Props
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Review the props you've starred for your projects.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <CartSheet 
            cart={cart} 
            onRemoveItem={removeFromCart} 
            onUpdateQuantity={updateQuantity} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favoriteProps.map((prop) => (
          <Card key={prop.id} className="group overflow-hidden flex flex-col border-none shadow-none hover:shadow-md transition-all bg-transparent hover:bg-card">
            <div className="relative aspect-[4/3] overflow-hidden bg-muted rounded-md mb-3">
              <img
                src={prop.image}
                alt={prop.title}
                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
              />
              {!prop.inStock && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center backdrop-blur-sm">
                  <Badge variant="outline" className="text-muted-foreground font-semibold tracking-wider uppercase">Unavailable</Badge>
                </div>
              )}
              <div className="absolute top-2 left-2 flex gap-1 z-10">
                <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm hover:bg-background/90 text-xs shadow-sm">
                  {prop.category}
                </Badge>
              </div>
              <button 
                onClick={() => toggleFavorite(prop.id)}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-background/50 backdrop-blur-md hover:bg-background/80 transition-colors shadow-sm z-20"
              >
                <Star 
                  className={`h-4 w-4 ${favorites.includes(prop.id) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground hover:text-foreground'}`} 
                />
              </button>
            </div>
            <CardContent className="p-0 flex-1">
              <h3 className="font-semibold text-primary/90 text-sm mb-1 line-clamp-1">{prop.title}</h3>
              <div className="text-xs text-muted-foreground mb-2">
                <span className="font-bold text-foreground">${prop.price}</span> — 1 for rent
              </div>
            </CardContent>
            <CardFooter className="p-0 mt-3">
              <Button 
                variant="outline"
                className="w-full text-xs h-8 border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-colors" 
                disabled={!prop.inStock}
                onClick={() => addToCart(prop)}
              >
                <Plus className="h-3 w-3 mr-1" /> Add to Project
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {favoriteProps.length === 0 && (
        <div className="flex-1 py-16 flex flex-col items-center justify-center text-muted-foreground">
          <StarOff className="h-16 w-16 mb-4 opacity-20" />
          <h2 className="text-xl font-semibold text-foreground mb-2">No starred props</h2>
          <p className="text-sm">You haven't added any props to your starred list yet.</p>
          <p className="text-sm">Browse the catalog and click the star icon to save items here.</p>
        </div>
      )}
    </div>
  );
}
