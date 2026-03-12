import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import { productionOrderAPI, productAPI, orderAPI, authAPI } from '../services/api';

const ProductionOrders = () => {
  const [productionOrders, setProductionOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    orderId: '',
    productId: '',
    quantity: 1,
    size: '',
    color: '',
    deadline: '',
    notes: '',
    responsibleId: '',
  });

  useEffect(() => {
    fetchData();
  }, [search, statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodOrdersRes, productsRes, ordersRes, usersRes] = await Promise.all([
        productionOrderAPI.getAll(search, statusFilter),
        productAPI.getAll(''),
        orderAPI.getAll(''),
        authAPI.getAllUsers(),
      ]);
      setProductionOrders(prodOrdersRes.data);
      setProducts(productsRes.data);
      setOrders(ordersRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load production orders');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (prodOrder = null) => {
    if (prodOrder) {
      setEditingId(prodOrder.id);
      setFormData({
        orderId: prodOrder.orderId || '',
        productId: prodOrder.productId,
        quantity: prodOrder.quantity,
        size: prodOrder.size,
        color: prodOrder.color,
        deadline: prodOrder.deadline ? prodOrder.deadline.split('T')[0] : '',
        notes: prodOrder.notes || '',
        responsibleId: prodOrder.responsibleId || '',
      });
    } else {
      setEditingId(null);
      setFormData({
        orderId: '',
        productId: '',
        quantity: 1,
        size: '',
        color: '',
        deadline: '',
        notes: '',
        responsibleId: '',
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await productionOrderAPI.update(editingId, formData);
      } else {
        await productionOrderAPI.create(formData);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save production order');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this production order?')) {
      try {
        await productionOrderAPI.delete(id);
        fetchData();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete production order');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await productionOrderAPI.updateStatus(id, newStatus);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update production order status');
    }
  };

  if (loading) return <LoadingSpinner />;

  // Group by status for Kanban view
  const byStatus = {
    PENDING: productionOrders.filter((p) => p.status === 'PENDING'),
    IN_PRODUCTION: productionOrders.filter((p) => p.status === 'IN_PRODUCTION'),
    COMPLETED: productionOrders.filter((p) => p.status === 'COMPLETED'),
    CANCELLED: productionOrders.filter((p) => p.status === 'CANCELLED'),
  };

  const statusColors = {
    PENDING: 'bg-yellow-50 border-l-yellow-500',
    IN_PRODUCTION: 'bg-blue-50 border-l-blue-500',
    COMPLETED: 'bg-green-50 border-l-green-500',
    CANCELLED: 'bg-red-50 border-l-red-500',
  };

  return (
    <Layout>
      <div className="page-transition">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Ordens de Produção</h1>
          <button onClick={() => handleOpenModal()} className="btn-primary">
            + Nova Ordem
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
            placeholder="Search by order ID or product name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-base"
          />
        </div>

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {['PENDING', 'IN_PRODUCTION', 'COMPLETED', 'CANCELLED'].map((status) => (
            <div key={status} className="bg-gray-100 rounded-lg p-4">
              <h2 className="font-bold text-gray-900 mb-4">
                {status === 'PENDING'
                  ? 'Pendente'
                  : status === 'IN_PRODUCTION'
                    ? 'Em Produção'
                    : status === 'COMPLETED'
                      ? 'Concluído'
                      : 'Cancelado'}
              </h2>
              <div className="space-y-3">
                {byStatus[status].map((prodOrder) => (
                  <div
                    key={prodOrder.id}
                    className={`p-4 rounded-lg border-l-4 ${statusColors[status]} card`}
                  >
                    <div className="mb-2">
                      <p className="text-sm font-semibold text-gray-900">
                        {prodOrder.product.name}
                      </p>
                      <p className="text-xs text-gray-600">
                        {prodOrder.size} - {prodOrder.color}
                      </p>
                      <p className="text-sm font-semibold text-gray-900 mt-1">
                        Qty: {prodOrder.quantity}
                      </p>
                    </div>
                    {prodOrder.responsible && (
                      <p className="text-xs text-gray-600 mb-2">
                        Responsible: {prodOrder.responsible.name}
                      </p>
                    )}
                    {prodOrder.deadline && (
                      <p className="text-xs text-gray-600 mb-3">
                        Deadline:{' '}
                        {new Date(prodOrder.deadline).toLocaleDateString('pt-BR')}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenModal(prodOrder)}
                        className="text-blue-600 hover:text-blue-800 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(prodOrder.id)}
                        className="text-red-600 hover:text-red-800 text-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editingId ? 'Edit Production Order' : 'New Production Order'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Related Order (optional)
              </label>
              <select
                value={formData.orderId}
                onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                className="input-base"
              >
                <option value="">None</option>
                {orders.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.customer.name} - {o.id.substring(0, 8)}...
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Product *
              </label>
              <select
                value={formData.productId}
                onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                className="input-base"
                required
              >
                <option value="">Select product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({ ...formData, quantity: parseInt(e.target.value) })
                  }
                  className="input-base"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Size *
                </label>
                <select
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="input-base"
                  required
                >
                  <option value="">Select size</option>
                  {formData.productId &&
                    products
                      .find((p) => p.id === formData.productId)
                      ?.sizes.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Color *
              </label>
              <select
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="input-base"
                required
              >
                <option value="">Select color</option>
                {formData.productId &&
                  products
                    .find((p) => p.id === formData.productId)
                    ?.colors.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Deadline
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="input-base"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Responsible User
              </label>
              <select
                value={formData.responsibleId}
                onChange={(e) => setFormData({ ...formData, responsibleId: e.target.value })}
                className="input-base"
              >
                <option value="">None</option>
                {users.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="input-base"
                rows="2"
              ></textarea>
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

export default ProductionOrders;
