import React from 'react';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    PENDING: { label: 'Pendente', class: 'status-pending' },
    CONFIRMED: { label: 'Confirmado', class: 'status-confirmed' },
    IN_PRODUCTION: { label: 'Em Produção', class: 'status-in-production' },
    COMPLETED: { label: 'Concluído', class: 'status-completed' },
    DELIVERED: { label: 'Entregue', class: 'status-delivered' },
    CANCELLED: { label: 'Cancelado', class: 'status-cancelled' },
  };

  const config = statusConfig[status] || { label: status, class: 'status-pending' };

  return <span className={`status-badge ${config.class}`}>{config.label}</span>;
};

export default StatusBadge;
