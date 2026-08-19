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

const EMPTY_SECTIONS = ['', 'undefined', 'null', 'catalog'];
// secciones que deben renderizar el marketplace
const MARKETPLACE_SECTIONS = ['dashboard', 'product-details'];

export default function PropsExtension({ portfolio, org, tool, section, tree, query }: {
    portfolio: string;
    org: string;
    tool: string;
    section?: string;
    tree?: { portfolios: Record<string, Portfolio> };
    query?: Record<string, string>;
}) {

    console.log('PROPS >> Portfolio/Org/Tool/Section', portfolio, org, tool, section);

    const currentSection = (!section || EMPTY_SECTIONS.includes(section)) ? 'dashboard' : section;
    const isMarketplace = MARKETPLACE_SECTIONS.includes(currentSection);
    const detailId = (currentSection === 'product-details' || currentSection === 'favorites') ? query?.id : undefined;

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            {isMarketplace && (
                <Marketplace portfolio={portfolio} org={org} tool={tool} detailId={detailId} />
            )}
            {currentSection === 'favorites' && (
                <Favorites portfolio={portfolio} org={org} tool={tool} detailId={detailId} />
            )}
            {currentSection === 'orders' && (
                <Orders />
            )}

            {!isMarketplace && currentSection !== 'favorites' && currentSection !== 'orders' && (
                <div className="p-6">
                    <h2 className="text-xl font-semibold">Under Construction</h2>
                    <p className="text-muted-foreground mt-2">The section '{section}' is not yet implemented.</p>
                </div>
            )}
        </div>
    );
}

