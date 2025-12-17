import { NewAdmin } from './types';

interface AddAdminFormProps {
  newAdmin: NewAdmin;
  setNewAdmin: (admin: NewAdmin) => void;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => Promise<void>;
}

export default function AddAdminForm({ 
  newAdmin, 
  setNewAdmin, 
  loading, 
  onSubmit 
}: AddAdminFormProps) {
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-8">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Admin</h2>

      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Admin Name
          </label>
          <input
            type="text"
            id="name"
            required
            value={newAdmin.name}
            onChange={(e) => setNewAdmin({...newAdmin, name: e.target.value})}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm text-black"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Admin Email
          </label>
          <input
            type="email"
            id="email"
            required
            value={newAdmin.email}
            onChange={(e) => setNewAdmin({...newAdmin, email: e.target.value})}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm text-black"
            placeholder="admin@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            required
            value={newAdmin.password}
            onChange={(e) => setNewAdmin({...newAdmin, password: e.target.value})}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm text-black"
            placeholder="Set a password"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            required
            value={newAdmin.confirmPassword}
            onChange={(e) => setNewAdmin({...newAdmin, confirmPassword: e.target.value})}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm text-black"
            placeholder="Confirm password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50"
        >
          {loading ? 'Adding Admin...' : 'Add Admin'}
        </button>
      </form>
    </div>
  );
}