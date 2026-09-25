# Production Directory Tree

```text
auralis-ai/
├── src/
│   ├── assets/                  # Static assets (images, icons, fonts)
│   ├── shared/                  # Shared code across features
│   │   ├── components/          # Reusable UI components (buttons, modals, tooltips, etc.)
│   │   ├── hooks/               # Reusable custom hooks (e.g., useApi, useAuth)
│   │   ├── services/            # Shared service layers (API clients, utils)
│   │   │   ├── api/             # Low-level API clients (axios/fetch wrappers)
│   │   │   └── external/        # Third-party service integrations (weather, gemini, emailjs)
│   │   ├── types/               # Shared TypeScript types and interfaces
│   │   └── utils/               # Utility functions (formatters, validators, helpers)
│   ├── features/                # Feature modules (domain-driven)
│   │   ├── map/                 # Map visualization and geospatial intelligence
│   │   │   ├── components/      # Components specific to map feature
│   │   │   ├── hooks/           # Hooks specific to map feature (e.g., useMapLayers)
│   │   │   ├── types/           # Types specific to map feature
│   │   │   └── index.ts         # Public API of the map feature
│   │   ├── weather/             # Weather data processing and visualization
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── types/
│   │   │   └── index.ts
│   │   ├── analytics/           # Climate analytics and variance visualization
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── types/
│   │   │   └── index.ts
│   │   ├── admin/               # Admin panel for observation management
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── types/
│   │   │   └── index.ts
│   │   └── community/           # Community feedback and verification system
│   │       ├── components/
│   │       ├── hooks/
│   │       ├── types/
│   │       └── index.ts
│   ├── App.tsx                  # Root application component
│   ├── main.tsx                 # Entry point (React DOM render)
│   └── index.css                # Tailwind base + custom theme overrides
├── public/                      # Static assets served directly (favicon, robots.txt, etc.)
├── tests/                       # Test files (unit, integration, e2e)
│   ├── __mocks__/               # Manual mocks for Jest
│   ├── fixtures/                # Test fixtures and mock data
│   ├── setup/                   # Test setup files
│   └── ...                      # Test files colocated with source or in feature folders
├── .github/                     # GitHub workflows and issue templates
│   ├── workflows/               # CI/CD workflows (ci.yml, etc.)
│   └── ISSUE_TEMPLATE/          # Issue templates
├── .vscode/                     # VS Code workspace settings
│   ├── settings.json            # Workspace-specific settings
│   └── extensions.json          # Recommended extensions
├── .env.example                 # Example environment variables
├── .eslintrc.cjs                # ESLint configuration
├── .prettierrc                  # Prettier configuration
├── .eslintignore                # ESLint ignore patterns
├── .prettierignore              # Prettier ignore patterns
├── postcss.config.cjs           # PostCSS configuration (Tailwind)
├── tailwind.config.cjs          # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── tsconfig.node.json           # TypeScript configuration for Node scripts
├── vite.config.ts               # Vite configuration
├── index.html                   # HTML template
├── package.json                 # npm dependencies and scripts
├── Makefile                     # Task runner for development operations
├── Dockerfile                   # Containerization definition
├── docker-compose.yml           # Docker compose for development
├── README.md                    # Project documentation
├── LICENSE                      # MIT license
└── CODE_OF_CONDUCT.md           # Contributor covenant
```