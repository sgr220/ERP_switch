import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/products', label: 'Produtos', icon: '👕' },
    { path: '/customers', label: 'Clientes', icon: '👥' },
    { path: '/orders', label: 'Pedidos', icon: '🧾' },
    { path: '/production-orders', label: 'Ordens de Produção', icon: '📋' },
    { path: '/stock', label: 'Estoque', icon: '📦' },
  ];

  const adminItems = [
    { path: '/users', label: 'Usuários', icon: '⚙️' },
  ];

  const isActive = (path) => location.pathname === path ? 'bg-blue-700' : '';

  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col fixed left-0 top-0">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold">ERP Switch</h1>
        <p className="text-sm text-gray-400 mt-1">T-Shirt Factory</p>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-gray-700 bg-gray-800">
        <p className="text-sm text-gray-300">Logged in as:</p>
        <p className="font-semibold text-white truncate">{user?.name}</p>
        <p className="text-xs text-gray-400">{user?.role}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path) ? 'bg-blue-700' : 'hover:bg-gray-800'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </div>

        {user?.role === 'ADMIN' && (
          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-xs text-gray-400 mb-3 px-4 font-semibold">ADMIN</p>
            <div className="space-y-2">
              {adminItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(item.path) ? 'bg-blue-700' : 'hover:bg-gray-800'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={logout}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
