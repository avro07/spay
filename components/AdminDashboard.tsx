
import React, { useState } from 'react';
import { Users, CreditCard, Activity, Search, Shield, LogOut, Lock, Unlock, TrendingUp, AlertCircle, Signal } from 'lucide-react';
import { User, Transaction, UserRole } from '../types';
import { MOCK_USERS_DB } from '../constants';

interface AdminDashboardProps {
  transactions: Transaction[];
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ transactions, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'transactions' | 'api'>('overview');
  const [users, setUsers] = useState<User[]>(MOCK_USERS_DB);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<UserRole | 'ALL'>('ALL');

  const toggleUserStatus = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        return { ...u, status: u.status === 'active' ? 'blocked' : 'active' };
      }
      return u;
    }));
  };

  const totalBalance = users.reduce((acc, curr) => acc + curr.balance, 0);
  const totalTransactions = transactions.reduce((acc, curr) => acc + curr.amount, 0);

  const filteredUsers = users.filter(u => 
    (filterRole === 'ALL' || u.role === filterRole) &&
    (u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.phone.includes(searchTerm))
  );

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-slate-900 text-white flex flex-col hidden md:flex">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold tracking-tight text-rose-500 italic">SPay <span className="text-white not-italic text-sm font-normal opacity-70">Admin</span></h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'overview' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Activity size={20} />
            <span className="font-medium">ড্যাশবোর্ড</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'users' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Users size={20} />
            <span className="font-medium">ব্যবহারকারী</span>
          </button>

          <button 
            onClick={() => setActiveTab('transactions')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'transactions' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <CreditCard size={20} />
            <span className="font-medium">লেনদেন</span>
          </button>

          <button 
            onClick={() => setActiveTab('api')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${activeTab === 'api' ? 'bg-rose-600 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <Signal size={20} />
            <span className="font-medium">API ইন্টিগ্রেশন</span>
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-rose-400 hover:text-rose-300 transition-colors"
          >
            <LogOut size={18} />
            <span>লগ আউট</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden bg-slate-900 text-white p-4 flex justify-between items-center">
            <h1 className="font-bold text-rose-500 italic">SPay Admin</h1>
            <button onClick={onLogout}><LogOut size={20} /></button>
        </div>
        
        {/* Mobile Nav Tabs */}
         <div className="md:hidden flex bg-white border-b border-gray-200 overflow-x-auto">
            <button onClick={() => setActiveTab('overview')} className={`flex-1 p-3 text-center text-xs font-bold whitespace-nowrap px-4 ${activeTab === 'overview' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-gray-500'}`}>ড্যাশবোর্ড</button>
            <button onClick={() => setActiveTab('users')} className={`flex-1 p-3 text-center text-xs font-bold whitespace-nowrap px-4 ${activeTab === 'users' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-gray-500'}`}>ইউজার</button>
            <button onClick={() => setActiveTab('transactions')} className={`flex-1 p-3 text-center text-xs font-bold whitespace-nowrap px-4 ${activeTab === 'transactions' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-gray-500'}`}>লেনদেন</button>
            <button onClick={() => setActiveTab('api')} className={`flex-1 p-3 text-center text-xs font-bold whitespace-nowrap px-4 ${activeTab === 'api' ? 'text-rose-600 border-b-2 border-rose-600' : 'text-gray-500'}`}>API</button>
         </div>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <h2 className="text-2xl font-bold text-slate-800">ওভারভিউ</h2>
              
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                  <div className="p-4 bg-emerald-100 text-emerald-600 rounded-xl">
                    <Users size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">মোট ব্যবহারকারী</p>
                    <h3 className="text-2xl font-bold text-slate-800">{users.length} জন</h3>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                  <div className="p-4 bg-blue-100 text-blue-600 rounded-xl">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">মোট লেনদেন ভলিউম</p>
                    <h3 className="text-2xl font-bold text-slate-800">৳ {totalTransactions.toLocaleString()}</h3>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
                  <div className="p-4 bg-violet-100 text-violet-600 rounded-xl">
                    <Shield size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">সিস্টেম ব্যালেন্স</p>
                    <h3 className="text-2xl font-bold text-slate-800">৳ {totalBalance.toLocaleString()}</h3>
                  </div>
                </div>
              </div>

              {/* Recent Activity Mini Table */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="font-bold text-slate-800">সাম্প্রতিক লেনদেন</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="px-6 py-3 font-medium">আইডি</th>
                        <th className="px-6 py-3 font-medium">টাইপ</th>
                        <th className="px-6 py-3 font-medium">পরিমাণ</th>
                        <th className="px-6 py-3 font-medium">সময়</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {transactions.slice(0, 5).map(txn => (
                        <tr key={txn.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 font-mono text-slate-600">{txn.id}</td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                              {txn.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-bold text-slate-800">৳{txn.amount}</td>
                          <td className="px-6 py-4 text-slate-500">{txn.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-slate-800">ব্যবহারকারী ব্যবস্থাপনা</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                  <input 
                    type="text" 
                    placeholder="নাম বা ফোন নম্বর খুঁজুন..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 w-full md:w-64"
                  />
                </div>
              </div>

              {/* Role Filters */}
              <div className="flex flex-wrap gap-2">
                 {(['ALL', 'CUSTOMER', 'AGENT', 'MERCHANT', 'DISTRIBUTOR'] as const).map((role) => (
                    <button
                        key={role}
                        onClick={() => setFilterRole(role)}
                        className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors ${
                            filterRole === role 
                            ? 'bg-rose-600 text-white border-rose-600' 
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                    >
                        {role === 'ALL' ? 'All Users' : role}
                    </button>
                 ))}
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="px-6 py-4 font-medium">ব্যবহারকারী</th>
                        <th className="px-6 py-4 font-medium">ফোন</th>
                        <th className="px-6 py-4 font-medium">ব্যালেন্স</th>
                        <th className="px-6 py-4 font-medium">রোল</th>
                        <th className="px-6 py-4 font-medium">স্ট্যাটাস</th>
                        <th className="px-6 py-4 font-medium text-right">অ্যাকশন</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredUsers.length > 0 ? (
                          filteredUsers.map(user => (
                            <tr key={user.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                <img src={user.avatarUrl} alt="" className="w-8 h-8 rounded-full bg-slate-200" />
                                <span className="font-bold text-slate-700">{user.name}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-slate-600 font-mono">{user.phone}</td>
                            <td className="px-6 py-4 font-bold text-slate-800">৳{user.balance.toLocaleString()}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase border 
                                    ${user.role === 'AGENT' ? 'bg-purple-50 text-purple-600 border-purple-100' : 
                                    user.role === 'MERCHANT' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                    user.role === 'DISTRIBUTOR' ? 'bg-cyan-50 text-cyan-600 border-cyan-100' :
                                    'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                {user.role}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                {user.status === 'active' ? (
                                <span className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Active
                                </span>
                                ) : (
                                <span className="flex items-center gap-1 text-red-600 text-xs font-bold">
                                    <span className="w-2 h-2 rounded-full bg-red-500"></span> Blocked
                                </span>
                                )}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button 
                                onClick={() => toggleUserStatus(user.id!)}
                                className={`p-2 rounded-lg transition-colors ${user.status === 'active' ? 'bg-rose-50 text-rose-600 hover:bg-rose-100' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                                title={user.status === 'active' ? "Block User" : "Unblock User"}
                                >
                                {user.status === 'active' ? <Lock size={16} /> : <Unlock size={16} />}
                                </button>
                            </td>
                            </tr>
                        ))
                      ) : (
                          <tr>
                              <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                                  কোন ব্যবহারকারী পাওয়া যায়নি
                              </td>
                          </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        {activeTab === 'transactions' && (
            <div className="space-y-6 animate-in fade-in duration-500">
               <h2 className="text-2xl font-bold text-slate-800">সকল লেনদেন</h2>
               <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 text-slate-500">
                      <tr>
                        <th className="px-6 py-3 font-medium">আইডি</th>
                        <th className="px-6 py-3 font-medium">বিবরণ</th>
                        <th className="px-6 py-3 font-medium">প্রাপক</th>
                        <th className="px-6 py-3 font-medium">পরিমাণ</th>
                        <th className="px-6 py-3 font-medium">স্ট্যাটাস</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {transactions.map(txn => (
                        <tr key={txn.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 font-mono text-slate-500 text-xs">{txn.id}</td>
                          <td className="px-6 py-4">
                             <div className="font-bold text-slate-700">{txn.description || txn.type}</div>
                             <div className="text-xs text-slate-400">{txn.date}</div>
                             {txn.fee && <div className="text-[10px] text-rose-500 mt-1">ফি: ৳{txn.fee}</div>}
                          </td>
                          <td className="px-6 py-4 text-slate-600">{txn.recipientName}</td>
                          <td className="px-6 py-4 font-bold text-slate-800">৳{txn.amount.toLocaleString()}</td>
                          <td className="px-6 py-4">
                             <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded text-[10px] font-bold">সম্পন্ন</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
               </div>
            </div>
        )}

        {activeTab === 'api' && (
             <div className="space-y-6 animate-in fade-in duration-500">
                 <h2 className="text-2xl font-bold text-slate-800">মোবাইল অপারেটর API কনফিগারেশন</h2>
                 <p className="text-slate-500 text-sm">অটোমেটিক রিচার্জের জন্য অপারেটরদের API কানেক্ট করুন।</p>
                 
                 <div className="grid gap-6">
                    {/* Grameenphone */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold">GP</div>
                            <h3 className="font-bold text-lg text-slate-800">Grameenphone API</h3>
                            <span className="ml-auto bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-bold">Connected</span>
                        </div>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1">API Endpoint</label>
                                <input type="text" value="https://api.grameenphone.com/v2/recharge" className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-sm font-mono text-slate-600" readOnly />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1">Access Token</label>
                                <input type="password" value="********************************" className="w-full bg-slate-50 border border-slate-200 rounded p-2 text-sm font-mono text-slate-600" readOnly />
                            </div>
                        </div>
                    </div>

                    {/* Banglalink */}
                    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">BL</div>
                            <h3 className="font-bold text-lg text-slate-800">Banglalink API</h3>
                            <span className="ml-auto bg-slate-100 text-slate-500 px-2 py-1 rounded text-xs font-bold">Disconnected</span>
                        </div>
                        <div className="space-y-4">
                             <div>
                                <label className="block text-xs font-bold text-slate-600 mb-1">API Key</label>
                                <input type="text" placeholder="Enter API Key" className="w-full bg-white border border-slate-200 rounded p-2 text-sm focus:outline-none focus:border-rose-500" />
                            </div>
                            <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold">Connect</button>
                        </div>
                    </div>
                 </div>
             </div>
        )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
