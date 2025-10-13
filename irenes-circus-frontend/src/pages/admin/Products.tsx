import { useEffect, useMemo, useState } from 'react';
import { productsAPI, uploadAPI } from '@/lib/api';
import { IProduct } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, ImagePlus, X } from 'lucide-react';

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
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [autoSlug, setAutoSlug] = useState(true);
  const [query, setQuery] = useState('');

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

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return products;
    const q = query.toLowerCase();
    return products.filter(p =>
      p.title.toLowerCase().includes(q) ||
      (p.sku || '').toLowerCase().includes(q) ||
      (p.description || '').toLowerCase().includes(q)
    );
  }, [products, query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Upload images if selected
      let uploadedImages: Array<{ url: string; alt?: string }> = [];
      if (imageFiles.length > 0) {
        setUploading(true);
        for (const f of imageFiles) {
          const { url } = await uploadAPI.uploadImage(f);
          uploadedImages.push({ url, alt: formData.title });
        }
        setUploading(false);
      }

      const data = {
        ...formData,
        images: uploadedImages.length > 0 ? uploadedImages : formData.images
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
    setImageFiles([]);
    setEditingProduct(null);
    setShowForm(false);
    setAutoSlug(true);
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
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="mr-2" size={20} />
          Add Product
        </Button>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <input
          type="text"
          placeholder="Search by title, SKU, or description..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full p-2 border rounded"
        />
      </div>

      {error && <div className="text-red-600 mb-4">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow mb-6">
          <h2 className="font-edgy text-xl mb-4">{editingProduct ? 'Edit' : 'New'} Product</h2>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Title</label>
              <input
                type="text"
                placeholder="e.g. Poster"
                value={formData.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setFormData({ ...formData, title, slug: autoSlug ? generateSlug(title) : formData.slug });
                }}
                className="p-2 border rounded w-full"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-1">Slug</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="poster"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="p-2 border rounded w-full"
                  disabled={autoSlug}
                  required
                />
                <label className="flex items-center gap-2 text-sm whitespace-nowrap">
                  <input type="checkbox" checked={autoSlug} onChange={(e) => setAutoSlug(e.target.checked)} />
                  Auto
                </label>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-1">Description</label>
              <textarea
                placeholder="Short description that appears on the product page"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="p-2 border rounded w-full"
                rows={3}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-1">Price</label>
              <div className="flex gap-2">
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
                  type="number"
                  placeholder="Price in cents"
                  value={formData.priceCents}
                  onChange={(e) => setFormData({ ...formData, priceCents: parseInt(e.target.value) || 0 })}
                  className="p-2 border rounded w-full"
                  required
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">Enter price in cents (e.g. €9.99 = 999)</p>
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-1">SKU</label>
              <input
                type="text"
                placeholder="Optional"
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="p-2 border rounded w-full"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-1">Inventory</label>
              <input
                type="number"
                placeholder="0"
                value={formData.inventoryCount}
                onChange={(e) => setFormData({ ...formData, inventoryCount: parseInt(e.target.value) || 0 })}
                className="p-2 border rounded w-full"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block mb-2 font-semibold">Product Images</label>
              <div className="flex items-center gap-2 mb-2">
                <label className="inline-flex items-center gap-2 px-3 py-2 border rounded cursor-pointer bg-gray-50 hover:bg-gray-100">
                  <ImagePlus size={16} /> Upload Images
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => setImageFiles(Array.from(e.target.files || []))}
                  />
                </label>
                {imageFiles.length > 0 && (
                  <span className="text-sm text-gray-600">{imageFiles.length} file(s) selected</span>
                )}
              </div>
              {(formData.images.length > 0 || imageFiles.length > 0) && (
                <div className="flex flex-wrap gap-2">
                  {formData.images.map((img, idx) => (
                    <div key={`existing-${idx}`} className="relative">
                      <img src={img.url} alt="Existing" className="h-20 w-20 object-cover rounded" />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, images: formData.images.filter((_, i) => i !== idx) })}
                        className="absolute -top-2 -right-2 bg-black/70 text-white rounded-full p-1"
                        aria-label="Remove image"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  {imageFiles.map((f, idx) => (
                    <img key={`new-${idx}`} src={URL.createObjectURL(f)} alt={f.name} className="h-20 w-20 object-cover rounded" />
                  ))}
                </div>
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
              {filteredProducts.map((product) => (
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
