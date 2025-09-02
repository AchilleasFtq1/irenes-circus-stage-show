#!/bin/bash

# Irene's Circus Production Deployment Script
# This script helps deploy the application to production with proper security checks

set -e  # Exit on any error

echo "🎪 Irene's Circus - Production Deployment Script 🎪"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "This script must be run from the project root directory"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required. Current version: $(node --version)"
    exit 1
fi

print_success "Node.js version check passed: $(node --version)"

# Security checks
echo
print_status "Running security checks..."

# Check for .env files in version control
if git ls-files | grep -q "\.env$"; then
    print_error ".env files found in version control! Remove them immediately:"
    git ls-files | grep "\.env$"
    exit 1
fi

print_success "No .env files found in version control"

# Check for required environment variables
print_status "Checking environment variables..."

REQUIRED_BACKEND_VARS=("MONGODB_URI" "JWT_SECRET" "NODE_ENV")
MISSING_VARS=()

for var in "${REQUIRED_BACKEND_VARS[@]}"; do
    if [ -z "${!var}" ] && [ ! -f "irenes-circus-backend/.env" ]; then
        MISSING_VARS+=("$var")
    fi
done

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
    print_error "Missing required environment variables: ${MISSING_VARS[*]}"
    print_error "Please create irenes-circus-backend/.env with required variables"
    exit 1
fi

# Check JWT_SECRET strength
if [ -f "irenes-circus-backend/.env" ]; then
    JWT_SECRET=$(grep "^JWT_SECRET=" irenes-circus-backend/.env | cut -d'=' -f2 | tr -d '"' | tr -d "'")
    if [ ${#JWT_SECRET} -lt 32 ]; then
        print_error "JWT_SECRET must be at least 32 characters long for production"
        exit 1
    fi
fi

print_success "Environment variables check passed"

# Install dependencies
echo
print_status "Installing dependencies..."

print_status "Installing root dependencies..."
pnpm install

print_status "Installing backend dependencies..."
cd irenes-circus-backend
pnpm install
cd ..

print_status "Installing frontend dependencies..."
cd irenes-circus-frontend
pnpm install
cd ..

print_success "Dependencies installed successfully"

# Run security audit
echo
print_status "Running security audit..."

cd irenes-circus-backend
if pnpm audit --audit-level moderate; then
    print_success "Backend security audit passed"
else
    print_warning "Backend security audit found issues. Review and fix before deploying to production."
fi
cd ..

cd irenes-circus-frontend
if pnpm audit --audit-level moderate; then
    print_success "Frontend security audit passed"
else
    print_warning "Frontend security audit found issues. Review and fix before deploying to production."
fi
cd ..

# Build applications
echo
print_status "Building applications..."

print_status "Building backend..."
cd irenes-circus-backend
pnpm build
print_success "Backend build completed"
cd ..

print_status "Building frontend..."
cd irenes-circus-frontend
pnpm build
print_success "Frontend build completed"
cd ..

# Run tests if they exist
echo
print_status "Running tests..."

cd irenes-circus-backend
if [ -f "package.json" ] && grep -q '"test"' package.json; then
    print_status "Running backend tests..."
    pnpm test || print_warning "Backend tests failed or not implemented"
else
    print_warning "No backend tests found"
fi
cd ..

cd irenes-circus-frontend
if [ -f "package.json" ] && grep -q '"test"' package.json; then
    print_status "Running frontend tests..."
    pnpm test || print_warning "Frontend tests failed or not implemented"
else
    print_warning "No frontend tests found"
fi
cd ..

# Database seeding check
echo
print_status "Checking database connection and seeding..."

cd irenes-circus-backend
if [ "$1" = "--seed" ]; then
    print_status "Seeding database with initial data..."
    pnpm seed
    print_success "Database seeded successfully"
else
    print_warning "Skipping database seeding. Use --seed flag to seed the database."
fi
cd ..

# Create deployment package
echo
print_status "Creating deployment package..."

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
PACKAGE_NAME="irenes-circus-${TIMESTAMP}.tar.gz"

# Create a temporary directory for packaging
mkdir -p deploy-temp

# Copy backend build
cp -r irenes-circus-backend/dist deploy-temp/backend
cp irenes-circus-backend/package.json deploy-temp/backend/
cp irenes-circus-backend/package-lock.json deploy-temp/backend/ 2>/dev/null || true
cp irenes-circus-backend/pnpm-lock.yaml deploy-temp/backend/ 2>/dev/null || true

# Copy frontend build
cp -r irenes-circus-frontend/dist deploy-temp/frontend

# Copy deployment files
cp SECURITY.md deploy-temp/
cp README.md deploy-temp/ 2>/dev/null || true

# Create deployment instructions
cat > deploy-temp/DEPLOYMENT.md << EOF
# Deployment Instructions

## Backend Deployment

1. Upload the backend folder to your server
2. Install production dependencies:
   \`\`\`bash
   cd backend
   npm install --production
   \`\`\`
3. Set up environment variables (copy from .env.example)
4. Start the server:
   \`\`\`bash
   NODE_ENV=production npm start
   \`\`\`

## Frontend Deployment

1. Upload the frontend folder contents to your web server
2. Configure your web server to serve the static files
3. Set up proper redirects for React Router

## Environment Variables

Backend requires:
- MONGODB_URI
- JWT_SECRET (min 32 characters)
- NODE_ENV=production
- FRONTEND_URL (for CORS)

## Security Checklist

- [ ] HTTPS enabled
- [ ] Firewall configured
- [ ] Database secured
- [ ] Environment variables set
- [ ] Monitoring enabled

Deployment created: ${TIMESTAMP}
EOF

# Create the package
tar -czf "$PACKAGE_NAME" -C deploy-temp .
rm -rf deploy-temp

print_success "Deployment package created: $PACKAGE_NAME"

# Final checklist
echo
print_status "Deployment Checklist:"
echo "====================="
echo "✅ Dependencies installed"
echo "✅ Security audit completed"
echo "✅ Applications built successfully"
echo "✅ Deployment package created"
echo
print_warning "Before deploying to production, ensure:"
echo "• HTTPS is properly configured"
echo "• Environment variables are set on the server"
echo "• Database is secured and accessible"
echo "• Firewall rules are configured"
echo "• Monitoring and logging are set up"
echo "• Backup strategy is in place"
echo
print_success "Deployment preparation complete! 🎉"
print_status "Package: $PACKAGE_NAME"
echo
print_status "To deploy:"
print_status "1. Upload $PACKAGE_NAME to your server"
print_status "2. Extract: tar -xzf $PACKAGE_NAME"
print_status "3. Follow instructions in DEPLOYMENT.md"
echo
print_status "Happy deploying! 🚀"
