import { useEffect } from "react";
import Marketplace from "./pages/marketplace";
import Favorites from "./pages/favorites";
import Orders from "./pages/orders";

interface Portfolio {
  name: string;
  portfolio_id: string;
  orgs: Record<string, Org>;
  tools: Record<string, Tool>;
}

interface Org {
  name: string;
  org_id: string;
  tools: string[];
}

interface Tool {
  name: string;
  handle: string;
}

export default function PropsExtension({ portfolio, org, tool, section, tree, query }: {
  portfolio: string;
  org: string;
  tool: string;
  section?: string;  
  tree?: { portfolios: Record<string, Portfolio> };
  query?: Record<string, string>; 
}) {
 
    console.log('PROPS >> Portfolio/Org/Tool/Section', portfolio, org, tool, section);

    // Si no hay sección definida, redirige al inicio por defecto de esta extensión
    useEffect(() => {
        if (!section) {
            window.location.href = `/${portfolio}/${org}/${tool}/dashboard`;
        }
    }, [section, portfolio, org, tool]);

    if (!section) {
        return null;
    }

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            {section === 'dashboard' && (
                <Marketplace portfolio={portfolio} org={org} tool={tool} />
            )}
            {section === 'favorites' && (
                <Favorites />
            )}
            {section === 'orders' && (
                <Orders />
            )}
            
            {section !== 'dashboard' && section !== 'favorites' && section !== 'orders' && (
                <div className="p-6">
                    <h2 className="text-xl font-semibold">Under Construction</h2>
                    <p className="text-muted-foreground mt-2">The section '{section}' is not yet implemented.</p>
                </div>
            )}
        </div>
    );
}
