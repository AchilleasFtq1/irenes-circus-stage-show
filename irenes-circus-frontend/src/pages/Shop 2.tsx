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

  useEffect(() => {
    productsAPI.getAll({ active: true }).then(setProducts).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, []);

  const handleBuyStripe = async (product: IProduct) => {
    const params = {
      items: [{ productId: product._id, quantity: 1 }],
      currency: product.currency,
      successUrl: `${window.location.origin}/shop/success`,
      cancelUrl: `${window.location.origin}/shop/cancel`,
      collectShipping: true
    };
    const { url } = await checkoutAPI.stripeCreateSession(params);
    window.location.href = url;
  };

  const handleBuyPayPal = async (product: IProduct) => {
    const params = {
      items: [{ productId: product._id, quantity: 1 }],
      currency: product.currency,
      returnUrl: `${window.location.origin}/shop/success`,
      cancelUrl: `${window.location.origin}/shop/cancel`,
      collectShipping: true
    };
    const { url } = await checkoutAPI.paypalCreateOrder(params);
    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-circus-cream to-gray-50 text-circus-dark">
      <Navbar />
      <section className="container mx-auto px-4 py-12">
        <h1 className="font-circus text-4xl mb-6">Shop</h1>
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
              <div className="font-bold mb-3">{currency(p.priceCents, p.currency)}</div>
              <div className="mt-auto flex gap-2">
                <Button onClick={() => handleBuyStripe(p)} className="flex-1">Buy with Stripe</Button>
                <Button onClick={() => handleBuyPayPal(p)} variant="outline" className="flex-1">PayPal</Button>
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


