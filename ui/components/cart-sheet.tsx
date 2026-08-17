import { ShoppingCart, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PropItem } from "../lib/mock-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface CartItem extends PropItem {
  quantity: number;
}

interface CartSheetProps {
  cart: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
}

export default function CartSheet({ cart, onRemoveItem, onUpdateQuantity }: CartSheetProps) {
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <ShoppingCart className="h-5 w-5" />
          {totalItems > 0 && (
            <Badge variant="destructive" className="absolute -top-2 -right-2 px-1.5 min-w-[20px] h-5 flex items-center justify-center rounded-full text-xs">
              {totalItems}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle>Prop Cart</SheetTitle>
        </SheetHeader>
        
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <ShoppingCart className="h-12 w-12 mb-4 opacity-20" />
            <p>Your cart is empty.</p>
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 -mx-6 px-6 mt-6">
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 border-b pb-4">
                    <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md border">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="text-sm font-medium leading-none mb-1">{item.title}</h4>
                          <p className="text-xs text-muted-foreground">{item.category}</p>
                        </div>
                        <p className="text-sm font-medium">${item.price}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center rounded-md border">
                          <button
                            className="px-2 py-1 text-xs hover:bg-muted"
                            onClick={() => onUpdateQuantity(item.id, -1)}
                          >
                            -
                          </button>
                          <span className="px-2 py-1 text-xs font-medium w-8 text-center border-x">
                            {item.quantity}
                          </span>
                          <button
                            className="px-2 py-1 text-xs hover:bg-muted"
                            onClick={() => onUpdateQuantity(item.id, 1)}
                          >
                            +
                          </button>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() => onRemoveItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="border-t pt-4 mt-auto">
              <div className="flex justify-between mb-4">
                <span className="font-semibold">Total estimated</span>
                <span className="font-semibold">${totalPrice}</span>
              </div>
              <Button className="w-full">Request Quote</Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
