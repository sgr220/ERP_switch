import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { orderAPI, productionOrderAPI, stockAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [orderStats, prodStats, stockAlerts] = await Promise.all([
          orderAPI.getStats(),
          productionOrderAPI.getStats(),
          stockAPI.getLowStockAlerts(),
        ]);

        setStats({
          orders: orderStats.data,
          productionOrders: prodStats.data,
        });
        setAlerts(stockAlerts.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <Layout>
      <div className="page-transition">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Orders */}
          <div className="card bg-blue-50 border-l-4 border-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Pedidos</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.orders?.total || 0}
                </p>
              </div>
              <span className="text-4xl">🧾</span>
            </div>
          </div>

          {/* Pending Orders */}
          <div className="card bg-yellow-50 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pedidos Pendentes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.orders?.pending || 0}
                </p>
              </div>
              <span className="text-4xl">⏳</span>
            </div>
          </div>

          {/* In Production */}
          <div className="card bg-blue-50 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Em Produção</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.productionOrders?.inProduction || 0}
                </p>
              </div>
              <span className="text-4xl">⚙️</span>
            </div>
          </div>

          {/* Completed */}
          <div className="card bg-green-50 border-l-4 border-green-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Concluídas</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats?.productionOrders?.completed || 0}
                </p>
              </div>
              <span className="text-4xl">✅</span>
            </div>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Alertas de Estoque Baixo</h2>
          {alerts.length === 0 ? (
            <p className="text-gray-600">Nenhum alerta de estoque baixo</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Tipo
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Quantidade Atual
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Mínimo
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Unidade
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {alerts.map((alert) => (
                    <tr key={alert.id} className="table-row-hover border-b">
                      <td className="px-6 py-4 text-sm text-gray-900">{alert.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{alert.type}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-red-600">
                        {alert.current}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{alert.minimum}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{alert.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
