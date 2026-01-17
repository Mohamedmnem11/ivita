import { FaShoppingCart, FaDollarSign, FaUsers, FaChartLine } from 'react-icons/fa';

const Admin = () => {
  // Mock data for KPIs
  const kpis = [
    {
      id: 1,
      title: 'Total Orders',
      value: '2,547',
      icon: FaShoppingCart,
      color: 'bg-blue-500',
      change: '+12.5%',
    },
    {
      id: 2,
      title: 'Total Sales',
      value: '$125,430',
      icon: FaDollarSign,
      color: 'bg-green-500',
      change: '+8.2%',
    },
    {
      id: 3,
      title: 'Monthly Revenue',
      value: '$45,230',
      icon: FaChartLine,
      color: 'bg-purple-500',
      change: '+15.3%',
    },
    {
      id: 4,
      title: 'Users Count',
      value: '8,234',
      icon: FaUsers,
      color: 'bg-orange-500',
      change: '+5.7%',
    },
  ];

  // Mock data for orders
  const orders = [
    {
      id: 'ORD-001',
      user: 'John Doe',
      total: '$299.99',
      status: 'Delivered',
      date: '2026-01-15',
    },
    {
      id: 'ORD-002',
      user: 'Jane Smith',
      total: '$149.50',
      status: 'Pending',
      date: '2026-01-15',
    },
    {
      id: 'ORD-003',
      user: 'Mike Johnson',
      total: '$599.00',
      status: 'Processing',
      date: '2026-01-14',
    },
    {
      id: 'ORD-004',
      user: 'Sarah Williams',
      total: '$89.99',
      status: 'Delivered',
      date: '2026-01-14',
    },
    {
      id: 'ORD-005',
      user: 'David Brown',
      total: '$449.99',
      status: 'Shipped',
      date: '2026-01-13',
    },
    {
      id: 'ORD-006',
      user: 'Emma Davis',
      total: '$199.00',
      status: 'Delivered',
      date: '2026-01-13',
    },
    {
      id: 'ORD-007',
      user: 'Chris Wilson',
      total: '$349.50',
      status: 'Processing',
      date: '2026-01-12',
    },
    {
      id: 'ORD-008',
      user: 'Lisa Anderson',
      total: '$129.99',
      status: 'Pending',
      date: '2026-01-12',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'Shipped':
        return 'bg-blue-100 text-blue-800';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pending':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
    
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container-custom py-8">
          <h1 className="text-3xl font-bold px-5">Admin Dashboard</h1>
      
        </div>
      </div>

      <div className="container-custom py-8">
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${kpi.color} p-3 rounded-lg`}>
                    <Icon className="text-white text-2xl" />
                  </div>
                  <span className="text-green-600 text-sm font-semibold">
                    {kpi.change}
                  </span>
                </div>
                <h3 className="text-gray-600 text-sm mb-1">{kpi.title}</h3>
                <p className="text-3xl font-bold text-gray-800">{kpi.value}</p>
              </div>
            );
          })}
        </div>

       
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {order.user}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      {order.total}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {order.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;