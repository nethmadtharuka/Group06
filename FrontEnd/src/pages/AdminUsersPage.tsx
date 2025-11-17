import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { SearchIcon, TrashIcon, UserIcon, MailIcon, PhoneIcon } from 'lucide-react';
import { userAPI } from '../services/api';

export const AdminUsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const usersData = await userAPI.getAllUsers();
      // Remove passwords from response
      const sanitizedUsers = (usersData || []).map((user: any) => ({
        ...user,
        password: undefined
      }));
      setUsers(sanitizedUsers);
    } catch (error) {
      console.error('Error loading users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    try {
      await userAPI.deleteUser(userId);
      loadUsers();
      alert('User deleted successfully!');
    } catch (error: any) {
      console.error('Error deleting user:', error);
      alert(error.message || 'Failed to delete user. Please try again.');
    }
  };

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'N/A';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return dateStr;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-600';
      case 'VENDOR':
        return 'bg-blue-600';
      case 'CUSTOMER':
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  const filteredUsers = users.filter((user: any) => {
    const matchesSearch = 
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="flex bg-transparent w-full min-h-screen">
      <Sidebar type="admin" />
      <div className="flex-1 ml-64 min-h-screen">
        <header className="bg-[#0a0a0f]/60 backdrop-blur-sm border-b border-gray-800 px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-white">Users Management</h1>
            <div className="text-gray-400 text-sm">
              Total Users: {users.length}
            </div>
          </div>
        </header>
        <main className="p-8">
          <div className="mb-6">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search users by name, email, or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading users...</div>
          ) : (
            <div className="bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">User</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Phone</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Role</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Joined</th>
                    <th className="text-right py-3 px-4 text-gray-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 px-4 text-center text-gray-400">
                        {searchTerm ? 'No users found matching your search' : 'No users found'}
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user: any) => (
                      <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-900 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold">
                              {user.fullName?.[0] || user.username?.[0] || 'U'}
                            </div>
                            <div>
                              <p className="text-white font-medium">{user.fullName || user.username || 'N/A'}</p>
                              <p className="text-gray-400 text-sm">@{user.username || 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-300">{user.email || 'N/A'}</td>
                        <td className="py-4 px-4 text-gray-300">{user.phone || 'N/A'}</td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded text-xs font-medium text-white ${getRoleBadgeColor(user.role || 'CUSTOMER')}`}>
                            {user.role || 'CUSTOMER'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-300">{formatDate(user.createdAt)}</td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                            title="Delete User"
                            disabled={user.role === 'ADMIN'}
                          >
                            <TrashIcon size={18} className={user.role === 'ADMIN' ? 'opacity-50 cursor-not-allowed' : ''} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
