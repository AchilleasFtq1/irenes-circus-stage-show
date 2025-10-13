import { useEffect, useState } from 'react';
import { ordersAPI } from '@/lib/api';
import { IOrder } from '@/lib/types';
import AdminLayout from '@/components/AdminLayout';
import { Button } from '@/components/ui/button';

const fmt = (cents: number, cur: string) => new Intl.NumberFormat(undefined, { style: 'currency', currency: cur }).format(cents / 100);

const OrdersAdmin = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = () => {
    setLoading(true);
    ordersAPI.list().then(setOrders).catch(e => setError(e.message)).finally(() => setLoading(false));
  };

  useEffect(() => { refresh(); }, []);

  const fulfill = async (id: string) => {
    await ordersAPI.fulfill(id);
    refresh();
  };

  return (
    <div className="p-6">
      <h1 className="font-circus text-3xl mb-4">Orders</h1>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="text-left p-2">Date</th>
              <th className="text-left p-2">Items</th>
              <th className="text-left p-2">Total</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(o => (
              <tr key={o._id} className="border-t">
                <td className="p-2">{new Date(o.createdAt || '').toLocaleString()}</td>
                <td className="p-2">{o.items.map(i => `${i.title} x${i.quantity}`).join(', ')}</td>
                <td className="p-2">{fmt(o.totalCents, o.currency)}</td>
                <td className="p-2 capitalize">{o.status}</td>
                <td className="p-2">
                  {o.status === 'paid' && (
                    <Button size="sm" onClick={() => fulfill(o._id)}>Mark Fulfilled</Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersAdmin;


