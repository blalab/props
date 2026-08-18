import { useState, useEffect } from "react";
import { Plus, Star, StarOff } from "lucide-react";
import { MOCK_PROPS, PropItem } from "../lib/mock-data";
import CartSheet from "../components/cart-sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Favorites({ portfolio, org, tool }: { portfolio?: string; org?: string; tool?: string; }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [cart, setCart] = useState<(PropItem & { quantity: number })[]>([]);
  const [propsList, setPropsList] = useState<PropItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getUserSub = () => {
    const token = sessionStorage.accessToken;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sub || payload.username || "anonymous";
      } catch (e) {}
    }
    return "anonymous";
  };

  const fetchData = async () => {
    if (!portfolio || !org) return;
    setIsLoading(true);
    try {
      // Fetch props
      const resProps = await fetch(`${import.meta.env.VITE_API_URL}/_data/${portfolio}/${org}/props_items?limit=500`, {
        headers: { 'Authorization': `Bearer ${sessionStorage.accessToken}` }
      });
      if (resProps.ok) {
        const data = await resProps.json();
        setPropsList(Array.isArray(data) ? data : (data.items || []));
      }

      // Fetch favorites
      const userSub = getUserSub();
      const resFavs = await fetch(`${import.meta.env.VITE_API_URL}/_data/${portfolio}/${org}/props_favorites?limit=500`, {
        headers: { 'Authorization': `Bearer ${sessionStorage.accessToken}` }
      });
      if (resFavs.ok) {
        const data = await resFavs.json();
        const items = Array.isArray(data) ? data : (data.items || []);
        const userFavs = items.filter((f: any) => f.user_sub === userSub);
        setFavorites(userFavs.map((f: any) => f.prop_id));
      }
    } catch (e) {
      console.error("Failed to fetch data", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [portfolio, org]);

  const toggleFavorite = async (id: string) => {
    const userSub = getUserSub();
    const favId = `${userSub}_${id}`;
    
    setFavorites(prev => {
      const isFav = prev.includes(id);
      return isFav ? prev.filter(f => f !== id) : [...prev, id];
    });

    try {
      if (favorites.includes(id)) {
        // Remove
        await fetch(`${import.meta.env.VITE_API_URL}/_data/${portfolio}/${org}/props_favorites/${favId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${sessionStorage.accessToken}` }
        });
      } else {
        // Add
        await fetch(`${import.meta.env.VITE_API_URL}/_data/${portfolio}/${org}/props_favorites`, {
          method: 'POST',
          headers: { 
            'Authorization': `Bearer ${sessionStorage.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            _id: favId,
            id: favId,
            prop_id: id,
            user_sub: userSub
          })
        });
      }
    } catch (e) {
      console.error("Failed to toggle favorite", e);
    }
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

  const favoriteProps = propsList.filter((prop) => favorites.includes(prop.id));

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
              <h3 
                className="font-semibold text-primary/90 text-sm mb-1 line-clamp-1 cursor-pointer hover:underline"
                onClick={() => {
                  window.history.pushState({}, '', `/${portfolio}/${org}/${tool}/product-details?id=${prop.id}`);
                  window.dispatchEvent(new Event('popstate'));
                }}
              >
                {prop.title}
              </h3>
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
