import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { CreditCard, Loader2, ChevronRight, Check, ShoppingBag, Truck, CreditCard as PaymentIcon, FileText } from 'lucide-react';
import { checkoutAPI } from '@/lib/api';

const fmt = (cents: number, cur: string) => new Intl.NumberFormat(undefined, { style: 'currency', currency: cur }).format(cents / 100);

const Checkout = () => {
  const { items, totalCents, clear, updateQuantity, remove } = useCart();
  const currency = items[0]?.product.currency || 'EUR';
  
  // Contact & Shipping Info
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('GR');
  
  // Discount codes
  const [promoCode, setPromoCode] = useState('');
  const [giftCardCode, setGiftCardCode] = useState('');
  
  const [step, setStep] = useState(1);
  const steps = [
    { number: 1, name: 'Information', icon: FileText },
    { number: 2, name: 'Shipping', icon: Truck },
    { number: 3, name: 'Payment', icon: PaymentIcon }
  ];

  const [loading, setLoading] = useState<'stripe' | 'paypal' | null>(null);

  const validateStep1 = () => {
    return contactEmail && contactName && phone && addressLine1 && city && postalCode && country;
  };

  const validateStep2 = () => {
    return true; // Shipping method selection could go here
  };

  const nextStep = () => {
    if (step === 1 && !validateStep1()) {
      alert('Please fill in all required fields');
      return;
    }
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const stripeCheckout = async () => {
    setLoading('stripe');
    const shippingAddress = {
      line1: addressLine1,
      line2: addressLine2,
      city,
      state,
      postal_code: postalCode,
      country
    };
    
    const { url } = await checkoutAPI.stripeCreateSession({
      items: items.map(i => ({ productId: i.product._id, quantity: i.quantity, variantIndex: (i as any).variantIndex ?? null })),
      currency,
      successUrl: `${window.location.origin}/shop/success`,
      cancelUrl: `${window.location.origin}/shop/cancel`,
      collectShipping: false, // We're collecting it ourselves
      shippingCountry: country,
      promoCode: promoCode || undefined,
      giftCardCode: giftCardCode || undefined,
      contact: { 
        name: contactName,
        email: contactEmail,
        phone,
        address: shippingAddress
      }
    });
    window.location.href = url;
  };

  const paypalCheckout = async () => {
    setLoading('paypal');
    const shippingAddress = {
      line1: addressLine1,
      line2: addressLine2,
      city,
      state,
      postal_code: postalCode,
      country
    };
    
    const { url } = await checkoutAPI.paypalCreateOrder({
      items: items.map(i => ({ productId: i.product._id, quantity: i.quantity, variantIndex: (i as any).variantIndex ?? null })),
      currency,
      returnUrl: `${window.location.origin}/shop/success`,
      cancelUrl: `${window.location.origin}/shop/cancel`,
      collectShipping: false, // We're collecting it ourselves
      shippingCountry: country,
      promoCode: promoCode || undefined,
      giftCardCode: giftCardCode || undefined,
      contact: { 
        name: contactName,
        email: contactEmail,
        phone,
        address: shippingAddress
      }
    });
    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center py-4">
            {steps.map((s, idx) => (
              <div key={s.number} className="flex-1 flex items-center">
                <div className="flex items-center">
                  <div 
                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all ${
                      step > s.number 
                        ? 'bg-circus-gold border-circus-gold text-white' 
                        : step === s.number 
                        ? 'border-circus-gold text-circus-gold bg-white' 
                        : 'border-gray-300 text-gray-400 bg-white'
                    }`}
                  >
                    {step > s.number ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                  </div>
                  <span className={`ml-3 font-medium ${step >= s.number ? 'text-gray-900' : 'text-gray-400'}`}>
                    {s.name}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-4 ${step > s.number ? 'bg-circus-gold' : 'bg-gray-300'}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {items.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-4">Add some items to get started</p>
            <Button onClick={() => window.location.href = '/shop'} className="bg-circus-gold text-black hover:bg-circus-gold/90">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                {/* Step 1: Information */}
                {step === 1 && (
                  <>
                    <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
                    
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Full Name *</label>
                          <input 
                            type="text"
                            value={contactName} 
                            onChange={e => setContactName(e.target.value)} 
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-circus-gold focus:border-transparent" 
                            placeholder="John Doe"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Email Address *</label>
                          <input 
                            type="email" 
                            value={contactEmail} 
                            onChange={e => setContactEmail(e.target.value)} 
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-circus-gold focus:border-transparent" 
                            placeholder="john@example.com"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Phone Number *</label>
                        <input 
                          type="tel"
                          value={phone} 
                          onChange={e => setPhone(e.target.value)} 
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-circus-gold focus:border-transparent" 
                          placeholder="+30 123 456 7890"
                        />
                      </div>

                      <h3 className="text-lg font-semibold mt-6 mb-4">Shipping Address</h3>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Address Line 1 *</label>
                        <input 
                          type="text"
                          value={addressLine1} 
                          onChange={e => setAddressLine1(e.target.value)} 
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-circus-gold focus:border-transparent" 
                          placeholder="123 Main Street"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Address Line 2</label>
                        <input 
                          type="text"
                          value={addressLine2} 
                          onChange={e => setAddressLine2(e.target.value)} 
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-circus-gold focus:border-transparent" 
                          placeholder="Apartment, suite, etc. (optional)"
                        />
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">City *</label>
                          <input 
                            type="text"
                            value={city} 
                            onChange={e => setCity(e.target.value)} 
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-circus-gold focus:border-transparent" 
                            placeholder="Athens"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">State/Province</label>
                          <input 
                            type="text"
                            value={state} 
                            onChange={e => setState(e.target.value)} 
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-circus-gold focus:border-transparent" 
                            placeholder="Attica"
                          />
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Postal Code *</label>
                          <input 
                            type="text"
                            value={postalCode} 
                            onChange={e => setPostalCode(e.target.value)} 
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-circus-gold focus:border-transparent" 
                            placeholder="10234"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Country *</label>
                          <select 
                            value={country} 
                            onChange={e => setCountry(e.target.value)} 
                            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-circus-gold focus:border-transparent"
                          >
                            <option value="GR">Greece</option>
                            <option value="DE">Germany</option>
                            <option value="FR">France</option>
                            <option value="IT">Italy</option>
                            <option value="ES">Spain</option>
                            <option value="IE">Ireland</option>
                            <option value="NL">Netherlands</option>
                            <option value="BE">Belgium</option>
                            <option value="SE">Sweden</option>
                            <option value="NO">Norway</option>
                            <option value="DK">Denmark</option>
                            <option value="FI">Finland</option>
                            <option value="AT">Austria</option>
                            <option value="CH">Switzerland</option>
                            <option value="LU">Luxembourg</option>
                            <option value="PT">Portugal</option>
                            <option value="GB">United Kingdom</option>
                            <option value="PL">Poland</option>
                            <option value="CZ">Czech Republic</option>
                            <option value="HR">Croatia</option>
                            <option value="US">United States</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end">
                      <Button 
                        onClick={nextStep} 
                        className="bg-circus-gold text-black hover:bg-circus-gold/90 px-8"
                      >
                        Continue to Shipping
                        <ChevronRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </>
                )}

                {/* Step 2: Shipping */}
                {step === 2 && (
                  <>
                    <h2 className="text-2xl font-semibold mb-6">Shipping Method</h2>
                    
                    <div className="space-y-3">
                      <div className="border rounded-lg p-4 cursor-pointer hover:border-circus-gold transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Standard Shipping</h4>
                            <p className="text-sm text-gray-600">5-7 business days</p>
                          </div>
                          <span className="font-medium">€5.00</span>
                        </div>
                      </div>
                      
                      <div className="border rounded-lg p-4 cursor-pointer hover:border-circus-gold transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Express Shipping</h4>
                            <p className="text-sm text-gray-600">2-3 business days</p>
                          </div>
                          <span className="font-medium">€15.00</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-between">
                      <Button onClick={prevStep} variant="outline">
                        Back
                      </Button>
                      <Button 
                        onClick={nextStep} 
                        className="bg-circus-gold text-black hover:bg-circus-gold/90 px-8"
                      >
                        Continue to Payment
                        <ChevronRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </>
                )}

                {/* Step 3: Payment */}
                {step === 3 && (
                  <>
                    <h2 className="text-2xl font-semibold mb-6">Payment</h2>
                    
                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <h3 className="font-medium mb-3">Billing Address</h3>
                      <p className="text-sm text-gray-600">Same as shipping address</p>
                      <div className="mt-2 text-sm">
                        <p>{contactName}</p>
                        <p>{addressLine1} {addressLine2}</p>
                        <p>{city}, {state} {postalCode}</p>
                        <p>{country}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <Button 
                        onClick={stripeCheckout} 
                        variant="stripe" 
                        size="lg" 
                        aria-label="Pay with Stripe" 
                        disabled={loading !== null}
                        className="w-full"
                      >
                        {loading === 'stripe' ? <Loader2 className="animate-spin" /> : <CreditCard />}
                        {loading === 'stripe' ? 'Processing...' : 'Pay with Card (Stripe)'}
                      </Button>
                      
                      <Button 
                        onClick={paypalCheckout} 
                        variant="paypal" 
                        size="lg" 
                        aria-label="Pay with PayPal" 
                        disabled={loading !== null}
                        className="w-full"
                      >
                        {loading === 'paypal' ? <Loader2 className="animate-spin" /> : null}
                        {loading === 'paypal' ? 'Processing...' : 'Pay with PayPal'}
                      </Button>
                    </div>
                    
                    <div className="mt-8 flex justify-between">
                      <Button onClick={prevStep} variant="outline">
                        Back
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Order Summary
                </h3>
                
                {/* Cart Items */}
                <div className="space-y-3 mb-4">
                  {items.map(i => (
                    <div key={i.product._id} className="flex items-center gap-3">
                      <img 
                        src={i.product.images[0]?.url || '/images/placeholder.png'} 
                        alt={i.product.title} 
                        className="w-12 h-12 object-cover rounded" 
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{i.product.title}</p>
                        <p className="text-xs text-gray-600">Qty: {i.quantity}</p>
                      </div>
                      <span className="text-sm font-medium">
                        {fmt(i.product.priceCents * i.quantity, i.product.currency)}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{fmt(totalCents, currency)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping</span>
                    <span>Calculated at next step</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>Calculated at payment</span>
                  </div>
                </div>
                
                {/* Discount codes - only show on step 1 */}
                {step === 1 && (
                  <div className="border-t pt-4 mt-4">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">Discount code</label>
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            value={promoCode} 
                            onChange={e => setPromoCode(e.target.value)} 
                            placeholder="Enter code" 
                            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-circus-gold focus:border-transparent" 
                          />
                          <Button variant="outline" size="sm">Apply</Button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Gift card</label>
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            value={giftCardCode} 
                            onChange={e => setGiftCardCode(e.target.value)} 
                            placeholder="Enter gift card code" 
                            className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-circus-gold focus:border-transparent" 
                          />
                          <Button variant="outline" size="sm">Apply</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Applied codes */}
                {(promoCode || giftCardCode) && step > 1 && (
                  <div className="border-t pt-4 mt-4 space-y-1">
                    {promoCode && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Discount: {promoCode}</span>
                        <span>-€X.XX</span>
                      </div>
                    )}
                    {giftCardCode && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Gift card: {giftCardCode}</span>
                        <span>-€X.XX</span>
                      </div>
                    )}
                  </div>
                )}
                
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{fmt(totalCents, currency)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
};

export default Checkout;


