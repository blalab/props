# PROPS extension

Props provides custom handlers, blueprints, and React UI components for the Renglo environment. It is designed to expose the **Marketplace**, **Favorites**, and **Orders** modules to the user interface.

The backend implementation lives under `package/` as the installable Python module **`props`**, while the frontend integration resides in `ui/`.

## What it provides

| Piece | Role |
|--------|------|
| **`props`** | Python backend module providing custom handlers and utilities (`package/`) |
| **`ui/props.tsx`** | Main React entry point exposing the internal routing for the extension |
| **`Marketplace`** | UI section (`dashboard`) to browse available properties or items |
| **`Favorites`** | UI section for saved/bookmarked items |
| **`Orders`** | UI section for managing transactions and requests |
| **`.gitignore`** | Comprehensive version control rules protecting tokens (`service_account.json`) and caches |

## Install

From `extensions/props/package/`:

```bash
pip install -e .
```

Requires Python **3.12+**. Dependencies include **`requests`**.

Upload blueprints to your database:

```bash
cd extensions/props/installer
python upload_blueprints.py <env> --aws-profile <profile> --aws-region <region>
```

## UI Integration

The extension includes React components for the frontend. 
Ensure your host application router renders the `<PropsExtension />` component (exported from `ui/props.tsx`). It requires the following props: `portfolio`, `org`, and `tool`. 

By default, the internal router redirects empty sections to the `dashboard` (Marketplace) view.

## Version Control Protection

The included `.gitignore` at the root of the extension aggressively ignores:
- Node.js dependencies (`node_modules/`, `dist/`)
- Python compiled artifacts and caches (`__pycache__/`, `*.egg-info/`, `.pytest_cache/`)
- Environment variable files (`.env`, `.venv`)
- Secret tokens (e.g., `service_account.json`, `client_secret.json`)

## Package layout

```text
extensions/props/
├── PROPS_README.MD
├── .gitignore               # Strict exclusion rules for Node, Python, and tokens
├── blueprints/              # DB config and schema definitions
├── installer/               # Deployment scripts
├── package/
│   ├── pyproject.toml       # Python package configuration
│   └── props/               # Backend logic and handlers
└── ui/                      # React frontend components
    ├── props.tsx            # Main extension UI entry point
    └── pages/               # Marketplace, Favorites, Orders views
```
