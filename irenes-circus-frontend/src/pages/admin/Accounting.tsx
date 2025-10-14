import { useState } from 'react';
import { Button } from '@/components/ui/button';

const API = (import.meta.env.VITE_API_URL || 'http://localhost:5001') + '/api';

const AdminAccounting = () => {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [status, setStatus] = useState('paid');
  const [unexported, setUnexported] = useState(true);
  const token = localStorage.getItem('auth_token') || '';

  const exportCsv = async () => {
    const qs = new URLSearchParams({ from, to, status, unexported: String(unexported) }).toString();
    const res = await fetch(`${API}/orders/export/csv?${qs}`, { headers: { Authorization: `Bearer ${token}` }, credentials: 'include' });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'orders.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const markExported = async () => {
    await fetch(`${API}/orders/export/mark`, { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ from, to }) });
    alert('Marked as exported');
  };

  return (
    <div className="p-6 admin-content">
      <h1 className="text-2xl font-bold mb-4">Accounting Export</h1>
      <div className="bg-white p-4 rounded shadow grid md:grid-cols-4 gap-3 mb-4">
        <div>
          <label className="block text-sm mb-1">From</label>
          <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="border rounded p-2 w-full" />
        </div>
        <div>
          <label className="block text-sm mb-1">To</label>
          <input type="date" value={to} onChange={e => setTo(e.target.value)} className="border rounded p-2 w-full" />
        </div>
        <div>
          <label className="block text-sm mb-1">Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)} className="border rounded p-2 w-full">
            <option value="paid">Paid</option>
            <option value="fulfilled">Fulfilled</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
        <label className="flex items-center gap-2 mt-6">
          <input type="checkbox" checked={unexported} onChange={e => setUnexported(e.target.checked)} />
          Only unexported
        </label>
      </div>
      <div className="flex gap-2">
        <Button onClick={exportCsv}>Export CSV</Button>
        <Button variant="ghost" onClick={markExported}>Mark Exported</Button>
      </div>
    </div>
  );
};

export default AdminAccounting;
