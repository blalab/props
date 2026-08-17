import { MOCK_ORDERS, OrderStatus } from "../lib/mock-data";
import { Package, Truck, CheckCircle2, Clock, ArchiveRestore } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";

export default function Orders() {
  
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "Delivered":
        return <Badge className="bg-emerald-500/15 text-emerald-600 hover:bg-emerald-500/25 border-emerald-500/20"><CheckCircle2 className="w-3 h-3 mr-1" /> Delivered</Badge>;
      case "In Transit":
        return <Badge className="bg-blue-500/15 text-blue-600 hover:bg-blue-500/25 border-blue-500/20"><Truck className="w-3 h-3 mr-1" /> In Transit</Badge>;
      case "Pending":
        return <Badge className="bg-amber-500/15 text-amber-600 hover:bg-amber-500/25 border-amber-500/20"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      case "Returned":
        return <Badge className="bg-slate-500/15 text-slate-600 hover:bg-slate-500/25 border-slate-500/20"><ArchiveRestore className="w-3 h-3 mr-1" /> Returned</Badge>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-background p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
            <Package className="h-7 w-7 text-emerald-500" />
            My Rentals
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            View the status of your current and past prop rentals.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto w-full">
        <Accordion type="single" collapsible className="w-full space-y-4">
          {MOCK_ORDERS.map((order) => (
            <AccordionItem 
              key={order.id} 
              value={order.id}
              className="border rounded-lg bg-card px-4 shadow-sm"
            >
              <AccordionTrigger className="hover:no-underline py-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full pr-4 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 shrink-0 bg-muted rounded-md overflow-hidden border shadow-sm">
                      {order.items.length > 0 ? (
                        <img 
                          src={order.items[0].prop.image} 
                          alt="Order thumbnail"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package className="h-5 w-5 text-muted-foreground m-auto mt-3.5" />
                      )}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-base">{order.id}</p>
                      <p className="text-xs text-muted-foreground">Placed on {new Date(order.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-semibold">${order.total}</p>
                      <p className="text-xs text-muted-foreground">{order.items.length} items</p>
                    </div>
                    <div className="min-w-[110px] text-right">
                      {getStatusBadge(order.status)}
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              
              <AccordionContent className="pt-2 pb-6 border-t">
                <div className="mt-4 mb-6 px-2 flex justify-between text-sm">
                  <div>
                    <span className="text-muted-foreground">Rental Duration:</span>
                    <span className="ml-2 font-medium">{order.rentalDurationDays} days</span>
                  </div>
                  <div className="sm:hidden">
                    <span className="text-muted-foreground">Total:</span>
                    <span className="ml-2 font-medium">${order.total}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {order.items.map((item, idx) => (
                    <Card key={idx} className="flex overflow-hidden border shadow-none bg-background/50">
                      <div className="h-24 w-24 shrink-0 bg-muted">
                        <img 
                          src={item.prop.image} 
                          alt={item.prop.title} 
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-3 flex flex-col justify-between flex-1">
                        <div>
                          <p className="text-sm font-semibold line-clamp-1">{item.prop.title}</p>
                          <p className="text-xs text-muted-foreground">{item.prop.category}</p>
                        </div>
                        <div className="flex justify-between items-end mt-2">
                          <p className="text-xs font-medium">Qty: {item.quantity}</p>
                          <p className="text-sm font-bold">${item.prop.price * item.quantity}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
                
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}
