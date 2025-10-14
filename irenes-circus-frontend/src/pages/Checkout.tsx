import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2 } from 'lucide-react';
import { checkoutAPI } from '@/lib/api';

const fmt = (cents: number, cur: string) => new Intl.NumberFormat(undefined, { style: 'currency', currency: cur }).format(cents / 100);

const Checkout = () => {
  const { items, totalCents, clear, updateQuantity, remove } = useCart();
  const currency = items[0]?.product.currency || 'EUR';
  const [country, setCountry] = useState('GR');
  const [promoCode, setPromoCode] = useState('');
  const [giftCardCode, setGiftCardCode] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [step, setStep] = useState<'contact' | 'shipping' | 'payment' | 'review'>('contact');

  const [loading, setLoading] = useState<'stripe' | 'paypal' | null>(null);

  const stripeCheckout = async () => {
    setLoading('stripe');
    const { url } = await checkoutAPI.stripeCreateSession({
      items: items.map(i => ({ productId: i.product._id, quantity: i.quantity, variantIndex: (i as any).variantIndex ?? null })),
      currency,
      successUrl: `${window.location.origin}/shop/success`,
      cancelUrl: `${window.location.origin}/shop/cancel`,
      collectShipping: true,
      shippingCountry: country,
      promoCode: promoCode || undefined,
      giftCardCode: giftCardCode || undefined,
      contact: { name: contactName || undefined, email: contactEmail || undefined }
    });
    window.location.href = url;
  };

  const paypalCheckout = async () => {
    setLoading('paypal');
    const { url } = await checkoutAPI.paypalCreateOrder({
      items: items.map(i => ({ productId: i.product._id, quantity: i.quantity, variantIndex: (i as any).variantIndex ?? null })),
      currency,
      returnUrl: `${window.location.origin}/shop/success`,
      cancelUrl: `${window.location.origin}/shop/cancel`,
      collectShipping: true,
      shippingCountry: country,
      promoCode: promoCode || undefined,
      giftCardCode: giftCardCode || undefined,
      contact: { name: contactName || undefined, email: contactEmail || undefined }
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
              <div className="mb-4 flex gap-2">
                {(['contact','shipping','payment','review'] as const).map(s => (
                  <button key={s} className={`px-3 py-1 rounded ${step===s?'bg-circus-gold text-black':'bg-gray-100 text-gray-700'}`} onClick={() => setStep(s)}>{s}</button>
                ))}
              </div>

              {step === 'contact' && (
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm mb-1">Name</label>
                    <input value={contactName} onChange={e => setContactName(e.target.value)} className="border rounded p-2 w-full text-black" />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Email</label>
                    <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} className="border rounded p-2 w-full text-black" />
                  </div>
                </div>
              )}

              {step === 'shipping' && (
                <div className="mb-4">
                  <label className="block text-sm mb-1">Shipping Country</label>
                  <select value={country} onChange={e => setCountry(e.target.value)} className="w-full border rounded p-2 text-black">
                    {['GR','DE','FR','IT','ES','IE','NL','BE','SE','NO','DK','FI','AT','CH','LU','PT','GB','PL','CZ','HR','US'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              )}

              {step === 'review' && (
                <div className="mb-4 text-sm text-gray-700">
                  <div>Contact: {contactName || '-'} / {contactEmail || '-'}</div>
                  <div>Shipping: {country}</div>
                </div>
              )}
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
              <div className="text-sm text-gray-500 mb-4">Taxes and shipping calculated based on your country.</div>
              {step !== 'payment' && (
                <div className="mb-2">
                  <label className="block text-sm mb-1">Discount code</label>
                  <input value={promoCode} onChange={e => setPromoCode(e.target.value)} placeholder="Enter code" className="w-full border rounded p-2 text-black" />
                </div>
              )}
              {step !== 'payment' && (
                <div className="mb-4">
                  <label className="block text-sm mb-1">Gift card</label>
                  <input value={giftCardCode} onChange={e => setGiftCardCode(e.target.value)} placeholder="Enter gift card code" className="w-full border rounded p-2 text-black" />
                </div>
              )}
              <div className="mb-4">
                <label className="block text-sm mb-1">Discount code</label>
                <input value={promoCode} onChange={e => setPromoCode(e.target.value)} placeholder="Enter code" className="w-full border rounded p-2 text-black" />
              </div>
              <div className="flex flex-col gap-2">
                <Button onClick={stripeCheckout} variant="stripe" size="lg" aria-label="Pay with Stripe" disabled={loading !== null}>
                  {loading === 'stripe' ? <Loader2 className="animate-spin" /> : <CreditCard />}
                  {loading === 'stripe' ? 'Redirecting…' : 'Pay with Stripe'}
                </Button>
                <Button onClick={paypalCheckout} variant="paypal" size="lg" aria-label="Pay with PayPal" disabled={loading !== null}>
                  {loading === 'paypal' ? <Loader2 className="animate-spin" /> : null}
                  {loading === 'paypal' ? 'Redirecting…' : 'Pay with PayPal'}
                </Button>
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


