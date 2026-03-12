import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import { orderAPI, customerAPI, productAPI } from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    customerId: '',
    deliveryDate: '',
    notes: '',
    items: [],
  });
  const [currentItem, setCurrentItem] = useState({
    productId: '',
    size: '',
    color: '',
    quantity: 1,
    unitPrice: 0,
  });

  useEffect(() => {
    fetchData();
  }, [search, statusFilter]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordersRes, customersRes, productsRes] = await Promise.all([
        orderAPI.getAll(search, statusFilter),
        customerAPI.getAll(''),
        productAPI.getAll(''),
      ]);
      setOrders(ordersRes.data);
      setCustomers(customersRes.data);
      setProducts(productsRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (order = null) => {
    if (order) {
      setEditingId(order.id);
      setFormData({
        customerId: order.customerId,
        deliveryDate: order.deliveryDate ? order.deliveryDate.split('T')[0] : '',
        notes: order.notes || '',
        items: order.items || [],
      });
    } else {
      setEditingId(null);
      setFormData({
        customerId: '',
        deliveryDate: '',
        notes: '',
        items: [],
      });
    }
    setShowModal(true);
  };

  const handleAddItem = () => {
    if (currentItem.productId && currentItem.size && currentItem.color && currentItem.quantity > 0) {
      const product = products.find((p) => p.id === currentItem.productId);
      setFormData({
        ...formData,
        items: [
          ...formData.items,
          {
            ...currentItem,
            unitPrice: currentItem.unitPrice || product?.salePrice || 0,
          },
        ],
      });
      setCurrentItem({
        productId: '',
        size: '',
        color: '',
        quantity: 1,
        unitPrice: 0,
      });
    }
  };

  const handleRemoveItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await orderAPI.update(editingId, formData);
      } else {
        await orderAPI.create(formData);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save order');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this order?')) {
      try {
        await orderAPI.delete(id);
        fetchData();
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete order');
      }
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await orderAPI.updateStatus(id, newStatus);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Layout>
      <div className="page-transition">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Pedidos</h1>
          <button onClick={() => handleOpenModal()} className="btn-primary">
            + Novo Pedido
          </button>
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
            placeholder="Search by customer name or order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-base"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-base"
          >
            <option value="">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="IN_PRODUCTION">In Production</option>
            <option value="DELIVERED">Delivered</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
        </div>

        {/* Table */}
        <div className="card overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Delivery Date
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="table-row-hover border-b">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    {order.id.substring(0, 8)}...
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{order.customer.name}</td>
                  <td className="px-6 py-4 text-sm">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      className="text-sm px-2 py-1 border rounded"
                    >
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="IN_PRODUCTION">In Production</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.items.length}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    R$ {order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {order.deliveryDate
                      ? new Date(order.deliveryDate).toLocaleDateString('pt-BR')
                      : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => handleOpenModal(order)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <p className="text-center py-8 text-gray-600">No orders found</p>
          )}
        </div>

        {/* Modal */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title={editingId ? 'Edit Order' : 'New Order'}
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Customer *
              </label>
              <select
                value={formData.customerId}
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                className="input-base"
                required
              >
                <option value="">Select a customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Delivery Date
              </label>
              <input
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                className="input-base"
              />
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

            {/* Items Section */}
            <div className="border-t pt-4">
              <h3 className="font-semibold text-gray-900 mb-4">Order Items</h3>

              {/* Add Item */}
              <div className="space-y-3 mb-4 p-3 bg-gray-50 rounded-lg">
                <select
                  value={currentItem.productId}
                  onChange={(e) => {
                    const product = products.find((p) => p.id === e.target.value);
                    setCurrentItem({
                      ...currentItem,
                      productId: e.target.value,
                      unitPrice: product?.salePrice || 0,
                    });
                  }}
                  className="input-base"
                >
                  <option value="">Select product</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>

                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={currentItem.size}
                    onChange={(e) =>
                      setCurrentItem({ ...currentItem, size: e.target.value })
                    }
                    className="input-base"
                  >
                    <option value="">Size</option>
                    {currentItem.productId &&
                      products
                        .find((p) => p.id === currentItem.productId)
                        ?.sizes.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                  </select>

                  <select
                    value={currentItem.color}
                    onChange={(e) =>
                      setCurrentItem({ ...currentItem, color: e.target.value })
                    }
                    className="input-base"
                  >
                    <option value="">Color</option>
                    {currentItem.productId &&
                      products
                        .find((p) => p.id === currentItem.productId)
                        ?.colors.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                  </select>
                </div>

                <input
                  type="number"
                  min="1"
                  value={currentItem.quantity}
                  onChange={(e) =>
                    setCurrentItem({
                      ...currentItem,
                      quantity: parseInt(e.target.value),
                    })
                  }
                  className="input-base"
                  placeholder="Quantity"
                />

                <button
                  type="button"
                  onClick={handleAddItem}
                  className="btn-success w-full"
                >
                  Add Item
                </button>
              </div>

              {/* Items List */}
              {formData.items.length > 0 && (
                <div className="space-y-2">
                  {formData.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm text-gray-900">
                        {products.find((p) => p.id === item.productId)?.name} - {item.size} -{' '}
                        {item.color} x{item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
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

export default Orders;
