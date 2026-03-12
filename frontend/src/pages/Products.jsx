import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { productAPI } from '../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'CAMISETA',
    reference: '',
    sizes: ['P', 'M', 'G', 'GG'],
    colors: ['Branco'],
    salePrice: 0,
  });

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll(search);
      setProducts(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingId(product.id);
      setFormData(product);
    } else {
      setEditingId(null);
      setFormData({
        name: '',
        type: 'CAMISETA',
        reference: '',
        sizes: ['P', 'M', 'G', 'GG'],
        colors: ['Branco'],
        salePrice: 0,
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await productAPI.update(editingId, formData);
      } else {
        await productAPI.create(formData);
      }
      setShowModal(false);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await productAPI.delete(id);
        fetchProducts();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete product');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Layout>
      <div className="page-transition">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
          <button onClick={() => handleOpenModal()} className="btn-primary">
            + Novo Produto
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name or reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-base"
          />
        </div>

        {/* Table */}
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Referência
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Tamanhos
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Cores
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Preço
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="table-row-hover border-b">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {product.reference}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{product.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {product.sizes.join(', ')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {product.colors.join(', ')}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    R$ {product.salePrice.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => handleOpenModal(product)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <p className="text-center py-8 text-gray-600">No products found</p>
          )}
        </div>

        {/* Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editingId ? 'Edit Product' : 'New Product'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-base"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Type *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="input-base"
                >
                  <option>CAMISETA</option>
                  <option>POLO</option>
                  <option>REGATA</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Reference *
                </label>
                <input
                  type="text"
                  value={formData.reference}
                  onChange={(e) =>
                    setFormData({ ...formData, reference: e.target.value })
                  }
                  className="input-base"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Sale Price *
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.salePrice}
                onChange={(e) =>
                  setFormData({ ...formData, salePrice: parseFloat(e.target.value) })
                }
                className="input-base"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Sizes (comma separated)
              </label>
              <input
                type="text"
                value={formData.sizes.join(', ')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    sizes: e.target.value.split(',').map((s) => s.trim()),
                  })
                }
                className="input-base"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Colors (comma separated)
              </label>
              <input
                type="text"
                value={formData.colors.join(', ')}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    colors: e.target.value.split(',').map((s) => s.trim()),
                  })
                }
                className="input-base"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button type="submit" className="btn-primary flex-1">
                {editingId ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

export default Products;
