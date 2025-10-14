import { useEffect, useState } from 'react';
import { shippingAPI } from '@/lib/api';
import { Button } from '@/components/ui/button';

type Option = { id: string; name: string; description?: string; priceCents: number; active?: boolean };

export default function ShippingAdmin() {
  const [country, setCountry] = useState('GR');
  const [options, setOptions] = useState<Option[]>([]);
  const [all, setAll] = useState<Array<{ country: string; options: Option[] }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAll = async () => {
    try {
      const rows = await shippingAPI.listConfigs();
      setAll(rows);
      const row = rows.find((r: any) => r.country === country);
      setOptions(row?.options || []);
    } catch (e: any) {
      setError(e.message || 'Failed to load configs');
    }
  };

  useEffect(() => { loadAll(); }, []);
  useEffect(() => {
    const row = all.find((r: any) => r.country === country);
    setOptions(row?.options || []);
  }, [country, all]);

  const addRow = () => setOptions(prev => [...prev, { id: '', name: '', priceCents: 0, active: true }]);
  const updateRow = (idx: number, patch: Partial<Option>) => setOptions(prev => prev.map((o, i) => i === idx ? { ...o, ...patch } : o));
  const removeRow = (idx: number) => setOptions(prev => prev.filter((_, i) => i !== idx));

  const save = async () => {
    try {
      setLoading(true);
      setError(null);
      // basic sanitize
      const sanitized = options.filter(o => o.id && o.name).map(o => ({ ...o, priceCents: Math.max(0, Math.round(Number(o.priceCents) || 0)) }));
      await shippingAPI.upsertConfig(country, sanitized);
      await loadAll();
    } catch (e: any) {
      setError(e.message || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const del = async () => {
    try {
      setLoading(true);
      setError(null);
      await shippingAPI.deleteConfig(country);
      await loadAll();
    } catch (e: any) {
      setError(e.message || 'Failed to delete');
    } finally {
      setLoading(false);
    }
  };

  const euCountries = ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE','NO','CH','GB'];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Shipping Configuration</h1>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm text-gray-700">Country</label>
        <select value={country} onChange={e => setCountry(e.target.value)} className="border rounded px-2 py-1">
          {euCountries.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <Button onClick={save} disabled={loading} className="bg-circus-gold text-black hover:bg-circus-gold/90">Save</Button>
        <Button onClick={del} disabled={loading} variant="outline">Delete</Button>
      </div>

      <div className="space-y-3">
        {options.map((opt, idx) => (
          <div key={idx} className="border rounded p-3 flex items-center gap-2">
            <input value={opt.id} onChange={e => updateRow(idx, { id: e.target.value })} placeholder="id (e.g., standard)" className="border rounded px-2 py-1 w-40" />
            <input value={opt.name} onChange={e => updateRow(idx, { name: e.target.value })} placeholder="name" className="border rounded px-2 py-1 flex-1" />
            <input value={opt.description || ''} onChange={e => updateRow(idx, { description: e.target.value })} placeholder="description" className="border rounded px-2 py-1 flex-1" />
            <input type="number" value={opt.priceCents} onChange={e => updateRow(idx, { priceCents: Number(e.target.value) })} placeholder="price (cents)" className="border rounded px-2 py-1 w-40" />
            <label className="text-sm text-gray-700 flex items-center gap-1">
              <input type="checkbox" checked={opt.active !== false} onChange={e => updateRow(idx, { active: e.target.checked })} /> Active
            </label>
            <Button variant="outline" onClick={() => removeRow(idx)}>Remove</Button>
          </div>
        ))}
        <Button onClick={addRow} variant="outline">Add Option</Button>
      </div>
    </div>
  );
}


