import { useEffect, useState } from "react";
import { ArrowLeft, Star, Plus, Minus, Info, Ruler, Weight, Package, AlertCircle } from "lucide-react";
import { PropItem } from "../lib/mock-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";

export default function ProductDetails({
    propItem,
    isLoading,
    onBack,
    onAddToCart
}: {
    propItem: PropItem | null;
    isLoading?: boolean;
    onBack: () => void;
    onAddToCart: (prop: PropItem) => void;
}) {
    if (isLoading) {
        return (
            <div className="flex flex-col h-full min-h-[400px] items-center justify-center bg-background p-6">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mb-4"></div>
                <p className="text-muted-foreground animate-pulse">Loading product...</p>
            </div>
        );
    }

    if (!propItem) {
        return (
            <div className="flex flex-col h-screen items-center justify-center bg-background p-6 text-center">
                <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
                <h1 className="text-2xl font-bold mb-2">Product not found</h1>
                <p className="text-muted-foreground mb-6">The item you are looking for does not exist or has been removed.</p>
                <Button onClick={onBack} variant="outline">
                    Back to Catalog
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-6xl p-6 lg:p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
                    {/* Image Section */}
                    <div className="relative rounded-xl overflow-hidden bg-muted/30 border border-border/50 aspect-square md:aspect-[4/5] lg:aspect-square group">
                        <img 
                            src={propItem.image} 
                            alt={propItem.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {!propItem.inStock && (
                            <div className="absolute inset-0 bg-background/80 flex items-center justify-center backdrop-blur-sm">
                                <Badge variant="outline" className="text-lg py-2 px-4 border-2 font-semibold tracking-wider uppercase">
                                    Out of Stock
                                </Badge>
                            </div>
                        )}
                        <div className="absolute top-4 left-4 flex gap-2">
                            <Badge className="bg-background/80 backdrop-blur-md text-foreground hover:bg-background/90 text-sm shadow-md py-1 px-3">
                                {propItem.category}
                            </Badge>
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="flex flex-col py-2">
                        <div className="mb-2 flex items-center justify-between">
                            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{propItem.subcategory}</p>
                            <Badge variant={propItem.condition === "New" ? "default" : "secondary"}>
                                {propItem.condition || "Standard"}
                            </Badge>
                        </div>

                        <h1 className="text-4xl font-bold tracking-tight mb-4">{propItem.title}</h1>
                        
                        <div className="flex items-end gap-4 mb-6">
                            <span className="text-4xl font-extrabold text-primary">${propItem.price}</span>
                            <span className="text-muted-foreground mb-1">/ rental</span>
                        </div>

                        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                            {propItem.description}
                        </p>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            {propItem.dimensions && (
                                <Card className="bg-muted/30 border-none shadow-none">
                                    <CardContent className="p-4 flex items-start gap-3">
                                        <Ruler className="h-5 w-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="text-xs text-muted-foreground font-medium uppercase mb-1">Dimensions</p>
                                            <p className="text-sm font-semibold">{propItem.dimensions}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                            {propItem.weight && (
                                <Card className="bg-muted/30 border-none shadow-none">
                                    <CardContent className="p-4 flex items-start gap-3">
                                        <Weight className="h-5 w-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="text-xs text-muted-foreground font-medium uppercase mb-1">Weight</p>
                                            <p className="text-sm font-semibold">{propItem.weight} kg</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                            {propItem.pieces && (
                                <Card className="bg-muted/30 border-none shadow-none">
                                    <CardContent className="p-4 flex items-start gap-3">
                                        <Package className="h-5 w-5 text-primary mt-0.5" />
                                        <div>
                                            <p className="text-xs text-muted-foreground font-medium uppercase mb-1">Pieces</p>
                                            <p className="text-sm font-semibold">{propItem.pieces} unit(s)</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}
                            <Card className="bg-muted/30 border-none shadow-none">
                                <CardContent className="p-4 flex items-start gap-3">
                                    <Info className="h-5 w-5 text-primary mt-0.5" />
                                    <div>
                                        <p className="text-xs text-muted-foreground font-medium uppercase mb-1">Tags</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {propItem.tags?.map(tag => (
                                                <span key={tag} className="text-[10px] bg-background px-1.5 py-0.5 rounded border text-muted-foreground">{tag}</span>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="mt-auto pt-6 border-t flex flex-col sm:flex-row gap-4">
                            <Button 
                                size="lg" 
                                className="flex-1 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                                disabled={!propItem.inStock}
                                onClick={() => onAddToCart(propItem)}
                            >
                                <Plus className="mr-2 h-5 w-5" /> 
                                {propItem.inStock ? "Add to Project" : "Out of Stock"}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
