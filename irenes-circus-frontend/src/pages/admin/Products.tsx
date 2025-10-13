import { useEffect, useState } from 'react';
import { productsAPI, uploadAPI } from '@/lib/api';
import { IProduct } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';

const AdminProducts = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceCents: 0,
    currency: 'EUR',
    sku: '',
    slug: '',
    inventoryCount: 0,
    active: true,
    images: [] as Array<{ url: string; alt?: string }>
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await productsAPI.getAll();
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Upload image if selected
      let imageUrl = '';
      if (imageFile) {
        setUploading(true);
        const { url } = await uploadAPI.uploadImage(imageFile);
        imageUrl = url;
        setUploading(false);
      }

      const data = {
        ...formData,
        images: imageUrl ? [{ url: imageUrl, alt: formData.title }] : formData.images
      };

      if (editingProduct) {
        await productsAPI.update(editingProduct._id, data);
      } else {
        await productsAPI.create(data);
      }
      
      fetchProducts();
      resetForm();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priceCents: 0,
      currency: 'EUR',
      sku: '',
      slug: '',
      inventoryCount: 0,
      active: true,
      images: []
    });
    setImageFile(null);
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleEdit = (product: IProduct) => {
    setFormData({
      title: product.title,
      description: product.description || '',
      priceCents: product.priceCents,
      currency: product.currency,
      sku: product.sku || '',
      slug: product.slug,
      inventoryCount: product.inventoryCount,
      active: product.active,
      images: product.images
    });
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this product?')) {
      await productsAPI.delete(id);
      fetchProducts();
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="font-circus text-3xl">Products</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2" size={20} />
          Add Product
        </Button>
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6">
          <h2 className="font-edgy text-xl mb-4">{editingProduct ? 'Edit' : 'New'} Product</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={(e) => {
                const title = e.target.value;
                setFormData({ ...formData, title, slug: generateSlug(title) });
              }}
              className="p-2 border rounded"
              required
            />
            
            <input
              type="text"
              placeholder="Slug"
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="p-2 border rounded"
              required
            />
            
            <textarea
              placeholder="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="p-2 border rounded md:col-span-2"
              rows={3}
            />
            
            <input
              type="number"
              placeholder="Price (cents)"
              value={formData.priceCents}
              onChange={(e) => setFormData({ ...formData, priceCents: parseInt(e.target.value) || 0 })}
              className="p-2 border rounded"
              required
            />
            
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="p-2 border rounded"
            >
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="GBP">GBP</option>
            </select>
            
            <input
              type="text"
              placeholder="SKU"
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              className="p-2 border rounded"
            />
            
            <input
              type="number"
              placeholder="Inventory"
              value={formData.inventoryCount}
              onChange={(e) => setFormData({ ...formData, inventoryCount: parseInt(e.target.value) || 0 })}
              className="p-2 border rounded"
              required
            />
            
            <div className="md:col-span-2">
              <label className="block mb-2">Product Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="p-2 border rounded w-full"
              />
              {formData.images[0] && (
                <img src={formData.images[0].url} alt="Current" className="mt-2 h-20 object-cover" />
              )}
            </div>
            
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              />
              Active
            </label>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button type="submit" disabled={uploading}>
              {uploading ? 'Uploading...' : editingProduct ? 'Update' : 'Create'}
            </Button>
            <Button type="button" variant="ghost" onClick={resetForm}>Cancel</Button>
          </div>
        </form>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="text-left p-2">Image</th>
                <th className="text-left p-2">Title</th>
                <th className="text-left p-2">Price</th>
                <th className="text-left p-2">Inventory</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id} className="border-t">
                  <td className="p-2">
                    <img 
                      src={product.images[0]?.url || '/images/placeholder.png'} 
                      alt={product.title}
                      className="h-12 w-12 object-cover rounded"
                    />
                  </td>
                  <td className="p-2">{product.title}</td>
                  <td className="p-2">
                    {new Intl.NumberFormat(undefined, { style: 'currency', currency: product.currency })
                      .format(product.priceCents / 100)}
                  </td>
                  <td className="p-2">{product.inventoryCount}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-xs ${product.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {product.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-2">
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleEdit(product)}>
                        <Edit size={16} />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleDelete(product._id)}>
                        <Trash2 size={16} />
                      </Button>
                    </div>
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

export default AdminProducts;
