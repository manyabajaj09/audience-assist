/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MessageSquare, Ticket, AlertCircle, CheckCircle, Clock, Filter, Send, X, Zap, Activity, TrendingUp } from 'lucide-react';

const API_BASE = 'https://audience-query-system-jnws.onrender.com/api';

const COLORS = ['#00d4ff', '#0099ff', '#6366f1', '#8b5cf6', '#ec4899', '#f59e0b'];

function App() {
  const [activeTab, setActiveTab] = useState('inbox');
  const [messages, setMessages] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [tagDistribution, setTagDistribution] = useState([]);
  const [channelDistribution, setChannelDistribution] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filterTag, setFilterTag] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [aiReply, setAiReply] = useState('');
  const [loadingReply, setLoadingReply] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = API_BASE + '/messages?';
        if (filterTag) url += 'tag=' + filterTag + '&';
        if (filterPriority) url += 'priority=' + filterPriority;
        
        const messagesRes = await fetch(url);
        const ticketsRes = await fetch(API_BASE + '/tickets');
        const analyticsRes = await fetch(API_BASE + '/analytics/overview');
        const tagRes = await fetch(API_BASE + '/analytics/messages-by-tag');
        const channelRes = await fetch(API_BASE + '/analytics/messages-by-channel');

        const messagesData = await messagesRes.json();
        const ticketsData = await ticketsRes.json();
        const analyticsData = await analyticsRes.json();
        const tagData = await tagRes.json();
        const channelData = await channelRes.json();

        setMessages(messagesData.messages || []);
        setTickets(ticketsData.tickets || []);
        setAnalytics(analyticsData.data || {});
        setTagDistribution(tagData.data || []);
        setChannelDistribution(channelData.data || []);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();
  }, [filterTag, filterPriority]);

  const refreshData = async () => {
    try {
      let url = API_BASE + '/messages?';
      if (filterTag) url += 'tag=' + filterTag + '&';
      if (filterPriority) url += 'priority=' + filterPriority;
      
      const messagesRes = await fetch(url);
      const ticketsRes = await fetch(API_BASE + '/tickets');
      const analyticsRes = await fetch(API_BASE + '/analytics/overview');
      const tagRes = await fetch(API_BASE + '/analytics/messages-by-tag');
      const channelRes = await fetch(API_BASE + '/analytics/messages-by-channel');

      const messagesData = await messagesRes.json();
      const ticketsData = await ticketsRes.json();
      const analyticsData = await analyticsRes.json();
      const tagData = await tagRes.json();
      const channelData = await channelRes.json();

      setMessages(messagesData.messages || []);
      setTickets(ticketsData.tickets || []);
      setAnalytics(analyticsData.data || {});
      setTagDistribution(tagData.data || []);
      setChannelDistribution(channelData.data || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const createTicket = async (messageId) => {
    try {
      const response = await fetch(API_BASE + '/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId: messageId, title: 'New Ticket' })
      });
      if (response.ok) {
        alert('✅ Ticket created successfully!');
        refreshData();
      }
    } catch (error) {
      alert('❌ Error creating ticket');
    }
  };

  const updateTicketStatus = async (ticketId, status) => {
    try {
      await fetch(API_BASE + '/tickets/' + ticketId + '/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: status })
      });
      alert('✅ Ticket updated!');
      refreshData();
    } catch (error) {
      alert('❌ Error updating');
    }
  };

  const getSuggestedReply = async (content) => {
    setLoadingReply(true);
    try {
      const response = await fetch(API_BASE + '/messages/suggest-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content })
      });
      const data = await response.json();
      setAiReply(data.reply || 'No suggestion');
    } catch (error) {
      setAiReply('Error generating reply');
    }
    setLoadingReply(false);
  };

  const getPriorityColor = (priority) => {
    if (priority >= 4) return 'from-red-500 to-pink-600';
    if (priority === 3) return 'from-yellow-400 to-orange-500';
    return 'from-green-400 to-emerald-500';
  };

  const getStatusColor = (status) => {
    if (status === 'resolved') return 'from-green-400 to-emerald-500';
    if (status === 'in_progress') return 'from-cyan-400 to-blue-500';
    return 'from-gray-500 to-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse delay-700"></div>
      </div>

      {/* Header */}
      <header className="relative bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 shadow-2xl border-b-2 border-cyan-400">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl">
                <Zap className="text-yellow-300" size={40} />
              </div>
              <div>
                <h1 className="text-4xl font-black text-white tracking-tight">
                  AUDIENCE QUERY SYSTEM
                </h1>
                <p className="text-cyan-200 mt-1 font-medium">AI-Powered Unified Inbox Management</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl px-6 py-3 shadow-lg">
              <Activity className="text-white animate-pulse" size={24} />
              <span className="text-white font-bold text-lg">LIVE</span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="relative bg-gradient-to-r from-slate-800 to-slate-900 shadow-xl border-b border-cyan-500">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex gap-2">
            <button
              onClick={() => setActiveTab('inbox')}
              className={activeTab === 'inbox' ? 'py-5 px-10 font-black text-cyan-400 bg-gradient-to-b from-slate-800 to-slate-900 border-b-4 border-cyan-400 text-lg' : 'py-5 px-10 font-black text-gray-400 hover:text-cyan-400 text-lg transition-all'}
            >
              📨 INBOX
            </button>
            <button
              onClick={() => setActiveTab('tickets')}
              className={activeTab === 'tickets' ? 'py-5 px-10 font-black text-cyan-400 bg-gradient-to-b from-slate-800 to-slate-900 border-b-4 border-cyan-400 text-lg' : 'py-5 px-10 font-black text-gray-400 hover:text-cyan-400 text-lg transition-all'}
            >
              🎫 TICKETS
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={activeTab === 'analytics' ? 'py-5 px-10 font-black text-cyan-400 bg-gradient-to-b from-slate-800 to-slate-900 border-b-4 border-cyan-400 text-lg' : 'py-5 px-10 font-black text-gray-400 hover:text-cyan-400 text-lg transition-all'}
            >
              📊 ANALYTICS
            </button>
          </nav>
        </div>
      </div>

      <main className="relative max-w-7xl mx-auto px-6 py-10">
        {activeTab === 'inbox' && (
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-all border-2 border-cyan-400">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-cyan-100 text-sm font-bold mb-2">TOTAL MESSAGES</p>
                    <p className="text-white text-5xl font-black">{analytics.totalMessages || 0}</p>
                  </div>
                  <MessageSquare className="text-white opacity-80" size={48} />
                </div>
              </div>

              <div className="relative overflow-hidden bg-gradient-to-br from-orange-600 to-red-500 rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-all border-2 border-orange-400">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-orange-100 text-sm font-bold mb-2">OPEN TICKETS</p>
                    <p className="text-white text-5xl font-black">{analytics.openTickets || 0}</p>
                  </div>
                  <AlertCircle className="text-white opacity-80" size={48} />
                </div>
              </div>

              <div className="relative overflow-hidden bg-gradient-to-br from-purple-600 to-pink-500 rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-all border-2 border-purple-400">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-purple-100 text-sm font-bold mb-2">IN PROGRESS</p>
                    <p className="text-white text-5xl font-black">{analytics.inProgressTickets || 0}</p>
                  </div>
                  <Clock className="text-white opacity-80" size={48} />
                </div>
              </div>

              <div className="relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-500 rounded-2xl shadow-2xl p-6 transform hover:scale-105 transition-all border-2 border-green-400">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-16 -mt-16"></div>
                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-green-100 text-sm font-bold mb-2">RESOLVED</p>
                    <p className="text-white text-5xl font-black">{analytics.resolvedTickets || 0}</p>
                  </div>
                  <CheckCircle className="text-white opacity-80" size={48} />
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-6 border-2 border-cyan-500">
              <div className="flex items-center space-x-4 flex-wrap gap-4">
                <div className="flex items-center gap-3">
                  <Filter size={24} className="text-cyan-400" />
                  <span className="text-cyan-400 font-black text-lg">FILTERS</span>
                </div>
                <select value={filterTag} onChange={(e) => setFilterTag(e.target.value)} className="flex-1 min-w-[200px] bg-gradient-to-r from-blue-900 to-cyan-900 border-2 border-cyan-500 rounded-xl px-4 py-3 text-white font-bold focus:ring-4 focus:ring-cyan-400">
                  <option value="">🏷️ All Tags</option>
                  <option value="question">❓ Question</option>
                  <option value="request">📋 Request</option>
                  <option value="complaint">😠 Complaint</option>
                  <option value="praise">🎉 Praise</option>
                </select>
                <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="flex-1 min-w-[200px] bg-gradient-to-r from-purple-900 to-pink-900 border-2 border-purple-500 rounded-xl px-4 py-3 text-white font-bold focus:ring-4 focus:ring-purple-400">
                  <option value="">🎯 All Priorities</option>
                  <option value="1">🟢 P1 Low</option>
                  <option value="2">🟡 P2</option>
                  <option value="3">🟠 P3 Medium</option>
                  <option value="4">🔴 P4 High</option>
                  <option value="5">🚨 P5 Critical</option>
                </select>
                <button onClick={() => { setFilterTag(''); setFilterPriority(''); }} className="px-8 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-black rounded-xl hover:from-red-700 hover:to-pink-700 shadow-lg transform hover:scale-105 transition-all">
                  CLEAR
                </button>
              </div>
            </div>

            {/* Messages List */}
            <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl shadow-2xl overflow-hidden border-2 border-cyan-500">
              <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-6 border-b-2 border-cyan-400">
                <h2 className="text-3xl font-black text-white flex items-center gap-4">
                  <MessageSquare size={32} className="text-yellow-300" />
                  UNIFIED INBOX
                  <span className="ml-auto bg-white bg-opacity-20 backdrop-blur-md px-5 py-2 rounded-full text-lg font-black">
                    {messages.length}
                  </span>
                </h2>
              </div>
              <div className="divide-y divide-cyan-900 max-h-[600px] overflow-y-auto">
                {messages.length === 0 ? (
                  <div className="p-16 text-center">
                    <MessageSquare className="mx-auto text-cyan-500 opacity-30 mb-6" size={80} />
                    <p className="text-cyan-300 text-2xl font-bold">No messages found</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg._id} className="p-6 hover:bg-gradient-to-r hover:from-cyan-900 hover:to-blue-900 cursor-pointer transition-all transform hover:scale-[1.02]" onClick={() => setSelectedMessage(msg)}>
                      <div className="flex justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-4 flex-wrap gap-2">
                            <span className="font-black text-white text-xl">{msg.sender}</span>
                            <span className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs font-black shadow-lg">
                              {msg.channel}
                            </span>
                            <span className={'px-4 py-2 rounded-full bg-gradient-to-r text-white text-xs font-black shadow-lg ' + getPriorityColor(msg.priority)}>
                              P{msg.priority}
                            </span>
                            <span className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-black shadow-lg">
                              {msg.tag}
                            </span>
                          </div>
                          <p className="text-gray-300 text-lg mb-3 leading-relaxed">{msg.content}</p>
                          <p className="text-cyan-400 text-sm flex items-center gap-2 font-medium">
                            <Clock size={16} />
                            {new Date(msg.receivedAt).toLocaleString()}
                          </p>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); createTicket(msg._id); }} className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black rounded-xl hover:from-cyan-600 hover:to-blue-700 shadow-xl transform hover:scale-110 transition-all">
                          🎫 CREATE TICKET
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tickets' && (
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl shadow-2xl overflow-hidden border-2 border-purple-500">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 border-b-2 border-purple-400">
              <h2 className="text-3xl font-black text-white flex items-center gap-4">
                <Ticket size={32} className="text-yellow-300" />
                ALL TICKETS
                <span className="ml-auto bg-white bg-opacity-20 backdrop-blur-md px-5 py-2 rounded-full text-lg font-black">
                  {tickets.length}
                </span>
              </h2>
            </div>
            <div className="divide-y divide-purple-900">
              {tickets.length === 0 ? (
                <div className="p-16 text-center">
                  <Ticket className="mx-auto text-purple-500 opacity-30 mb-6" size={80} />
                  <p className="text-purple-300 text-2xl font-bold">No tickets yet</p>
                </div>
              ) : (
                tickets.map((ticket) => (
                  <div key={ticket._id} className="p-6 hover:bg-gradient-to-r hover:from-purple-900 hover:to-pink-900 transition-all">
                    <div className="flex justify-between gap-6">
                      <div className="flex-1">
                        <h3 className="font-black text-white text-2xl mb-3">{ticket.title}</h3>
                        <p className="text-gray-300 mb-4 text-lg">{ticket.message?.content}</p>
                        <div className="flex items-center gap-3">
                          <span className={'px-5 py-2 rounded-full bg-gradient-to-r text-white text-sm font-black shadow-lg ' + getStatusColor(ticket.status)}>
                            {ticket.status.replace('_', ' ').toUpperCase()}
                          </span>
                          <span className="text-purple-400 text-sm flex items-center gap-2">
                            <Clock size={16} />
                            {new Date(ticket.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <select value={ticket.status} onChange={(e) => updateTicketStatus(ticket._id, e.target.value)} className="bg-gradient-to-r from-purple-800 to-pink-800 border-2 border-purple-500 rounded-xl px-6 py-3 text-white font-black focus:ring-4 focus:ring-purple-400 shadow-lg">
                        <option value="open">📋 OPEN</option>
                        <option value="in_progress">⏳ IN PROGRESS</option>
                        <option value="resolved">✅ RESOLVED</option>
                      </select>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 border-2 border-cyan-500">
              <h3 className="text-2xl font-black text-cyan-400 mb-6 flex items-center gap-3">
                <TrendingUp size={28} />
                MESSAGES BY TAG
              </h3>
              {tagDistribution.length === 0 ? (
                <div className="h-80 flex items-center justify-center">
                  <div className="text-center">
                    <Activity size={64} className="mx-auto text-cyan-500 opacity-30 mb-4" />
                    <p className="text-cyan-300 text-xl font-bold">No data available</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie data={tagDistribution} dataKey="count" nameKey="tag" cx="50%" cy="50%" outerRadius={120} label>
                      {tagDistribution.map((entry, index) => (
                        <Cell key={'cell-' + index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '2px solid #06b6d4', borderRadius: '12px', color: '#fff', fontWeight: 'bold' }} />
                    <Legend wrapperStyle={{ color: '#fff', fontWeight: 'bold' }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 border-2 border-purple-500">
              <h3 className="text-2xl font-black text-purple-400 mb-6 flex items-center gap-3">
                <Activity size={28} />
                MESSAGES BY CHANNEL
              </h3>
              {channelDistribution.length === 0 ? (
                <div className="h-80 flex items-center justify-center">
                  <div className="text-center">
                    <Activity size={64} className="mx-auto text-purple-500 opacity-30 mb-4" />
                    <p className="text-purple-300 text-xl font-bold">No data available</p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={channelDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="channel" stroke="#94a3b8" style={{ fontWeight: 'bold' }} />
                    <YAxis stroke="#94a3b8" style={{ fontWeight: 'bold' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '2px solid #8b5cf6', borderRadius: '12px', color: '#fff', fontWeight: 'bold' }} />
                    <Bar dataKey="count" fill="url(#colorBar)" radius={[10, 10, 0, 0]} />
                    <defs>
                      <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={1}/>
                        <stop offset="95%" stopColor="#ec4899" stopOpacity={1}/>
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-4 border-cyan-500">
            <div className="bg-gradient-to-r from-cyan-600 to-blue-600 p-8 border-b-2 border-cyan-400">
              <div className="flex justify-between items-center">
                <h2 className="text-3xl font-black text-white flex items-center gap-3">
                  <MessageSquare size={32} className="text-yellow-300" />
                  MESSAGE DETAILS
                </h2>
                <button onClick={() => { setSelectedMessage(null); setAiReply(''); }} className="p-3 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-all">
                  <X className="text-white" size={28} />
                </button>
              </div>
            </div>
            <div className="p-8 space-y-6">
              <div className="bg-gradient-to-r from-blue-900 to-cyan-900 rounded-xl p-6 border-2 border-cyan-500">
                <label className="text-cyan-400 text-sm font-black uppercase mb-2 block">FROM</label>
                <p className="text-white text-2xl font-bold">{selectedMessage.sender}</p>
              </div>
              <div className="bg-gradient-to-r from-purple-900 to-pink-900 rounded-xl p-6 border-2 border-purple-500">
                <label className="text-purple-400 text-sm font-black uppercase mb-2 block">CHANNEL</label>
                <p className="text-white text-2xl font-bold">{selectedMessage.channel}</p>
              </div>
              <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-xl p-6 border-2 border-gray-500">
                <label className="text-gray-400 text-sm font-black uppercase mb-2 block">MESSAGE</label>
                <p className="text-white text-lg leading-relaxed">{selectedMessage.content}</p>
              </div>
              <button onClick={() => getSuggestedReply(selectedMessage.content)} disabled={loadingReply} className="w-full px-8 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black rounded-2xl hover:from-cyan-600 hover:to-blue-700 shadow-2xl transform hover:scale-105 transition-all text-xl">
                {loadingReply ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    GENERATING...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <Send size={24} />
                    GET AI REPLY SUGGESTION
                  </div>
                )}
              </button>
              {aiReply && (
                <div className="bg-gradient-to-r from-blue-900 to-cyan-900 rounded-xl p-6 border-2 border-cyan-500">
                  <label className="text-cyan-400 text-sm font-black uppercase mb-3 flex items-center gap-2 block">
                    <Zap className="text-yellow-300" size={20} />
                    AI SUGGESTED REPLY
                  </label>
                  <p className="text-white text-lg leading-relaxed font-medium">{aiReply}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
