import React, { useMemo } from "react";
import { Settings, Download, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import DialogPost from "@/components/console/dialog-post";

interface BlueprintField {
  name: string;
  layer?: string;
  options?: Record<string, string>;
  widget?: string;
  required?: boolean;
  label?: string;
  hint?: string;
  [key: string]: unknown;
}

interface Blueprint {
  label: string;
  fields?: BlueprintField[];
  [key: string]: unknown;
}

interface TreeStructure {
  portfolios: {
    [key: string]: {
      name: string;
      portfolio_id: string;
      orgs: object;
      teams: object;
      tools: object;
    };
  };
  user_id: string;
}

interface PropsOnboardingProps {
  tree: TreeStructure;
}

const PROPS_ONBOARDING_BLUEPRINT: Blueprint = {
  label: "Props Onboardings",
  fields: [
    {
      cardinality: "single",
      default: "",
      hint: "Portfolio this handle should belong to:",
      label: "Portfolio",
      layer: "2",
      multilingual: false,
      name: "portfolio",
      order: "2",
      required: false,
      semantic: "hs:portfolio",
      source: "",
      type: "string",
      widget: "text",
    }
  ],
};

export default function PropsOnboarding({ tree }: PropsOnboardingProps) {
  const onboardingBlueprint = useMemo(() => {
    if (!tree?.portfolios) {
      return PROPS_ONBOARDING_BLUEPRINT;
    }

    const portfolioDict: Record<string, string> = {};
    Object.entries(tree.portfolios).forEach(([portfolioId, portfolio]) => {
      portfolioDict[portfolioId] = portfolio.name;
    });

    return {
      ...PROPS_ONBOARDING_BLUEPRINT,
      fields: PROPS_ONBOARDING_BLUEPRINT.fields!.map((field) => {
        if (field.name === "portfolio") {
          return {
            ...field,
            layer: "0",
            options: portfolioDict,
            widget: "select",
            required: true,
          };
        }
        return field;
      }),
    };
  }, [tree]);

  const refreshAction = () => {};
  const portfolioField = onboardingBlueprint.fields?.find(
    (field: BlueprintField) => field.name === "portfolio"
  );
  const hasPortfolioOptions =
    !!portfolioField?.options && Object.keys(portfolioField.options).length > 0;

  return (
    <Card className="group relative overflow-hidden border-border bg-card transition-all hover:border-accent/50 hover:shadow-lg hover:shadow-accent/5">
      <div className="absolute right-3 top-3">
        <Badge className="bg-accent text-accent-foreground">Verified</Badge>
      </div>
      <CardContent className="p-5">
        <div className="mb-4 flex items-start gap-4">
          <Settings size={68} />
          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold text-foreground">Props Extension</h3>
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              Gestiona y administra configuraciones u operaciones relacionadas a Props.
            </p>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-1.5">
          <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
            props
          </span>
          <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
            extension
          </span>
          <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
            tools
          </span>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <div className="flex items-center gap-4">
            <div className="text-xs text-muted-foreground">by Renglo</div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Download className="h-3.5 w-3.5" />
              Included
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
              Extension
            </div>
          </div>
          {hasPortfolioOptions ? (
            <DialogPost
              refreshUp={refreshAction}
              blueprint={onboardingBlueprint}
              title="Activate your portfolio"
              instructions="Please fill the following fields:"
              path={`${import.meta.env.VITE_API_URL}/_schd/run/props/props_onboardings`}
              method="POST"
              buttontext="Install"
            />
          ) : (
            <div className="text-xs font-medium text-red-500">Create a portfolio first</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
