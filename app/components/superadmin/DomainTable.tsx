import { Domain } from './types';

interface DomainTableProps {
  domains: Domain[];
  filteredDomains: Domain[];
  domainStatusFilter: string;
  domainUpdating: string | null;
  domainDeleting: string | null;
  onDomainStatusChange: (domainId: string, newStatus: string) => Promise<void>;
  onExpiryDateChange: (domainId: string, newExpiryDate: string) => Promise<void>;
  onDeleteDomain: (domainId: string, domainName: string) => Promise<void>;
}

export default function DomainTable({ 
  domains, 
  filteredDomains, 
  domainStatusFilter, 
  domainUpdating, 
  domainDeleting,
  onDomainStatusChange, 
  onExpiryDateChange,
  onDeleteDomain
}: DomainTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-400">
        <thead>
          <tr>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Domain Name
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Admin Owner
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Expiry Date
            </th>
            <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredDomains.map((domain) => (
            <tr key={domain._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{domain.domainName}</div>
                <div className="text-xs text-gray-500">
                  Created: {new Date(domain.createdAt).toLocaleDateString()}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{domain.adminName || 'N/A'}</div>
                <div className="text-sm text-gray-600">{domain.adminEmail}</div>
                <div className="text-xs text-gray-500">ID: {domain.adminId.substring(0, 8)}...</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {domain.adminLocation ? (
                  <div className="text-sm text-gray-900">
                    {domain.adminLocation.city}, {domain.adminLocation.country}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">Not specified</div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <select
                  value={domain.status}
                  onChange={(e) => onDomainStatusChange(domain._id, e.target.value)}
                  disabled={domainUpdating === domain._id || domainDeleting === domain._id}
                  className={`block w-full pl-3 pr-10 py-1 text-sm border-gray-300 focus:outline-none focus:ring-black focus:border-black rounded-md ${
                    domain.status === 'active' ? 'bg-green-50 text-green-700' :
                    domain.status === 'inactive' ? 'bg-red-50 text-red-700' :
                    'bg-yellow-50 text-yellow-700'
                  } ${domainDeleting === domain._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <option value="pending">Pending</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="date"
                  value={domain.expiryDate}
                  onChange={(e) => onExpiryDateChange(domain._id, e.target.value)}
                  disabled={domainUpdating === domain._id || domainDeleting === domain._id}
                  className={`block w-full px-3 py-1 text-sm border-gray-300 rounded-md focus:outline-none focus:ring-black focus:border-black text-black ${
                    domainDeleting === domain._id ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-black">
                {domainUpdating === domain._id ? (
                  <span className="text-gray-500">Updating...</span>
                ) : domainDeleting === domain._id ? (
                  <span className="text-gray-500">Deleting...</span>
                ) : (
                  <button
                    onClick={() => onDeleteDomain(domain._id, domain.domainName)}
                    className="px-3 py-1 bg-red-100 text-red-800 hover:bg-red-200 rounded text-xs font-medium"
                    title="Delete Domain"
                  >
                    Delete
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
        <div>
          Showing {filteredDomains.length} of {domains.length} domains
        </div>
        <div className="flex space-x-2">
          <span className={`px-2 py-1 rounded ${domainStatusFilter === 'all' ? 'bg-gray-200' : ''}`}>
            All: {domains.length}
          </span>
          <span className={`px-2 py-1 rounded ${domainStatusFilter === 'active' ? 'bg-green-100 text-green-800' : ''}`}>
            Active: {domains.filter(d => d.status === 'active').length}
          </span>
          <span className={`px-2 py-1 rounded ${domainStatusFilter === 'inactive' ? 'bg-red-100 text-red-800' : ''}`}>
            Inactive: {domains.filter(d => d.status === 'inactive').length}
          </span>
          <span className={`px-2 py-1 rounded ${domainStatusFilter === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}`}>
            Pending: {domains.filter(d => d.status === 'pending').length}
          </span>
        </div>
      </div>
    </div>
  );
}