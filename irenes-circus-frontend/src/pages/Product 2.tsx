import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { productsAPI, checkoutAPI } from '@/lib/api';
import { IProduct } from '@/lib/types';
import { useCart } from '@/contexts/CartContext';

const currency = (cents: number, code: string) => new Intl.NumberFormat(undefined, { style: 'currency', currency: code }).format(cents / 100);

const ProductPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { add } = useCart();

  useEffect(() => {
    if (!slug) return;
    productsAPI.getBySlug(slug).then(setProduct).catch(e => setError(e.message)).finally(() => setLoading(false));
  }, [slug]);

  const buyStripe = async () => {
    if (!product) return;
    const { url } = await checkoutAPI.stripeCreateSession({
      items: [{ productId: product._id, quantity: 1 }],
      currency: product.currency,
      successUrl: `${window.location.origin}/shop/success`,
      cancelUrl: `${window.location.origin}/shop/cancel`,
      collectShipping: true
    });
    window.location.href = url;
  };

  if (loading) return <div className="min-h-screen"><Navbar /><div className="p-8">Loading...</div><Footer /></div>;
  if (error || !product) return <div className="min-h-screen"><Navbar /><div className="p-8 text-red-600">{error || 'Not found'}</div><Footer /></div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-circus-cream to-gray-50 text-circus-dark">
      <Navbar />
      <section className="container mx-auto px-4 py-12 grid md:grid-cols-2 gap-8">
        <div>
          <img 
            src={product.images[selectedImageIndex]?.url || '/images/placeholder.png'} 
            alt={product.images[selectedImageIndex]?.alt || product.title} 
            className="w-full rounded shadow mb-4" 
          />
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
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
        <div>
          <h1 className="font-circus text-4xl mb-4">{product.title}</h1>
          <div className="font-bold text-2xl mb-4">{currency(product.priceCents, product.currency)}</div>
          <p className="font-alt mb-6">{product.description}</p>

          <div className="flex gap-2">
            <Button onClick={() => add(product, 1)}>Add to Cart</Button>
            <Button onClick={buyStripe} variant="outline">Buy Now</Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default ProductPage;


