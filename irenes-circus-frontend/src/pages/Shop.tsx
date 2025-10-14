import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { productsAPI, checkoutAPI } from '@/lib/api';
import { IProduct } from '@/lib/types';
import { useCart } from '@/contexts/CartContext';

const currency = (cents: number, code: string) => new Intl.NumberFormat(undefined, { style: 'currency', currency: code }).format(cents / 100);

const Shop = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('newest');
  const [q, setQ] = useState('');

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = { active: 'true' };
    if (category) params.category = category;
    if (sort) params.sort = sort;
    if (q) params.q = q;
    const query = '?' + new URLSearchParams(params).toString();
    fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/products${query}`)
      .then(r => r.json())
      .then(setProducts)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [category, sort, q]);

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-circus-cream to-gray-50 text-circus-dark">
      <Navbar />
      <section className="container mx-auto px-4 py-12">
        <h1 className="font-circus text-4xl mb-6">Shop</h1>
        <div className="flex flex-col md:flex-row gap-2 mb-6">
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search" className="border rounded p-2 w-full md:w-1/3" />
          <input value={category} onChange={e => setCategory(e.target.value)} placeholder="Category" className="border rounded p-2 w-full md:w-1/4" />
          <select value={sort} onChange={e => setSort(e.target.value)} className="border rounded p-2 w-full md:w-1/4">
            <option value="newest">Newest</option>
            <option value="priceAsc">Price: Low to High</option>
            <option value="priceDesc">Price: High to Low</option>
          </select>
        </div>
        {loading && <div>Loading...</div>}
        {error && <div className="text-red-600">{error}</div>}
        <div className="grid md:grid-cols-3 gap-6">
          {products.map(p => (
            <div key={p._id} className="bg-white/80 rounded shadow p-4 flex flex-col">
              <a href={`/shop/${p.slug}`}>
                <img src={p.images[0]?.url || '/images/placeholder.png'} alt={p.images[0]?.alt || p.title} className="h-56 object-cover mb-3" />
              </a>
              <h3 className="font-edgy text-xl"><a href={`/shop/${p.slug}`}>{p.title}</a></h3>
              <p className="font-alt text-gray-700 mb-2">{p.description}</p>
              <div className="text-sm text-gray-500 mb-1">{p.category || 'Uncategorized'}</div>
              <div className="font-bold mb-3">{currency(p.priceCents, p.currency)}</div>
              <div className="mt-auto flex flex-col sm:flex-row gap-2">
                <Button onClick={() => handleBuyStripe(p)} variant="stripe" className="flex-1" disabled={loadingId === p._id}>{loadingId === p._id ? 'Redirecting…' : 'Buy with Stripe'}</Button>
                <Button onClick={() => handleBuyPayPal(p)} variant="paypal" className="flex-1" disabled={loadingId === p._id + ':pp'}>{loadingId === p._id + ':pp' ? 'Redirecting…' : 'Pay with PayPal'}</Button>
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


