import React, { useEffect, useCallback, useState } from "react";
import axios from "axios";
import "./App.css";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { 
  Users, Activity, TrendingUp, Search, PlusCircle, 
  LayoutDashboard, Bell, Calendar, ArrowUpRight, Zap, 
  Globe, ShieldCheck, Filter, Download, MoreHorizontal, 
  Sparkles, Rocket, Cpu, Terminal, Database, ArrowRight,
  Shield, Fingerprint
} from "lucide-react";

// ✅ Intelligent API Instance: Automatically handles Local vs Render
const API = axios.create({ 
  baseURL: window.location.origin.includes("localhost") 
    ? "http://localhost:5000/api" 
    : "/api",
  headers: { "Content-Type": "application/json" }
});

function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [customers, setCustomers] = useState([]); 
  const [analytics, setAnalytics] = useState({ totalCustomers: 0, stageDistribution: {} });
  const [searchTerm, setSearchTerm] = useState("");
  const [customerForm, setCustomerForm] = useState({ name: "", email: "", visits: "", purchases: "" });
  const [isInjecting, setIsInjecting] = useState(false);

  // ✅ Data Sync Logic
  const fetchDashboardData = useCallback(async () => {
    try {
      const [custRes, anaRes] = await Promise.all([
        API.get("/customers"), 
        API.get("/analytics")
      ]);
      setCustomers(Array.isArray(custRes.data) ? custRes.data : []);
      setAnalytics(anaRes.data || { totalCustomers: 0, stageDistribution: {} });
    } catch (error) { 
      console.error("❌ Matrix Sync Error:", error.message); 
    }
  }, []);

  useEffect(() => { 
    fetchDashboardData(); 
  }, [fetchDashboardData]);

  // ✅ Advanced Node Injection
  const handleAddNode = async (e) => {
    e.preventDefault();
    setIsInjecting(true);
    try {
      const payload = {
        name: customerForm.name,
        email: customerForm.email,
        visits: Number(customerForm.visits) || 0,
        purchases: Number(customerForm.purchases) || 0
      };
      
      const res = await API.post("/customers", payload);
      
      if (res.status === 201 || res.status === 200) {
        setCustomerForm({ name: "", email: "", visits: "", purchases: "" });
        await fetchDashboardData(); 
        alert("🚀 Node Integrated into Neural Matrix!");
      }
    } catch (error) {
      console.error("❌ Injection Error:", error.response?.data || error.message);
      alert(`Injection Failed: ${error.response?.data?.message || "Check Server Connectivity"}`);
    } finally {
      setIsInjecting(false);
    }
  };

  const renderTabContent = () => {
    if (activeTab === "overview") {
      return (
        <div className="tab-fade-in">
          {/* Dashboard Stats Dashboard */}
          <section className="stats-grid">
            <div className="premium-card kpi-card glass-glow-purple">
              <div className="kpi-header">
                <div className="kpi-icon-box purple"><Users size={20}/></div>
                <span className="trend-label positive">+14% <ArrowUpRight size={14}/></span>
              </div>
              <div className="kpi-body">
                <p>Total Nodes</p>
                <h3>{customers?.length || 0}</h3>
              </div>
              <div className="card-progress-bar"><div className="fill" style={{width: '70%'}}></div></div>
            </div>

            <div className="premium-card kpi-card glass-glow-blue">
              <div className="kpi-header">
                <div className="kpi-icon-box blue"><Activity size={20}/></div>
                <span className="trend-label stable">Live Syncing</span>
              </div>
              <div className="kpi-body">
                <p>System Efficiency</p>
                <h3>
                  {customers.length > 0 
                    ? ((customers.reduce((a, b) => a + (b.engagementScore || 0), 0)) / customers.length).toFixed(1) 
                    : "0.0"}%
                </h3>
              </div>
              <div className="card-progress-bar"><div className="fill blue" style={{width: '85%'}}></div></div>
            </div>

            <div className="premium-card kpi-card glass-glow-gold">
              <div className="kpi-header">
                <div className="kpi-icon-box gold"><TrendingUp size={20}/></div>
                <span className="trend-label forecasted">Targeted</span>
              </div>
              <div className="kpi-body">
                <p>Market Value</p>
                <h3>${(customers.filter(c => c.stage === "Purchase").length * 999).toLocaleString()}</h3>
              </div>
              <div className="card-progress-bar"><div className="fill gold" style={{width: '60%'}}></div></div>
            </div>
          </section>

          <div className="dashboard-main-grid">
            <div className="visual-panel">
              {/* Ultra Smooth Area Chart */}
              <div className="premium-card chart-container shadow-glow">
                <div className="card-title-bar">
                  <div className="title-text"><Sparkles size={16} className="sparkle-anim"/> <span>Neural Growth Matrix</span></div>
                  <div className="title-actions"><Fingerprint size={16}/> <Filter size={16}/></div>
                </div>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={customers.length > 0 ? customers.slice(-10) : []}>
                    <defs>
                      <linearGradient id="colorEng" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#818cf8" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="name" hide /> 
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #334155', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)'}}
                    />
                    <Area type="monotone" dataKey="engagementScore" stroke="#818cf8" strokeWidth={3} fill="url(#colorEng)" animationBegin={300} animationDuration={2000} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Advanced Form */}
              <div className="premium-card form-container glass-morph">
                <div className="card-title-bar"><PlusCircle size={18} color="#818cf8"/> <h3>Node Registry</h3></div>
                <form className="modern-form" onSubmit={handleAddNode}>
                  <div className="input-group">
                    <div className="input-wrapper">
                      <Terminal size={14} className="input-icon" />
                      <input type="text" placeholder="Entity Name" value={customerForm.name} onChange={e => setCustomerForm({...customerForm, name: e.target.value})} required />
                    </div>
                    <div className="input-wrapper">
                      <Database size={14} className="input-icon" />
                      <input type="email" placeholder="System Email" value={customerForm.email} onChange={e => setCustomerForm({...customerForm, email: e.target.value})} required />
                    </div>
                  </div>
                  <div className="input-group mt-15">
                    <input type="number" placeholder="Visits" value={customerForm.visits} onChange={e => setCustomerForm({...customerForm, visits: e.target.value})} />
                    <input type="number" placeholder="Conversion" value={customerForm.purchases} onChange={e => setCustomerForm({...customerForm, purchases: e.target.value})} />
                    <button type="submit" className={`primary-btn-premium ${isInjecting ? 'loading' : ''}`} disabled={isInjecting}>
                      {isInjecting ? 'Processing...' : 'Deploy Node'} <ArrowRight size={16}/>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "audience") {
      return (
        <div className="tab-fade-in premium-card table-section-pro glass-morph">
          <div className="table-header-pro">
            <div><h2>Registry Matrix</h2><p>Real-time node status intelligence</p></div>
            <div className="search-box-premium">
              <Search size={16} color="#94a3b8"/>
              <input type="text" placeholder="Search entity..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
            </div>
          </div>
          <div className="table-wrapper">
             <table className="pro-table">
               <thead><tr><th>Node Entity</th><th>Pulse</th><th>Integrity</th><th>Status</th><th>Ops</th></tr></thead>
               <tbody>
                 {customers.length > 0 ? (
                   customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map(c => (
                      <tr key={c._id || Math.random()} className="row-hover">
                        <td>
                          <div className="node-cell">
                            <div className="avatar-grad">{c.name?.charAt(0)}</div>
                            <div><strong>{c.name}</strong><span>{c.email}</span></div>
                          </div>
                        </td>
                        <td><div className="pulse-container"><div className="pulse-ring"></div><div className="pulse-dot"></div></div></td>
                        <td>
                          <div className="sync-score-wrapper">
                            <span>{c.engagementScore || 0}%</span>
                            <div className="sync-bar-bg"><div className="sync-bar-fill" style={{width: `${c.engagementScore || 0}%`}}></div></div>
                          </div>
                        </td>
                        <td><span className={`badge-pill-v2 ${c.stage?.toLowerCase()}`}>{c.stage || 'Lead'}</span></td>
                        <td><button className="icon-btn-v3"><MoreHorizontal size={18} /></button></td>
                      </tr>
                    ))
                 ) : (
                   <tr><td colSpan="5" className="empty-state">No active nodes detected in the matrix.</td></tr>
                 )}
               </tbody>
             </table>
          </div>
        </div>
      );
    }

    if (activeTab === "campaigns") {
      return (
        <div className="tab-fade-in premium-card hero-section-v3">
          <div className="hero-content-pro">
             <div className="hero-visual-v3"><Rocket size={80} color="#818cf8" className="rocket-float-pro"/><div className="glow-orbit"></div></div>
             <h2>Neural Campaign Orchestrator</h2>
             <p>Deploy autonomous marketing protocols across digital sectors.</p>
             <div className="btn-group">
                <button className="primary-btn-premium lg-btn"><Zap size={18}/> Initiate Protocol</button>
                <button className="secondary-btn-premium lg-btn"><Shield size={18}/> Security Audit</button>
             </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="app-shell-premium">
      {/* Sidebar Sidebar */}
      <aside className="sidebar-premium">
        <div className="brand-premium">
          <div className="logo-icon"><Zap size={22} fill="#fff" /></div> 
          <span>NEXUS AI</span>
        </div>
        <nav className="nav-list-premium">
          <button className={activeTab === "overview" ? "active" : ""} onClick={() => setActiveTab("overview")}><LayoutDashboard size={18}/> Overview</button>
          <button className={activeTab === "audience" ? "active" : ""} onClick={() => setActiveTab("audience")}><Users size={18}/> Node Registry</button>
          <button className={activeTab === "campaigns" ? "active" : ""} onClick={() => setActiveTab("campaigns")}><Globe size={18}/> Deployments</button>
          <div className="nav-label">System Architecture</div>
          <button className="disabled"><ShieldCheck size={18}/> Firewalls</button>
          <button className="disabled"><Cpu size={18}/> Neural Core</button>
        </nav>
        <div className="sidebar-footer">
            <div className="user-pill-pro">
              <div className="u-avatar">RA</div>
              <div><strong>Admin Root</strong><small>Ludhiana Node</small></div>
            </div>
        </div>
      </aside>

      {/* Main Content Main */}
      <main className="main-content-premium">
        <header className="header-premium glass-morph">
          <div className="header-left">
            <div className="live-status-label"><div className="pulse-dot-pro"></div> SYSTEM ONLINE</div>
            <h1>{activeTab.toUpperCase()} <span className="h-sub">/ Matrix</span></h1>
          </div>
          <div className="header-right">
             <div className="calendar-pill"><Calendar size={14}/> {new Date().toLocaleDateString()}</div>
             <button className="bell-btn-premium"><Bell size={20}/><span className="count">12</span></button>
          </div>
        </header>

        <div className="scroll-area">
            {renderTabContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
