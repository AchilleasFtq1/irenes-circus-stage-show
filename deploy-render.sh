#!/bin/bash

# Irene's Circus - Render.com Deployment Script
# This script automates the deployment process to Render.com

set -e  # Exit on any error

echo "🎪 Irene's Circus - Render.com Deployment Script 🎪"
echo "====================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
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

print_header() {
    echo -e "${PURPLE}[STEP]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "This script must be run from the project root directory"
    exit 1
fi

print_header "1. Pre-deployment Checks"
echo "=========================="

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required. Current version: $(node --version)"
    exit 1
fi
print_success "Node.js version check passed: $(node --version)"

# Check if Render CLI is installed
if ! command -v render &> /dev/null; then
    print_warning "Render CLI not found. Installing..."
    npm install -g @render/cli
    print_success "Render CLI installed successfully"
else
    print_success "Render CLI is already installed"
fi

# Check if user is logged in to Render
if ! render auth whoami &> /dev/null; then
    print_warning "Not authenticated with Render. Please login first:"
    echo "Run: render auth login"
    exit 1
fi
print_success "Authenticated with Render CLI"

print_header "2. Environment Configuration"
echo "============================"

# Create production environment files if they don't exist
if [ ! -f "irenes-circus-backend/.env.production" ]; then
    print_status "Creating production environment template..."
    cat > irenes-circus-backend/.env.production << EOF
# Production Environment Variables for Render.com
# These will be set as environment variables in Render dashboard

NODE_ENV=production
PORT=10000
LOG_LEVEL=info

# Database (will be auto-configured by Render)
# MONGODB_URI=mongodb://...

# JWT Configuration (generate secure values in Render dashboard)
# JWT_SECRET=generate-a-secure-32-character-string-minimum
JWT_EXPIRES_IN=7d

# CORS Configuration
# FRONTEND_URL=https://your-frontend-url.onrender.com

# Optional: Spotify API credentials
# SPOTIFY_CLIENT_ID=your_spotify_client_id
# SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
EOF
    print_success "Created production environment template"
else
    print_success "Production environment file already exists"
fi

# Create frontend environment configuration
if [ ! -f "irenes-circus-frontend/.env.production" ]; then
    print_status "Creating frontend production environment template..."
    cat > irenes-circus-frontend/.env.production << EOF
# Frontend Production Environment Variables
NODE_ENV=production

# API URL (will be auto-configured by Render)
# VITE_API_URL=https://your-backend-url.onrender.com
EOF
    print_success "Created frontend production environment template"
else
    print_success "Frontend production environment file already exists"
fi

print_header "3. Pre-deployment Testing"
echo "========================="

# Install dependencies
print_status "Installing dependencies..."
pnpm install

cd irenes-circus-backend
pnpm install
print_success "Backend dependencies installed"
cd ..

cd irenes-circus-frontend
pnpm install
print_success "Frontend dependencies installed"
cd ..

# Run security audit
print_status "Running security audit..."
cd irenes-circus-backend
if pnpm audit --audit-level moderate; then
    print_success "Backend security audit passed"
else
    print_warning "Backend security audit found issues. Review before deploying."
fi
cd ..

cd irenes-circus-frontend
if pnpm audit --audit-level moderate; then
    print_success "Frontend security audit passed"
else
    print_warning "Frontend security audit found issues. Review before deploying."
fi
cd ..

# Build applications to test
print_status "Testing builds..."
cd irenes-circus-backend
pnpm build
print_success "Backend build test passed"
cd ..

cd irenes-circus-frontend
pnpm build
print_success "Frontend build test passed"
cd ..

print_header "4. Render.com Deployment"
echo "========================"

# Check if render.yaml exists
if [ ! -f "render.yaml" ]; then
    print_error "render.yaml not found. Please ensure the configuration file exists."
    exit 1
fi

print_status "Validating render.yaml configuration..."
if render config validate render.yaml; then
    print_success "render.yaml configuration is valid"
else
    print_error "render.yaml configuration is invalid. Please fix the errors."
    exit 1
fi

# Deploy to Render
print_status "Deploying to Render.com..."
print_warning "This will create/update services on Render. Continue? (y/N)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    if render deploy; then
        print_success "Deployment initiated successfully!"
    else
        print_error "Deployment failed. Check the output above for details."
        exit 1
    fi
else
    print_warning "Deployment cancelled by user"
    exit 0
fi

print_header "5. Post-deployment Setup"
echo "========================"

print_status "Getting service information..."
render services list

print_status "Deployment completed! Here's what you need to do next:"
echo
echo "📋 MANUAL STEPS REQUIRED:"
echo "========================"
echo
echo "1. 🔐 Set Environment Variables in Render Dashboard:"
echo "   Backend Service (irenes-circus-backend):"
echo "   - JWT_SECRET: Generate a secure 32+ character string"
echo "   - MONGO_INITDB_ROOT_PASSWORD: Choose a strong MongoDB password"
echo "   - SPOTIFY_CLIENT_ID & SPOTIFY_CLIENT_SECRET: Optional for Spotify features"
echo
echo "   MongoDB Service (irenes-circus-mongodb):"
echo "   - MONGO_INITDB_ROOT_PASSWORD: Same password as backend"
echo
echo "2. 🔑 Generate Secure Values:"
echo "   Generate JWT Secret: node -e \"console.log(require('crypto').randomBytes(32).toString('hex'))\""
echo "   Choose a strong MongoDB password (12+ characters, mixed case, numbers, symbols)"
echo
echo "3. 🗄️  Database Setup:"
echo "   - MongoDB Docker container will be provisioned (Free plan)"
echo "   - Database seeding job will run automatically after MongoDB starts"
echo "   - Monitor services in Render dashboard (may take 2-3 minutes)"
echo
echo "4. 🌐 Frontend Configuration:"
echo "   - VITE_API_URL will be auto-configured to backend URL"
echo "   - CORS settings are automatically configured"
echo
echo "5. 🔍 Verify Deployment:"
echo "   - Check all services are running in Render dashboard"
echo "   - Wait for services to start (hobby plan has cold starts)"
echo "   - Test frontend URL"
echo "   - Test API health endpoint"
echo "   - Verify database seeding completed"
echo
echo "6. 🚀 Go Live:"
echo "   - Change default admin passwords immediately!"
echo "   - Configure custom domain (optional)"
echo "   - Set up uptime monitoring (recommended for hobby plan)"
echo

print_header "6. Service URLs"
echo "==============="
print_status "Once deployment is complete, your services will be available at:"
echo "Frontend: https://irenes-circus-frontend.onrender.com"
echo "Backend API: https://irenes-circus-backend.onrender.com"
echo "Health Check: https://irenes-circus-backend.onrender.com/api/health"
echo

print_header "7. Database Seeding"
echo "=================="
print_status "The database will be automatically seeded with:"
echo "- Sample tracks, events, band members, and gallery images"
echo "- Admin user: admin@irenescircus.com / admin123"
echo "- Editor user: editor@irenescircus.com / editor123"
echo
print_warning "⚠️  SECURITY: Change default passwords immediately after deployment!"
echo

print_header "8. Hobby Plan Considerations"
echo "============================"
print_status "Important notes for hobby/free plan:"
echo "- Services sleep after 15 minutes of inactivity"
echo "- Cold starts can take 30-60 seconds"
echo "- 750 hours/month compute time included"
echo "- Consider uptime monitoring to keep services warm"
echo
print_header "9. Monitoring & Maintenance"
echo "=========================="
print_status "Monitor your deployment:"
echo "- Render Dashboard: https://dashboard.render.com"
echo "- Service logs are available in the dashboard"
echo "- Monitor for cold starts and wake-up times"
echo "- Check monthly usage limits"
echo

print_success "🎉 Deployment process completed!"
print_status "Your Irene's Circus application should now be live on Render.com"
echo
print_status "For support and documentation:"
echo "- Render Docs: https://render.com/docs"
echo "- Project README files for configuration details"
echo
print_status "Happy performing! 🎪🚀"
