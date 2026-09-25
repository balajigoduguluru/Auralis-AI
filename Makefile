.PHONY: setup run build preview test clean lint

# Install dependencies
setup:
	npm ci

# Start development server
run:
	npm run dev

# Build for production
build:
	npm run build

# Preview production build locally
preview:
	npm run preview

# Run tests (placeholder)
test:
	npm run test

# Clean build artifacts and dependencies
clean:
	rm -rf dist node_modules

# Run type checking (lint equivalent)
lint:
	npm run typecheck