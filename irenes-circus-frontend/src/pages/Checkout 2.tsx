import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { checkoutAPI } from '@/lib/api';

const fmt = (cents: number, cur: string) => new Intl.NumberFormat(undefined, { style: 'currency', currency: cur }).format(cents / 100);

const Checkout = () => {
  const { items, totalCents, clear, updateQuantity, remove } = useCart();
  const currency = items[0]?.product.currency || 'EUR';

  const stripeCheckout = async () => {
    const { url } = await checkoutAPI.stripeCreateSession({
      items: items.map(i => ({ productId: i.product._id, quantity: i.quantity })),
      currency,
      successUrl: `${window.location.origin}/shop/success`,
      cancelUrl: `${window.location.origin}/shop/cancel`,
      collectShipping: true
    });
    window.location.href = url;
  };

  const paypalCheckout = async () => {
    const { url } = await checkoutAPI.paypalCreateOrder({
      items: items.map(i => ({ productId: i.product._id, quantity: i.quantity })),
      currency,
      returnUrl: `${window.location.origin}/shop/success`,
      cancelUrl: `${window.location.origin}/shop/cancel`,
      collectShipping: true
    });
    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-circus-cream to-gray-50 text-circus-dark">
      <Navbar />
      <section className="container mx-auto px-4 py-12">
        <h1 className="font-circus text-4xl mb-6">Checkout</h1>
        {items.length === 0 ? (
          <div>Your cart is empty.</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white/80 p-4 rounded shadow">
              {items.map(i => (
                <div key={i.product._id} className="flex items-center gap-4 py-3 border-b">
                  <img src={i.product.images[0]?.url || '/images/placeholder.png'} alt={i.product.title} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <div className="font-edgy">{i.product.title}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <button 
                        onClick={() => updateQuantity(i.product._id, i.quantity - 1)}
                        className="text-gray-500 hover:text-gray-700 px-2 py-1 border rounded"
                      >
                        -
                      </button>
                      <span className="px-3">{i.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(i.product._id, i.quantity + 1)}
                        className="text-gray-500 hover:text-gray-700 px-2 py-1 border rounded"
                      >
                        +
                      </button>
                      <button 
                        onClick={() => remove(i.product._id)}
                        className="ml-4 text-red-500 hover:text-red-700 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                  <div className="font-bold">{fmt(i.product.priceCents * i.quantity, i.product.currency)}</div>
                </div>
              ))}
            </div>
            <div className="bg-white/80 p-4 rounded shadow h-fit">
              <div className="flex justify-between mb-2">
                <span className="font-alt">Subtotal</span>
                <span className="font-bold">{fmt(totalCents, currency)}</span>
              </div>
              <div className="text-sm text-gray-500 mb-4">Taxes and shipping calculated at checkout.</div>
              <div className="flex flex-col gap-2">
                <Button onClick={stripeCheckout}>Pay with Stripe</Button>
                <Button onClick={paypalCheckout} variant="outline">Pay with PayPal</Button>
                <Button onClick={clear} variant="ghost">Clear Cart</Button>
              </div>
            </div>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default Checkout;


