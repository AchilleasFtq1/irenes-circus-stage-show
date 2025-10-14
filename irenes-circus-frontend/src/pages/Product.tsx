import { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2, ShoppingCart } from 'lucide-react';
import { productsAPI, checkoutAPI } from '@/lib/api';
import { IProduct, IProductVariant } from '@/lib/types';
import { useCart } from '@/contexts/CartContext';

const currency = (cents: number, code: string) => new Intl.NumberFormat(undefined, { style: 'currency', currency: code }).format(cents / 100);

const ProductPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null || !product) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) setSelectedImageIndex(prev => Math.min(prev + 1, (product?.images.length || 1) - 1));
    else setSelectedImageIndex(prev => Math.max(prev - 1, 0));
    touchStartX.current = null;
  };
  const [stripeLoading, setStripeLoading] = useState(false);
  const { add } = useCart();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState<number | null>(null);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!slug) return;
    productsAPI.getBySlug(slug).then(setProduct).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, [slug]);

  const buyStripe = async () => {
    if (!product) return;
    try {
      setStripeLoading(true);
      const { url } = await checkoutAPI.stripeCreateSession({
        items: [{ productId: product._id, quantity: 1 }],
        currency: product.currency,
        successUrl: `${window.location.origin}/shop/success`,
        cancelUrl: `${window.location.origin}/shop/cancel`,
        collectShipping: true
      });
      window.location.href = url;
    } catch (e) {
      setStripeLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen"><Navbar /><div className="p-8">Loading...</div><Footer /></div>;
  if (error || !product) return <div className="min-h-screen"><Navbar /><div className="p-8 text-red-600">{error || 'Not found'}</div><Footer /></div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-circus-cream to-gray-50 text-circus-dark">
      <Navbar />
      <section className="container mx-auto px-4 py-12 grid md:grid-cols-2 gap-8">
        <div>
          <div className="relative">
            <img 
              src={product.images[selectedImageIndex]?.url || '/images/placeholder.png'} 
              alt={product.images[selectedImageIndex]?.alt || product.title} 
              className="w-full rounded shadow mb-2 select-none cursor-zoom-in" 
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              onClick={() => setLightboxOpen(true)}
            />
            {product.images.length > 1 && (
              <div className="absolute inset-y-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-2">
                <button aria-label="Prev" className="bg-black/40 text-white rounded-full px-2 py-1" onClick={() => setSelectedImageIndex(i => Math.max(0, i-1))}>{'<'}</button>
                <button aria-label="Next" className="bg-black/40 text-white rounded-full px-2 py-1" onClick={() => setSelectedImageIndex(i => Math.min((product.images.length-1), i+1))}>{'>'}</button>
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <img 
                  key={idx}
                  src={img.url} 
                  alt={img.alt || product.title}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 h-20 object-cover rounded cursor-pointer border-2 ${
                    idx === selectedImageIndex ? 'border-circus-gold' : 'border-transparent'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
        {lightboxOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
            <div className="relative w-full h-full md:w-auto md:h-auto flex items-center justify-center" onClick={e => e.stopPropagation()}>
              <img
                src={product.images[selectedImageIndex]?.url}
                alt={product.images[selectedImageIndex]?.alt || product.title}
                className="max-h-[90vh] max-w-[95vw] select-none"
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
              />
              {product.images.length > 1 && (
                <div className="absolute inset-y-1/2 -translate-y-1/2 left-0 right-0 flex justify-between px-4">
                  <button aria-label="Prev" className="bg-white/20 text-white rounded-full px-3 py-2" onClick={() => setSelectedImageIndex(i => Math.max(0, i-1))}>{'<'}</button>
                  <button aria-label="Next" className="bg-white/20 text-white rounded-full px-3 py-2" onClick={() => setSelectedImageIndex(i => Math.min(product.images.length-1, i+1))}>{'>'}</button>
                </div>
              )}
              <button aria-label="Close" className="absolute top-4 right-4 bg-white/20 text-white rounded-full px-3 py-1" onClick={() => setLightboxOpen(false)}>✕</button>
            </div>
          </div>
        )}
        <div>
          <h1 className="font-circus text-4xl mb-4">{product.title}</h1>
          <div className="font-bold text-2xl mb-4">
            {currency((selectedVariantIndex !== null && product.variants && product.variants[selectedVariantIndex]?.priceCents) || product.priceCents, product.currency)}
          </div>
          <p className="font-alt mb-6">{product.description}</p>

          {product.variants && product.variants.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm mb-1">Select option</label>
              <select
                className="border rounded p-2 text-black"
                value={selectedVariantIndex ?? ''}
                onChange={e => setSelectedVariantIndex(e.target.value === '' ? null : parseInt(e.target.value))}
              >
                <option value="">Default</option>
                {product.variants.map((v, idx) => (
                  <option key={idx} value={idx}>
                    {v.name}: {v.value}
                    {v.priceCents ? ` (+${currency(v.priceCents - product.priceCents, product.currency)})` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <Button onClick={() => add({ ...product, priceCents: (selectedVariantIndex !== null && product.variants?.[selectedVariantIndex]?.priceCents) || product.priceCents } as IProduct, 1, selectedVariantIndex)} variant="secondary" size="lg" aria-label="Add to cart" className="w-full sm:w-auto">
              <ShoppingCart />
              Add to Cart
            </Button>
            <Button onClick={buyStripe} variant="stripe" size="lg" aria-label="Buy now with Stripe" disabled={stripeLoading} className="w-full sm:w-auto">
              {stripeLoading ? <Loader2 className="animate-spin" /> : <CreditCard />}
              {stripeLoading ? 'Redirecting…' : 'Buy with Stripe'}
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ProductPage;


