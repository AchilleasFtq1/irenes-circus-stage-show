import { useEffect, useState } from 'react';
import { giftCardsAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';

type GiftCard = {
  _id: string;
  code: string;
  balanceCents: number;
  originalAmountCents: number;
  status: 'active' | 'redeemed' | 'disabled' | 'expired';
  expiresAt?: string;
  createdAt?: string;
};

const AdminGiftCards = () => {
  const [list, setList] = useState<GiftCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [amount, setAmount] = useState<number>(2500);
  const [expiresAt, setExpiresAt] = useState<string>('');

  const load = async () => {
    setLoading(true);
    try { setList(await giftCardsAPI.list()); } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await giftCardsAPI.create(amount, expiresAt || undefined);
      setAmount(2500); setExpiresAt('');
      load();
    } catch (e: any) { setError(e.message); }
  };

  const disable = async (gc: GiftCard) => {
    await giftCardsAPI.update(gc._id, { status: gc.status === 'disabled' ? 'active' : 'disabled' });
    load();
  };

  const remove = async (id: string) => {
    if (!confirm('Delete gift card?')) return;
    await giftCardsAPI.delete(id);
    load();
  };

  return (
    <div className="p-6 admin-content">
      <h1 className="text-2xl font-bold mb-4">Gift Cards</h1>
      {error && <div className="text-red-600 mb-2">{error}</div>}

      <form onSubmit={create} className="bg-white p-4 rounded shadow mb-6 grid md:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm mb-1">Amount (cents)</label>
          <input type="number" value={amount} onChange={e => setAmount(parseInt(e.target.value) || 0)} className="border rounded p-2 w-full" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Expires At (optional)</label>
          <input type="date" value={expiresAt} onChange={e => setExpiresAt(e.target.value)} className="border rounded p-2 w-full" />
        </div>
        <div className="self-end">
          <Button type="submit">Create gift card</Button>
        </div>
      </form>

      {loading ? <div>Loading…</div> : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="text-left p-2">Code</th>
                <th className="text-left p-2">Balance</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Expires</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {list.map(gc => (
                <tr key={gc._id} className="border-t">
                  <td className="p-2 font-mono">{gc.code}</td>
                  <td className="p-2">{new Intl.NumberFormat(undefined, { style: 'currency', currency: 'EUR' }).format(gc.balanceCents / 100)}</td>
                  <td className="p-2 capitalize">{gc.status}</td>
                  <td className="p-2">{gc.expiresAt ? new Date(gc.expiresAt).toLocaleDateString() : '-'}</td>
                  <td className="p-2 flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => disable(gc)}>{gc.status === 'disabled' ? 'Enable' : 'Disable'}</Button>
                    <Button size="sm" variant="ghost" onClick={() => remove(gc._id)}>Delete</Button>
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

export default AdminGiftCards;
