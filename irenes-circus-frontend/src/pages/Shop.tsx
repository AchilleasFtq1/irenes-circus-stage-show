import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { productsAPI, checkoutAPI } from '@/lib/api';
import { IProduct } from '@/lib/types';
import { useCart } from '@/contexts/CartContext';
import { ShoppingBag, Search, Filter, Sparkles, Star, Package, ChevronDown, X } from 'lucide-react';

const currency = (cents: number, code: string) => new Intl.NumberFormat(undefined, { style: 'currency', currency: code }).format(cents / 100);

const Shop = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const [q, setQ] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { add } = useCart();

  // Fetch categories
  useEffect(() => {
    productsAPI.getCategories()
      .then(setCategories)
      .catch(console.error);
  }, []);

  // Fetch products
  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = { active: 'true' };
    if (selectedCategory) params.category = selectedCategory;
    if (sort) params.sort = sort;
    if (q) params.q = q;
    const query = '?' + new URLSearchParams(params).toString();
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/products${query}`)
      .then(r => r.json())
      .then(setProducts)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [selectedCategory, sort, q]);

  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleBuyStripe = async (product: IProduct) => {
    const params = {
      items: [{ productId: product._id, quantity: 1 }],
      currency: product.currency,
      successUrl: `${window.location.origin}/shop/success`,
      cancelUrl: `${window.location.origin}/shop/cancel`,
      collectShipping: true
    };
    setLoadingId(product._id);
    try {
      const { url } = await checkoutAPI.stripeCreateSession(params);
      window.location.href = url;
    } finally {
      setLoadingId(null);
    }
  };

  const handleBuyPayPal = async (product: IProduct) => {
    const params = {
      items: [{ productId: product._id, quantity: 1 }],
      currency: product.currency,
      returnUrl: `${window.location.origin}/shop/success`,
      cancelUrl: `${window.location.origin}/shop/cancel`,
      collectShipping: true
    };
    setLoadingId(product._id + ':pp');
    try {
      const { url } = await checkoutAPI.paypalCreateOrder(params);
      window.location.href = url;
    } finally {
      setLoadingId(null);
    }
  };

  const handleAddToCart = (product: IProduct) => {
    add(product, 1);
  };

  const categoryIcons: Record<string, React.ReactNode> = {
    'Merchandise': <Package className="w-4 h-4" />,
    'Music': <Sparkles className="w-4 h-4" />,
    'Tickets': <Star className="w-4 h-4" />,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-circus-cream to-gray-50 text-circus-dark">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-circus-gold/20 to-circus-red/20 py-16">
        <div className="absolute inset-0 bg-[url('/images/circus-pattern.png')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h1 className="font-circus text-5xl md:text-7xl mb-4 text-circus-dark animate-fade-in">
            The Circus Shop
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-8 font-alt">
            Step right up and discover magical merchandise!
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <ShoppingBag className="w-4 h-4" />
              {products.length} Products
            </span>
            <span className="text-gray-400">•</span>
            <span className="flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              New Arrivals Weekly
            </span>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="sticky top-0 z-40 bg-white/90 backdrop-blur-md shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search Bar */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                value={q} 
                onChange={e => setQ(e.target.value)} 
                placeholder="Search for magical items..." 
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-circus-gold focus:border-transparent transition-all placeholder-gray-400"
              />
            </div>

            {/* Desktop Filters */}
            <div className="hidden lg:flex items-center gap-3">
              {/* Category Dropdown */}
              <div className="relative">
                <button 
                  className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-full hover:border-circus-gold transition-colors bg-white"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter className="w-4 h-4" />
                  <span>{selectedCategory || 'All Categories'}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
                
                {showFilters && (
                  <div className="absolute top-full mt-2 left-0 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <button
                      onClick={() => {
                        setSelectedCategory('');
                        setShowFilters(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                        !selectedCategory ? 'bg-circus-gold/10 text-circus-gold font-medium' : ''
                      }`}
                    >
                      <Sparkles className="w-4 h-4" />
                      All Categories
                    </button>
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setShowFilters(false);
                        }}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center gap-3 ${
                          selectedCategory === cat ? 'bg-circus-gold/10 text-circus-gold font-medium' : ''
                        }`}
                      >
                        {categoryIcons[cat] || <Package className="w-4 h-4" />}
                        {cat}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Sort Dropdown */}
              <select 
                value={sort} 
                onChange={e => setSort(e.target.value)} 
                className="px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-circus-gold focus:border-transparent bg-white cursor-pointer hover:border-circus-gold transition-colors"
              >
                <option value="newest">Newest First</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </select>
            </div>

            {/* Mobile Filter Button */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-full hover:border-circus-gold transition-colors bg-white"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Mobile Filters */}
          {showFilters && (
            <div className="lg:hidden mt-4 p-4 bg-gray-50 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <button onClick={() => setShowFilters(false)}>
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Category</label>
                  <select 
                    value={selectedCategory} 
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-circus-gold"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Sort By</label>
                  <select 
                    value={sort} 
                    onChange={e => setSort(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-circus-gold"
                  >
                    <option value="newest">Newest First</option>
                    <option value="priceAsc">Price: Low to High</option>
                    <option value="priceDesc">Price: High to Low</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-12">
        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-12 h-12 border-4 border-circus-gold border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Loading magical items...</p>
          </div>
        )}
        
        {error && (
          <div className="text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="secondary">
              Try Again
            </Button>
          </div>
        )}
        
        {!loading && !error && products.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-2">No products found</p>
            <p className="text-gray-500">Try adjusting your filters or search query</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map(p => (
            <div 
              key={p._id} 
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1"
            >
              {/* Product Image */}
              <a href={`/shop/${p.slug}`} className="block relative overflow-hidden aspect-square">
                <img 
                  src={p.images[0]?.url || '/images/placeholder.png'} 
                  alt={p.images[0]?.alt || p.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {p.category && (
                  <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 flex items-center gap-1">
                    {categoryIcons[p.category] || <Package className="w-3 h-3" />}
                    {p.category}
                  </span>
                )}
              </a>
              
              {/* Product Info */}
              <div className="p-5">
                <a href={`/shop/${p.slug}`} className="block mb-3">
                  <h3 className="font-edgy text-xl text-gray-900 group-hover:text-circus-gold transition-colors line-clamp-1">
                    {p.title}
                  </h3>
                </a>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                  {p.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-gray-900">
                    {currency(p.priceCents, p.currency)}
                  </span>
                  {p.inventoryCount > 0 && p.inventoryCount <= 5 && (
                    <span className="text-xs text-orange-600 font-medium">
                      Only {p.inventoryCount} left!
                    </span>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button 
                    onClick={() => handleAddToCart(p)} 
                    variant="secondary" 
                    className="w-full group/btn"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2 group-hover/btn:animate-bounce" />
                    Add to Cart
                  </Button>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => handleBuyStripe(p)} 
                      variant="stripe" 
                      className="flex-1 text-xs py-2"
                      disabled={loadingId === p._id}
                    >
                      {loadingId === p._id ? 'Loading...' : 'Stripe'}
                    </Button>
                    <Button 
                      onClick={() => handleBuyPayPal(p)} 
                      variant="paypal" 
                      className="flex-1 text-xs py-2"
                      disabled={loadingId === p._id + ':pp'}
                    >
                      {loadingId === p._id + ':pp' ? 'Loading...' : 'PayPal'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Shop;