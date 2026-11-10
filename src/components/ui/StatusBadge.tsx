import React from 'react';
import { AuditOutcome } from '@/lib/types';
import { getStatusColor } from '@/lib/utils';
import { CheckCircle2, AlertTriangle, HelpCircle, AlertOctagon, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: AuditOutcome | 'PENDING_AUDIT';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function StatusBadge({
  status,
  size = 'md',
  showIcon = true,
}: StatusBadgeProps) {
  const meta = getStatusColor(status);

  const getIcon = () => {
    switch (status) {
      case 'SUPPORTED':
        return <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />;
      case 'PARTIALLY_SUPPORTED':
        return <AlertTriangle className="w-3.5 h-3.5 mr-1.5 text-amber-600" />;
      case 'INCONCLUSIVE':
        return <HelpCircle className="w-3.5 h-3.5 mr-1.5 text-slate-500" />;
      case 'POTENTIAL_DISCREPANCY':
        return <AlertOctagon className="w-3.5 h-3.5 mr-1.5 text-rose-600" />;
      default:
        return <Clock className="w-3.5 h-3.5 mr-1.5 text-gray-500" />;
    }
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${meta.bg} ${sizeClasses[size]} tracking-tight transition-colors`}
    >
      {showIcon && getIcon()}
      {meta.label}
    </span>
  );
}

