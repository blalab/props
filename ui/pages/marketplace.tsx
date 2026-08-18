import { useState, useMemo, useEffect } from "react";
import { Plus, Search, ChevronRight, Star } from "lucide-react";

import { CATEGORY_TREE, PropItem, MOCK_PROPS } from "../lib/mock-data";
import CartSheet from "../components/cart-sheet";
import ProductDetails from "./product-details";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 8;

export default function Marketplace({ portfolio, org, tool, detailId, initialCategory }: { portfolio?: string; org?: string; tool?: string; detailId?: string; initialCategory?: string }) {
  const [selectedDetailId, setSelectedDetailId] = useState<string | null>(detailId || null);

  useEffect(() => {
    setSelectedDetailId(detailId || null);
  }, [detailId]);

  const [activeCategory, setActiveCategory] = useState<string | null>(initialCategory || null);
  const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<string[]>([]);
  
  const [cart, setCart] = useState<(PropItem & { quantity: number })[]>([]);
  
  const [propsList, setPropsList] = useState<PropItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const seedProps = async () => {
    if (!portfolio || !org) return;
    setIsLoading(true);
    try {
      for (const prop of propsList) {
        try {
          const idToDelete = (prop as any)._id || prop.id;
          await fetch(`${import.meta.env.VITE_API_URL}/_data/${portfolio}/${org}/props_items/${idToDelete}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${sessionStorage.accessToken}` }
          });
        } catch (e) {
          console.error('Failed to delete item', e);
        }
      }

      for (const prop of MOCK_PROPS) {
        const payload = { ...prop, _id: prop.id };
        await fetch(`${import.meta.env.VITE_API_URL}/_data/${portfolio}/${org}/props_items`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${sessionStorage.accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });
      }
      await fetchProps(); // Reload after seeding
    } catch (e) {
      console.error('Error seeding props:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch props from API
  const fetchProps = async () => {
    if (!portfolio || !org) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/_data/${portfolio}/${org}/props_items?limit=250`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${sessionStorage.accessToken}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setPropsList(Array.isArray(data) ? data : data.items || []);
      } else {
        console.error('Failed to fetch props');
        setPropsList([]); // DB is empty or failed
      }
    } catch (e) {
      console.error('Error fetching props:', e);
      setPropsList([]); // fallback a vacío
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchProps();
  }, [portfolio, org]);



  // Derived state for filtering
  const filteredProps = useMemo(() => {
    return propsList.filter((prop) => {
      const matchesCategory = activeCategory ? prop.category === activeCategory : true;
      const matchesSubcategory = activeSubcategory ? prop.subcategory === activeSubcategory : true;
      const matchesSearch = prop.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (prop.tags && prop.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesCategory && matchesSubcategory && matchesSearch;
    });
  }, [activeCategory, activeSubcategory, searchQuery, propsList]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProps.length / ITEMS_PER_PAGE);
  const currentItems = filteredProps.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handlers
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryClick = (cat: string) => {
    if (selectedDetailId) {
      setSelectedDetailId(null);
      window.history.pushState({}, '', `/${portfolio}/${org}/${tool}/dashboard`);
    }
    if (activeCategory === cat) {
      setActiveCategory(null);
      setActiveSubcategory(null);
    } else {
      setActiveCategory(cat);
      setActiveSubcategory(null);
    }
    setCurrentPage(1);
  };

  const handleSubcategoryClick = (cat: string, sub: string) => {
    if (selectedDetailId) {
      setSelectedDetailId(null);
      window.history.pushState({}, '', `/${portfolio}/${org}/${tool}/dashboard`);
    }
    setActiveCategory(cat);
    setActiveSubcategory(sub);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

  return (
    <div className="flex flex-col min-h-screen w-full bg-background">
      {/* Top Header */}
      <div className="sticky top-0 z-20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">Acme Prop Rentals</h1>
            <Button variant="outline" size="sm" onClick={seedProps} disabled={isLoading} className="h-7 text-[10px] uppercase tracking-wider hidden sm:flex">
               {isLoading ? "Updating..." : "Force Cache Sync"}
            </Button>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            Browse and request items for your upcoming sets.
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search prop catalog..."
              className="pl-8 bg-background"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <CartSheet 
            cart={cart} 
            onRemoveItem={removeFromCart} 
            onUpdateQuantity={updateQuantity} 
          />
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="flex flex-1 flex-col md:flex-row">
        
        {/* Left Sidebar (Textual Categories) */}
        <aside className="w-full md:w-64 shrink-0 border-r p-6 overflow-y-auto">
          <h2 className="font-semibold mb-4 text-lg">Categories</h2>
          <div className="space-y-4">
            {CATEGORY_TREE.map((category) => {
              const isCatActive = activeCategory === category.name;
              return (
                <div key={category.name} className="flex flex-col">
                  <button
                    onClick={() => handleCategoryClick(category.name)}
                    className={`flex items-center justify-between py-1.5 text-sm font-medium transition-colors hover:text-primary ${
                      isCatActive ? "text-primary font-bold" : "text-muted-foreground"
                    }`}
                  >
                    {category.name}
                    {isCatActive && <ChevronRight className="h-4 w-4" />}
                  </button>
                  
                  {isCatActive && (
                    <div className="ml-4 mt-1 flex flex-col space-y-1.5 border-l-2 pl-3">
                      {category.subcategories.map((sub) => {
                        const isSubActive = activeSubcategory === sub;
                        return (
                          <button
                            key={sub}
                            onClick={() => handleSubcategoryClick(category.name, sub)}
                            className={`text-left text-xs transition-colors hover:text-primary ${
                              isSubActive ? "text-primary font-bold" : "text-muted-foreground"
                            }`}
                          >
                            {sub}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          <Button 
            variant="outline" 
            className="w-full mt-8"
            onClick={() => {
              setActiveCategory(null);
              setActiveSubcategory(null);
              setSearchQuery("");
              setCurrentPage(1);
            }}
          >
            Clear Filters
          </Button>
        </aside>

        {/* Right Grid */}
        <main className="flex-1 p-6 flex flex-col">
          {selectedDetailId ? (
            <ProductDetails 
               propItem={propsList.find(p => p.id === selectedDetailId) || null} 
               isLoading={isLoading}
               onBack={() => {
                 setSelectedDetailId(null);
                 window.history.pushState({}, '', `/${portfolio}/${org}/${tool}/dashboard`);
               }} 
               onAddToCart={addToCart} 
            />
          ) : (
            <>
              {/* Active Filters Display */}
              {(activeCategory || activeSubcategory || searchQuery) && (
                <div className="flex flex-wrap items-center gap-2 mb-6">
                  <span className="text-sm font-medium text-muted-foreground">Showing results for:</span>
                  {activeCategory && (
                    <Badge variant="secondary" className="px-3 py-1 bg-accent/10 text-accent">
                      {activeCategory}
                    </Badge>
                  )}
                  {activeSubcategory && (
                    <Badge variant="secondary" className="px-3 py-1 bg-accent/10 text-accent">
                      {activeSubcategory}
                    </Badge>
                  )}
                  {searchQuery && (
                    <Badge variant="outline" className="px-3 py-1">
                      "{searchQuery}"
                    </Badge>
                  )}
                </div>
              )}

              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {currentItems.map((prop) => (
                  <Card key={prop.id} className="group overflow-hidden flex flex-col border-none shadow-none hover:shadow-md transition-all bg-transparent hover:bg-card">
                    <div 
                      className="relative aspect-[4/3] overflow-hidden bg-muted rounded-md mb-3 cursor-pointer"
                      onClick={() => {
                        setSelectedDetailId(prop.id);
                        window.history.pushState({}, '', `/${portfolio}/${org}/${tool}/product-details?id=${prop.id}`);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <div className="absolute top-2 left-2 flex gap-1 z-10">
                        <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm hover:bg-background/90 text-xs shadow-sm">
                          {prop.category}
                        </Badge>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(prop.id); }}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-background/50 backdrop-blur-md hover:bg-background/80 transition-colors shadow-sm z-20"
                      >
                        <Star 
                          className={`h-4 w-4 ${favorites.includes(prop.id) ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground hover:text-foreground'}`} 
                        />
                      </button>
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
                    </div>
                    <CardContent className="p-0 flex-1">
                      <h3 
                        className="font-semibold text-primary/90 text-sm mb-1 line-clamp-1 cursor-pointer hover:underline"
                        onClick={() => {
                          setSelectedDetailId(prop.id);
                          window.history.pushState({}, '', `/${portfolio}/${org}/${tool}/product-details?id=${prop.id}`);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        {prop.title}
                      </h3>
                      <div className="text-xs text-muted-foreground mb-2">
                        <span className="font-bold text-foreground">${prop.price}</span> — 1 for rent
                      </div>
                      {prop.dimensions && (
                        <div className="text-[10px] text-muted-foreground mb-3 font-mono">
                          {prop.dimensions}
                        </div>
                      )}
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

              {/* Empty State */}
              {filteredProps.length === 0 && (
                <div className="flex-1 py-12 flex flex-col items-center justify-center text-muted-foreground">
                  <Search className="h-12 w-12 mb-4 opacity-20" />
                  <p className="text-lg font-medium">No props found.</p>
                  <p className="text-sm mb-6">Try adjusting your filters or search query.</p>
                  <Button onClick={seedProps} disabled={isLoading} variant="secondary">
                    {isLoading ? "Seeding..." : "Seed Demo Props"}
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && !selectedDetailId && (
            <div className="mt-10 border-t pt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(currentPage - 1)} 
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink 
                        isActive={currentPage === i + 1}
                        onClick={() => handlePageChange(i + 1)}
                        className="cursor-pointer"
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
