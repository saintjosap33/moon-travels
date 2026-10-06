import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { logout } from 'zitejs/auth';
import { Menu, LogOut } from 'lucide-react';

interface SidebarProps {
  user: any;
}

export default function Sidebar({ user }: SidebarProps) {
  const location = useLocation();
  const [isExpanded, setIsExpanded] = React.useState(true);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
  };

  const menuItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Customers', path: '/customers' },
    { label: 'Packages', path: '/packages' },
    { label: 'Destinations', path: '/destinations' },
    { label: 'Accommodations', path: '/accommodations' },
    { label: 'Transportation', path: '/transportation' },
    { label: 'Bookings', path: '/bookings' },
    { label: 'Payments', path: '/payments' },
    { label: 'Receipts', path: '/receipts' },
    { label: 'Income', path: '/income' },
    { label: 'Reports', path: '/reports' },
    { label: 'Reviews', path: '/reviews' },
  ];

  const dbmsItems = [
    { label: 'Schema Explorer', path: '/dbms/schema' },
    { label: 'ER Diagram', path: '/dbms/er-diagram' },
    { label: 'Normalization', path: '/dbms/normalization' },
    { label: 'Views & Indexes', path: '/dbms/views-indexes' },
    { label: 'Transactions', path: '/dbms/transactions' },
    { label: 'Query Lab', path: '/dbms/query-lab' },
  ];

  return (
    <div className={`sidebar transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'}`}>
      <div className="p-4 border-b border-primary/20">
        <div className="flex items-center justify-between">
          {isExpanded && (
            <div>
              <h1 className="text-xl font-bold text-secondary">MOON TRAVELS</h1>
              <p className="text-xs text-primary-foreground/70">Travel Management</p>
            </div>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-primary/20 rounded"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      <div className="p-4 border-b border-primary/20">
        {isExpanded && (
          <div className="text-sm">
            <p className="text-primary-foreground/70">Logged in as</p>
            <p className="font-medium text-primary-foreground">{user?.email}</p>
          </div>
        )}
      </div>

      <nav className="py-4">
        <div className="px-2 mb-6">
          {isExpanded && <p className="text-xs uppercase font-bold text-primary-foreground/50 px-4 mb-2">Main</p>}
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link text-sm ${isActive(item.path) ? 'active' : ''}`}
              title={!isExpanded ? item.label : ''}
            >
              {isExpanded ? item.label : item.label.substring(0, 2).toUpperCase()}
            </Link>
          ))}
        </div>

        <div className="px-2 border-t border-primary/20 pt-4">
          {isExpanded && <p className="text-xs uppercase font-bold text-primary-foreground/50 px-4 mb-2">DBMS Features</p>}
          {dbmsItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-link text-sm ${isActive(item.path) ? 'active' : ''}`}
              title={!isExpanded ? item.label : ''}
            >
              {isExpanded ? item.label : item.label.substring(0, 2).toUpperCase()}
            </Link>
          ))}
        </div>
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-primary/20">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-primary-foreground hover:bg-primary/20 rounded transition-colors"
        >
          <LogOut size={16} />
          {isExpanded && 'Logout'}
        </button>
      </div>
    </div>
  );
}
