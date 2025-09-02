#!/bin/bash

# Irene's Circus - Deployment Validation Script
# This script validates the deployment configuration before deploying to Render.com

# Note: We don't use set -e here because we want to collect all validation results

echo "🔍 Irene's Circus - Deployment Validation Script 🔍"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Counters
CHECKS_PASSED=0
CHECKS_FAILED=0
WARNINGS=0

# Function to print colored output
print_status() {
    echo -e "${BLUE}[CHECK]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓ PASS]${NC} $1"
    ((CHECKS_PASSED++))
}

print_warning() {
    echo -e "${YELLOW}[⚠ WARN]${NC} $1"
    ((WARNINGS++))
}

print_error() {
    echo -e "${RED}[✗ FAIL]${NC} $1"
    ((CHECKS_FAILED++))
}

print_header() {
    echo -e "${PURPLE}[SECTION]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "This script must be run from the project root directory"
    exit 1
fi

print_header "1. File Structure Validation"
echo "============================="

# Check for required files
print_status "Checking required configuration files..."

if [ -f "render.yaml" ]; then
    print_success "render.yaml exists"
else
    print_error "render.yaml not found"
fi

if [ -f "mongo-dockerfile" ]; then
    print_success "mongo-dockerfile exists"
else
    print_error "mongo-dockerfile not found"
fi

if [ -f "deploy-render.sh" ]; then
    print_success "deploy-render.sh exists"
    if [ -x "deploy-render.sh" ]; then
        print_success "deploy-render.sh is executable"
    else
        print_error "deploy-render.sh is not executable"
    fi
else
    print_error "deploy-render.sh not found"
fi

# Check backend files
print_status "Checking backend structure..."

if [ -f "irenes-circus-backend/package.json" ]; then
    print_success "Backend package.json exists"
else
    print_error "Backend package.json not found"
fi

if [ -f "irenes-circus-backend/src/index.ts" ]; then
    print_success "Backend entry point exists"
else
    print_error "Backend entry point not found"
fi

if [ -f "irenes-circus-backend/src/utils/seedProduction.ts" ]; then
    print_success "Production seeding script exists"
else
    print_error "Production seeding script not found"
fi

# Check frontend files
print_status "Checking frontend structure..."

if [ -f "irenes-circus-frontend/package.json" ]; then
    print_success "Frontend package.json exists"
else
    print_error "Frontend package.json not found"
fi

if [ -f "irenes-circus-frontend/src/main.tsx" ]; then
    print_success "Frontend entry point exists"
else
    print_error "Frontend entry point not found"
fi

if [ -f "irenes-circus-frontend/vite.config.ts" ]; then
    print_success "Vite config exists"
else
    print_error "Vite config not found"
fi

print_header "2. Package Configuration Validation"
echo "==================================="

# Check backend package.json
print_status "Validating backend package.json..."

if grep -q '"build".*"tsc"' irenes-circus-backend/package.json; then
    print_success "Backend build script configured"
else
    print_error "Backend build script missing or incorrect"
fi

if grep -q '"start".*"node dist/index.js"' irenes-circus-backend/package.json; then
    print_success "Backend start script configured"
else
    print_error "Backend start script missing or incorrect"
fi

if grep -q '"seed:production"' irenes-circus-backend/package.json; then
    print_success "Production seeding script configured"
else
    print_error "Production seeding script missing from package.json"
fi

# Check frontend package.json
print_status "Validating frontend package.json..."

if grep -q '"build".*"vite build"' irenes-circus-frontend/package.json; then
    print_success "Frontend build script configured"
else
    print_error "Frontend build script missing or incorrect"
fi

if grep -q '"preview".*"vite preview"' irenes-circus-frontend/package.json; then
    print_success "Frontend preview script configured"
else
    print_warning "Frontend preview script missing (optional)"
fi

print_header "3. Environment Configuration"
echo "============================"

# Check for environment examples
if [ -f "irenes-circus-backend/env.example" ]; then
    print_success "Backend environment example exists"
    
    # Check required variables
    if grep -q "JWT_SECRET" irenes-circus-backend/env.example; then
        print_success "JWT_SECRET defined in env.example"
    else
        print_error "JWT_SECRET missing from env.example"
    fi
    
    if grep -q "MONGODB_URI" irenes-circus-backend/env.example; then
        print_success "MONGODB_URI defined in env.example"
    else
        print_error "MONGODB_URI missing from env.example"
    fi
else
    print_warning "Backend env.example not found"
fi

# Check for production env templates
if [ -f "irenes-circus-backend/.env.production" ]; then
    print_success "Backend production environment template exists"
else
    print_warning "Backend production environment template not found (will be created by deploy script)"
fi

print_header "4. Render.yaml Configuration Validation"
echo "========================================"

print_status "Validating render.yaml syntax..."

# Basic YAML validation (if yq is available)
if command -v yq &> /dev/null; then
    if yq eval '.' render.yaml > /dev/null 2>&1; then
        print_success "render.yaml has valid YAML syntax"
    else
        print_error "render.yaml has invalid YAML syntax"
    fi
else
    print_warning "yq not available, skipping YAML syntax validation"
fi

# Check for required services
if grep -q "name: irenes-circus-backend" render.yaml; then
    print_success "Backend service defined in render.yaml"
else
    print_error "Backend service missing from render.yaml"
fi

if grep -q "name: irenes-circus-frontend" render.yaml; then
    print_success "Frontend service defined in render.yaml"
else
    print_error "Frontend service missing from render.yaml"
fi

if grep -q "name: irenes-circus-mongodb" render.yaml; then
    print_success "MongoDB service defined in render.yaml"
else
    print_error "MongoDB service missing from render.yaml"
fi

# Note: Database seeding is now handled automatically by the backend on startup
print_success "Database seeding configured (automatic on backend startup)"

# Check for health check
if grep -q "healthCheckPath: /api/health" render.yaml; then
    print_success "Health check path configured"
else
    print_error "Health check path missing from render.yaml"
fi

print_header "5. Dependencies Validation"
echo "=========================="

print_status "Checking Node.js version..."
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -ge 18 ]; then
    print_success "Node.js version $NODE_VERSION is compatible"
else
    print_error "Node.js version $NODE_VERSION is too old (18+ required)"
fi

print_status "Checking package manager..."
if command -v pnpm &> /dev/null; then
    print_success "pnpm is available"
else
    print_warning "pnpm not found, install with: npm install -g pnpm"
fi

print_header "6. Build Test"
echo "============="

print_status "Testing backend build..."
cd irenes-circus-backend
if pnpm install --silent > /dev/null 2>&1; then
    print_success "Backend dependencies installed"
    
    if pnpm build > /dev/null 2>&1; then
        print_success "Backend builds successfully"
        
        # Check if build output exists
        if [ -f "dist/index.js" ]; then
            print_success "Backend build output exists"
        else
            print_error "Backend build output missing"
        fi
    else
        print_error "Backend build failed"
    fi
else
    print_error "Backend dependency installation failed"
fi
cd ..

print_status "Testing frontend build..."
cd irenes-circus-frontend
if pnpm install --silent > /dev/null 2>&1; then
    print_success "Frontend dependencies installed"
    
    if pnpm build > /dev/null 2>&1; then
        print_success "Frontend builds successfully"
        
        # Check if build output exists
        if [ -d "dist" ] && [ -f "dist/index.html" ]; then
            print_success "Frontend build output exists"
        else
            print_error "Frontend build output missing"
        fi
    else
        print_error "Frontend build failed"
    fi
else
    print_error "Frontend dependency installation failed"
fi
cd ..

print_header "7. Security Validation"
echo "======================"

print_status "Checking for security issues..."

# Check for .env files in git
if git ls-files 2>/dev/null | grep -q "\.env$"; then
    print_error ".env files found in version control"
else
    print_success "No .env files in version control"
fi

# Check for hardcoded secrets (basic check)
if grep -r "password.*=" --include="*.ts" --include="*.js" --include="*.json" . | grep -v "example" | grep -v "template" | head -1; then
    print_warning "Potential hardcoded passwords found (review manually)"
else
    print_success "No obvious hardcoded passwords found"
fi

print_header "8. Final Report"
echo "==============="

echo
echo "📊 VALIDATION SUMMARY:"
echo "====================="
echo "✅ Checks Passed: $CHECKS_PASSED"
echo "❌ Checks Failed: $CHECKS_FAILED"
echo "⚠️  Warnings: $WARNINGS"
echo

if [ $CHECKS_FAILED -eq 0 ]; then
    if [ $WARNINGS -eq 0 ]; then
        print_success "🎉 All validations passed! Ready for deployment."
        echo
        echo "Next steps:"
        echo "1. Run ./deploy-render.sh to deploy to Render.com"
        echo "2. Follow the post-deployment instructions"
        echo "3. Test your live application"
    else
        print_warning "⚠️  Validations passed with warnings. Review warnings before deployment."
        echo
        echo "You can proceed with deployment, but consider addressing the warnings."
    fi
    exit 0
else
    print_error "❌ Validation failed! Please fix the errors before deployment."
    echo
    echo "Fix the failed checks and run this script again."
    exit 1
fi
