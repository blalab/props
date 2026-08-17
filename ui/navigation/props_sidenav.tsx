import { Store, Star, Package } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ToolMenuProps {
  portfolio: string;
  org: string;
  tool?: string;
  section?: string;
  onNavigate: (path: string) => void;
}

export default function PropsSideNav({
  portfolio,
  org,
  tool,
  section,
  onNavigate,
}: ToolMenuProps) {
  return (
    <nav
      className={
        !org || org === "settings"
          ? "hidden"
          : "flex flex-col items-center gap-1 px-1 sm:py-4"
      }
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center flex-col mb-4">
              <button
                onClick={() => onNavigate(`/${portfolio}/${org}/${tool}/dashboard`)}
                className={
                  section === "dashboard"
                    ? "group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-gray-200 text-lg font-semibold text-muted-foreground md:h-12 md:w-12 md:text-base"
                    : "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                }
              >
                <Store
                  color={section === "dashboard" ? "#19baf0" : "currentColor"}
                  className="h-5 w-5"
                />
                <span className="sr-only">Marketplace</span>
              </button>
              <span className="text-xxs">Catalog</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">Prop Catalog</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center flex-col">
              <button
                onClick={() => onNavigate(`/${portfolio}/${org}/${tool}/favorites`)}
                className={
                  section === "favorites"
                    ? "group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-gray-200 text-lg font-semibold text-muted-foreground md:h-12 md:w-12 md:text-base"
                    : "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                }
              >
                <Star
                  color={section === "favorites" ? "#f59e0b" : "currentColor"}
                  className="h-5 w-5"
                />
                <span className="sr-only">Starred</span>
              </button>
              <span className="text-xxs">Starred</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">Starred Props</TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center flex-col mt-4">
              <button
                onClick={() => onNavigate(`/${portfolio}/${org}/${tool}/orders`)}
                className={
                  section === "orders"
                    ? "group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-gray-200 text-lg font-semibold text-muted-foreground md:h-12 md:w-12 md:text-base"
                    : "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                }
              >
                <Package
                  color={section === "orders" ? "#10b981" : "currentColor"}
                  className="h-5 w-5"
                />
                <span className="sr-only">Rentals</span>
              </button>
              <span className="text-xxs">Rentals</span>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">My Rentals & Orders</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </nav>
  );
}
