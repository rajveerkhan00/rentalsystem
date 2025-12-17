import { useState, useEffect } from 'react';
import { Domain } from './types';
import DomainTable from './DomainTable';

interface DomainManagementProps {
  domains: Domain[];
  setDomains: React.Dispatch<React.SetStateAction<Domain[]>>;
  domainsLoading: boolean;
  setDomainsLoading: (loading: boolean) => void;
}

export default function DomainManagement({ 
  domains, 
  setDomains, 
  domainsLoading, 
  setDomainsLoading 
}: DomainManagementProps) {
  const [domainStatusFilter, setDomainStatusFilter] = useState<string>('all');
  const [domainUpdating, setDomainUpdating] = useState<string | null>(null);
  const [domainDeleting, setDomainDeleting] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchDomains = async () => {
    try {
      setDomainsLoading(true);
      const response = await fetch('/api/superadmin/domains');
      
      if (response.ok) {
        const data = await response.json();
        setDomains(data.domains || []);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to fetch domains');
      }
    } catch (error) {
      console.error('Failed to fetch domains:', error);
      setError('Failed to load domains. Please try again.');
    } finally {
      setDomainsLoading(false);
    }
  };

  const handleDomainStatusChange = async (domainId: string, newStatus: string) => {
    setDomainUpdating(domainId);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/superadmin/domains', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domainId,
          status: newStatus
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update domain status');
      }

      setSuccess('Domain status updated successfully!');
      
      setDomains(prevDomains => prevDomains.map(domain => 
        domain._id === domainId 
          ? { ...domain, status: newStatus as 'active' | 'inactive' | 'pending' }
          : domain
      ));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDomainUpdating(null);
    }
  };

  const handleExpiryDateChange = async (domainId: string, newExpiryDate: string) => {
    setDomainUpdating(domainId);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/superadmin/domains', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domainId,
          expiryDate: newExpiryDate
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update expiry date');
      }

      setSuccess('Expiry date updated successfully!');
      
      setDomains(prevDomains => prevDomains.map(domain => 
        domain._id === domainId 
          ? { ...domain, expiryDate: newExpiryDate }
          : domain
      ));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDomainUpdating(null);
    }
  };

  const handleDeleteDomain = async (domainId: string, domainName: string) => {
    if (!confirm(`Are you sure you want to delete domain "${domainName}"? This action cannot be undone.`)) {
      return;
    }

    setDomainDeleting(domainId);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/superadmin/domains?id=${domainId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete domain');
      }

      setSuccess(`Domain "${domainName}" deleted successfully!`);
      
      // Remove domain from local state
      setDomains(prevDomains => prevDomains.filter(domain => domain._id !== domainId));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDomainDeleting(null);
    }
  };

  // Filter domains by status
  const filteredDomains = domains.filter(domain => {
    if (domainStatusFilter === 'all') return true;
    return domain.status === domainStatusFilter;
  });

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900">All Domains</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage domains from all admins. You can change status, expiry dates, or delete domains.
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div>
            <select
              value={domainStatusFilter}
              onChange={(e) => setDomainStatusFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-md"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select>
          </div>
          <button
            onClick={fetchDomains}
            disabled={domainsLoading}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
          >
            {domainsLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded text-sm">
          {success}
        </div>
      )}

      {domainsLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading domains...</p>
        </div>
      ) : filteredDomains.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No domains found.</p>
      ) : (
        <DomainTable
          domains={domains}
          filteredDomains={filteredDomains}
          domainStatusFilter={domainStatusFilter}
          domainUpdating={domainUpdating}
          domainDeleting={domainDeleting}
          onDomainStatusChange={handleDomainStatusChange}
          onExpiryDateChange={handleExpiryDateChange}
          onDeleteDomain={handleDeleteDomain}
        />
      )}
    </div>
  );
}