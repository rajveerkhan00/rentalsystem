import { Admin } from './types';

interface AdminTableProps {
  admins: Admin[];
  toggleLoading: string | null;
  deleteLoading: string | null;
  onToggleAdminStatus: (adminId: string, currentStatus: boolean) => Promise<void>;
  onDeleteAdmin: (adminId: string, adminEmail: string, adminName: string) => Promise<void>; // Update to include name
}

export default function AdminTable({ 
  admins, 
  toggleLoading, 
  deleteLoading, 
  onToggleAdminStatus, 
  onDeleteAdmin 
}: AdminTableProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-medium text-gray-900">Existing Admins</h2>
        <span className="text-sm text-gray-500">
          Total: {admins.length} admin{admins.length !== 1 ? 's' : ''}
        </span>
      </div>
      
      {admins.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No admins added yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created By
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {admins.map((admin) => (
                <tr key={admin._id} className={!admin.isActive ? 'bg-gray-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{admin.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{admin.email}</div>
                    <div className="text-xs text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${admin.role === 'superadmin' ? 'bg-black text-white' : 'bg-gray-100 text-gray-800'}`}>
                        {admin.role}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${admin.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {admin.isActive ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(admin.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {admin.createdBy || 'System'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onToggleAdminStatus(admin._id, admin.isActive)}
                        disabled={toggleLoading === admin._id}
                        className={`px-3 py-1 rounded text-xs font-medium ${admin.isActive ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' : 'bg-green-100 text-green-800 hover:bg-green-200'} disabled:opacity-50`}
                      >
                        {toggleLoading === admin._id ? '...' : admin.isActive ? 'Disable' : 'Enable'}
                      </button>
                      <button
                        onClick={() => onDeleteAdmin(admin._id, admin.email, admin.name)}
                        disabled={deleteLoading === admin._id}
                        className="px-3 py-1 bg-red-100 text-red-800 hover:bg-red-200 rounded text-xs font-medium disabled:opacity-50"
                      >
                        {deleteLoading === admin._id ? '...' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}