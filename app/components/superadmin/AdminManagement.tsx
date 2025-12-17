import { useState } from 'react';
import { Admin, NewAdmin } from './types';
import AddAdminForm from './AddAdminForm';
import AdminTable from './AdminTable';

interface AdminManagementProps {
  admins: Admin[];
  fetchAdmins: () => Promise<void>;
}

export default function AdminManagement({ admins, fetchAdmins }: AdminManagementProps) {
  const [newAdmin, setNewAdmin] = useState<NewAdmin>({
    name: '', // Initialize name field
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newAdmin.password !== newAdmin.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/superadmin/add-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newAdmin.name, // Send name
          email: newAdmin.email,
          password: newAdmin.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add admin');
      }

      setSuccess('Admin added successfully!');
      setNewAdmin({ name: '', email: '', password: '', confirmPassword: '' });
      fetchAdmins();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdminStatus = async (adminId: string, currentStatus: boolean) => {
    setToggleLoading(adminId);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/superadmin/add-admin', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          adminId,
          isActive: !currentStatus
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update admin status');
      }

      setSuccess(data.message);
      fetchAdmins();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setToggleLoading(null);
    }
  };

  const handleDeleteAdmin = async (adminId: string, adminEmail: string, adminName: string) => {
    if (!confirm(`Are you sure you want to delete admin "${adminName}" (${adminEmail})?`)) {
      return;
    }

    setDeleteLoading(adminId);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/superadmin/add-admin?id=${adminId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete admin');
      }

      setSuccess(data.message);
      fetchAdmins();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeleteLoading(null);
    }
  };

  return (
    <>
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

      <AddAdminForm
        newAdmin={newAdmin}
        setNewAdmin={setNewAdmin}
        loading={loading}
        onSubmit={handleAddAdmin}
      />

      <AdminTable
        admins={admins}
        toggleLoading={toggleLoading}
        deleteLoading={deleteLoading}
        onToggleAdminStatus={handleToggleAdminStatus}
        onDeleteAdmin={handleDeleteAdmin}
      />
    </>
  );
}