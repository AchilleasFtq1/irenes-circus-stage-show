import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { ordersAPI } from '@/lib/api';
import { IOrder } from '@/lib/types';

const fmt = (cents: number, cur: string) => new Intl.NumberFormat(undefined, { style: 'currency', currency: cur }).format(cents / 100);

const OrderTracking = () => {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<IOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const data = await ordersAPI.getById(orderId);
      setOrder(data);
    } catch (err: any) {
      setError('Order not found. Please check your order ID.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600';
      case 'fulfilled': return 'text-blue-600';
      case 'cancelled': return 'text-red-600';
      case 'refunded': return 'text-orange-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-circus-cream to-gray-50 text-circus-dark">
      <Navbar />
      <section className="container mx-auto px-4 py-12">
        <h1 className="font-circus text-4xl mb-6">Track Your Order</h1>
        
        <form onSubmit={handleTrack} className="max-w-md mb-8">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter your order ID"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="flex-1 p-2 border rounded"
              required
            />
            <Button type="submit" disabled={loading}>
              {loading ? 'Searching...' : 'Track'}
            </Button>
          </div>
        </form>

        {error && <div className="text-red-600 mb-4">{error}</div>}

        {order && (
          <div className="bg-white/80 p-6 rounded shadow max-w-2xl">
            <h2 className="font-edgy text-2xl mb-4">Order Details</h2>
            
            <div className="grid gap-4">
              <div>
                <span className="font-bold">Order ID:</span> {order._id}
              </div>
              
              <div>
                <span className="font-bold">Status:</span>{' '}
                <span className={`capitalize font-bold ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
              
              <div>
                <span className="font-bold">Date:</span> {new Date(order.createdAt || '').toLocaleDateString()}
              </div>
              
              <div>
                <span className="font-bold">Total:</span> {fmt(order.totalCents, order.currency)}
              </div>

              {order.shippingAddress && (
                <div>
                  <span className="font-bold">Shipping Address:</span>
                  <div className="ml-4 mt-1">
                    <div>{order.shippingAddress.name}</div>
                    <div>{order.shippingAddress.line1}</div>
                    {order.shippingAddress.line2 && <div>{order.shippingAddress.line2}</div>}
                    <div>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}</div>
                    <div>{order.shippingAddress.country}</div>
                  </div>
                </div>
              )}
              
              <div>
                <span className="font-bold">Items:</span>
                <div className="mt-2 space-y-2">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between border-b pb-2">
                      <div>
                        {item.title} x {item.quantity}
                        {item.variant && <span className="text-gray-600"> ({item.variant})</span>}
                      </div>
                      <div>{fmt(item.priceCents * item.quantity, order.currency)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default OrderTracking;
