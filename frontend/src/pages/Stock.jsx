import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { stockAPI } from '../services/api';

const Stock = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('item'); // 'item' or 'movement'
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'MATERIA_PRIMA',
    unit: 'unidades',
    quantity: 0,
    minQuantity: 0,
  });
  const [movementData, setMovementData] = useState({
    stockItemId: '',
    type: 'IN',
    quantity: 0,
    reason: '',
  });

  useEffect(() => {
    fetchItems();
  }, [search, typeFilter]);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const response = await stockAPI.getAll(search, typeFilter);
      setItems(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load stock items');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (type, item = null) => {
    setModalType(type);
    if (type === 'item') {
      if (item) {
        setEditingId(item.id);
        setFormData(item);
      } else {
        setEditingId(null);
        setFormData({
          name: '',
          type: 'MATERIA_PRIMA',
          unit: 'unidades',
          quantity: 0,
          minQuantity: 0,
        });
      }
    } else {
      setMovementData({
        stockItemId: '',
        type: 'IN',
        quantity: 0,
        reason: '',
      });
    }
    setShowModal(true);
  };

  const handleSubmitItem = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await stockAPI.update(editingId, formData);
      } else {
        await stockAPI.create(formData);
      }
      setShowModal(false);
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save stock item');
    }
  };

  const handleSubmitMovement = async (e) => {
    e.preventDefault();
    try {
      await stockAPI.addMovement(movementData);
      setShowModal(false);
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to record movement');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this stock item?')) {
      try {
        await stockAPI.delete(id);
        fetchItems();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete stock item');
      }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Layout>
      <div className="page-transition">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Estoque</h1>
          <div className="space-x-3">
            <button onClick={() => handleOpenModal('item')} className="btn-primary">
              + Novo Item
            </button>
            <button onClick={() => handleOpenModal('movement')} className="btn-secondary">
              + Movimentação
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by item name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-base"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="input-base"
          >
            <option value="">All Types</option>
            <option value="MATERIA_PRIMA">Matéria Prima</option>
            <option value="PRODUTO_ACABADO">Produto Acabado</option>
          </select>
        </div>

        {/* Table */}
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Quantidade
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Unidade
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Mínimo
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                const isLow = item.quantity <= item.minQuantity;
                return (
                  <tr
                    key={item.id}
                    className={`table-row-hover border-b ${
                      isLow ? 'bg-red-50' : ''
                    }`}
                  >
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {item.type === 'MATERIA_PRIMA' ? 'Matéria Prima' : 'Produto Acabado'}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.unit}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.minQuantity}</td>
                    <td className="px-6 py-4 text-sm">
                      {isLow ? (
                        <span className="status-badge status-pending">Low Stock ⚠️</span>
                      ) : (
                        <span className="status-badge bg-green-100 text-green-800">OK</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm space-x-2">
                      <button
                        onClick={() => handleOpenModal('item', item)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {items.length === 0 && (
            <p className="text-center py-8 text-gray-600">No stock items found</p>
          )}
        </div>

        {/* Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={
            modalType === 'item'
              ? editingId
                ? 'Edit Stock Item'
                : 'New Stock Item'
              : 'Register Movement'
          }
        >
          {modalType === 'item' ? (
            <form onSubmit={handleSubmitItem} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Item Name *
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
                    <option value="MATERIA_PRIMA">Matéria Prima</option>
                    <option value="PRODUTO_ACABADO">Produto Acabado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Unit *
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                    className="input-base"
                    placeholder="e.g., metros, unidades, kg"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Quantity
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: parseFloat(e.target.value) })
                    }
                    className="input-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Minimum Quantity
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.minQuantity}
                    onChange={(e) =>
                      setFormData({ ...formData, minQuantity: parseFloat(e.target.value) })
                    }
                    className="input-base"
                  />
                </div>
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
          ) : (
            <form onSubmit={handleSubmitMovement} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Stock Item *
                </label>
                <select
                  value={movementData.stockItemId}
                  onChange={(e) =>
                    setMovementData({ ...movementData, stockItemId: e.target.value })
                  }
                  className="input-base"
                  required
                >
                  <option value="">Select item</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Type *
                </label>
                <select
                  value={movementData.type}
                  onChange={(e) => setMovementData({ ...movementData, type: e.target.value })}
                  className="input-base"
                >
                  <option value="IN">Entrada (IN)</option>
                  <option value="OUT">Saída (OUT)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={movementData.quantity}
                  onChange={(e) =>
                    setMovementData({
                      ...movementData,
                      quantity: parseFloat(e.target.value),
                    })
                  }
                  className="input-base"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Reason
                </label>
                <input
                  type="text"
                  value={movementData.reason}
                  onChange={(e) =>
                    setMovementData({ ...movementData, reason: e.target.value })
                  }
                  className="input-base"
                  placeholder="e.g., Compra fornecedor, Entrega pedido"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  Register
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
          )}
        </Modal>
      </div>
    </Layout>
  );
};

export default Stock;
