'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import LoadingSpinner from '../components/superadmin/LoadingSpinner';
import Header from '../components/superadmin/Header';
import AdminManagement from '../components/superadmin/AdminManagement';
import DomainManagement from '../components/superadmin/DomainManagement';
import { Admin, Domain } from '../components/superadmin/types';

export default function SuperDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [domainsLoading, setDomainsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'admins' | 'domains'>('admins');
  const [loadedTabs, setLoadedTabs] = useState<Set<'admins' | 'domains'>>(new Set());

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/SuperLogin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.role === 'superadmin') {
      if (!loadedTabs.has('admins')) {
        fetchAdmins();
        setLoadedTabs(prev => new Set(prev).add('admins'));
      }

      if (activeTab === 'domains' && !loadedTabs.has('domains')) {
        fetchDomains();
        setLoadedTabs(prev => new Set(prev).add('domains'));
      }
    }
  }, [session, activeTab, loadedTabs]);

  const fetchAdmins = async () => {
    try {
      const response = await fetch('/api/superadmin/add-admin', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        const data = await response.json();
        setAdmins(data.admins || []);
      }
    } catch (error) {
      console.error('Failed to fetch admins:', error);
    }
  };

  const fetchDomains = async () => {
    try {
      setDomainsLoading(true);
      const response = await fetch('/api/superadmin/domains');

      if (response.ok) {
        const data = await response.json();
        setDomains(data.domains || []);
      }
    } catch (error) {
      console.error('Failed to fetch domains:', error);
    } finally {
      setDomainsLoading(false);
    }
  };

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header session={session} />

      <main className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {session.user.role === 'superadmin' ? (
          <>
            {/* Tab Navigation */}
            <div className="mb-8 border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('admins')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'admins'
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  Admin Management
                </button>
                <button
                  onClick={() => setActiveTab('domains')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === 'domains'
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  Domain Management
                </button>
              </nav>
            </div>

            {/* Admin Management Tab */}
            {activeTab === 'admins' && (
              <AdminManagement admins={admins} fetchAdmins={fetchAdmins} />
            )}

            {/* Domain Management Tab */}
            {activeTab === 'domains' && (
              <DomainManagement
                domains={domains}
                setDomains={setDomains}
                domainsLoading={domainsLoading}
                setDomainsLoading={setDomainsLoading}
              />
            )}
          </>
        ) : (
          <div className="bg-white shadow rounded-lg p-6 text-center">
            <h2 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 max-w-4xl mx-auto">You need super admin privileges to access this page.</p>
          </div>
        )}
      </main>
    </div>
  );
}