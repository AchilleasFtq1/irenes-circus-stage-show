import { useEffect, useState } from 'react';
import { promotionsAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';

type Promo = {
  _id: string;
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  active: boolean;
  startsAt?: string;
  endsAt?: string;
  minimumSubtotalCents?: number;
};

const AdminPromotions = () => {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Partial<Promo>>({ type: 'percent', value: 10, active: true });
  const [editing, setEditing] = useState<Promo | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await promotionsAPI.list();
      setPromos(data);
    } catch (e: any) {
      setError(e.message);
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editing) {
        await promotionsAPI.update(editing._id, form);
      } else {
        await promotionsAPI.create(form);
      }
      setForm({ type: 'percent', value: 10, active: true });
      setEditing(null);
      load();
    } catch (e: any) { setError(e.message); }
  };

  const remove = async (id: string) => {
    if (!confirm('Delete this promotion?')) return;
    await promotionsAPI.delete(id);
    load();
  };

  return (
    <div className="p-6 admin-content">
      <h1 className="text-2xl font-bold mb-4">Promotions</h1>
      {error && <div className="text-red-600 mb-2">{error}</div>}

      <form onSubmit={submit} className="bg-white p-4 rounded shadow mb-6 grid md:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm mb-1">Code</label>
          <input value={form.code || ''} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} className="border rounded p-2 w-full" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Type</label>
          <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as any })} className="border rounded p-2 w-full">
            <option value="percent">Percent</option>
            <option value="fixed">Fixed (cents)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">Value</label>
          <input type="number" value={form.value as number} onChange={e => setForm({ ...form, value: Number(e.target.value) })} className="border rounded p-2 w-full" required />
        </div>
        <div>
          <label className="block text-sm mb-1">Min Subtotal (cents)</label>
          <input type="number" value={form.minimumSubtotalCents || 0} onChange={e => setForm({ ...form, minimumSubtotalCents: Number(e.target.value) })} className="border rounded p-2 w-full" />
        </div>
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={!!form.active} onChange={e => setForm({ ...form, active: e.target.checked })} />
          <span>Active</span>
        </div>
        <div className="md:col-span-3">
          <Button type="submit">{editing ? 'Update' : 'Create'}</Button>
          {editing && <Button variant="ghost" type="button" onClick={() => { setEditing(null); setForm({ type: 'percent', value: 10, active: true }); }}>Cancel</Button>}
        </div>
      </form>

      {loading ? <div>Loading…</div> : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="text-left p-2">Code</th>
                <th className="text-left p-2">Type</th>
                <th className="text-left p-2">Value</th>
                <th className="text-left p-2">Active</th>
                <th className="text-left p-2">Min Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {promos.map(p => (
                <tr key={p._id} className="border-t">
                  <td className="p-2 font-mono">{p.code}</td>
                  <td className="p-2">{p.type}</td>
                  <td className="p-2">{p.type === 'percent' ? `${p.value}%` : `${p.value}¢`}</td>
                  <td className="p-2">{p.active ? 'Yes' : 'No'}</td>
                  <td className="p-2">{p.minimumSubtotalCents || 0}</td>
                  <td className="p-2 flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => { setEditing(p); setForm(p); }}>Edit</Button>
                    <Button size="sm" variant="ghost" onClick={() => remove(p._id)}>Delete</Button>
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

export default AdminPromotions;


