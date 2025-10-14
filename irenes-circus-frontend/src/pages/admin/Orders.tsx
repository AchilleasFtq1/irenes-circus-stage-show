import { useEffect, useState } from 'react';
import { ordersAPI } from '@/lib/api';
import { IOrder } from '@/lib/types';
import { Button } from '@/components/ui/button';

const AdminOrders = () => {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const query = filter ? `?status=${encodeURIComponent(filter)}` : '';
      const res = await fetch(`${window.location.origin.replace(window.location.origin, '')}`); // placeholder
    } catch {}
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await ordersAPI.list();
        setOrders(data);
      } catch (e: any) {
        setError(e.message);
      } finally { setLoading(false); }
    })();
  }, []);

  const fulfill = async (id: string) => {
    try {
      const token = localStorage.getItem('auth_token');
      const trackingNumber = window.prompt('Enter tracking number (optional)') || undefined;
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api/orders/${id}/fulfill`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        credentials: 'include',
        body: JSON.stringify({ trackingNumber })
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || 'Failed');
      const updated = await res.json();
      setOrders(prev => prev.map(o => o._id === id ? updated : o));
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <div className="p-6 admin-content">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Orders</h1>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="border rounded p-2">
          <option value="">All</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="fulfilled">Fulfilled</option>
          <option value="cancelled">Cancelled</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>
      {loading ? <div>Loading…</div> : error ? <div className="text-red-600">{error}</div> : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="text-left p-2">Date</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Total</th>
                <th className="text-left p-2">Items</th>
                <th className="text-left p-2"></th>
              </tr>
            </thead>
            <tbody>
              {orders.filter(o => !filter || o.status === filter).map(o => (
                <tr key={o._id} className="border-t">
                  <td className="p-2">{o.createdAt ? new Date(o.createdAt).toLocaleString() : '-'}</td>
                  <td className="p-2 capitalize">{o.status}</td>
                  <td className="p-2 font-semibold">{new Intl.NumberFormat(undefined, { style: 'currency', currency: o.currency }).format(o.totalCents / 100)}</td>
                  <td className="p-2">{o.items.map(i => `${i.title}${i.variant ? ` (${i.variant})` : ''} x${i.quantity}`).join(', ')}</td>
                  <td className="p-2">
                    {o.status === 'paid' && (
                      <Button size="sm" onClick={() => fulfill(o._id)}>Mark fulfilled</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
