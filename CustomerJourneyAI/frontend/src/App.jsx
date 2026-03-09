import React, { useEffect, useCallback, useState } from "react";
import axios from "axios";
import "./App.css";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
} from "recharts";
import { 
  Users, Activity, TrendingUp, Search, PlusCircle, 
  Target, LogOut, LayoutDashboard,
  Bell, Calendar, ArrowUpRight, Zap, Globe, ShieldCheck,
  Filter, Download, MoreHorizontal, Sparkles, Rocket, Cpu,
  Terminal, Database, ArrowRight, BrainCircuit, BotMessageSquare
} from "lucide-react";

// ✅ Intelligent API Instance (Works on Local & Render)
const API = axios.create({ 
  baseURL: window.location.origin.includes("localhost") 
    ? "http://localhost:5000/api" 
    : "/api",
  headers: { "Content-Type": "application/json" }
});

// ✅ Helper component for KPI Sparklines (Preserving function, adding attractiveness)
const MiniChart = ({ data, color }) => (
  <ResponsiveContainer width="100%" height={40}>
    <LineChart data={data}>
      <Line type="monotone" dataKey="pv" stroke={color} strokeWidth={2} dot={false} />
    </LineChart>
  </ResponsiveContainer>
);

function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [customers, setCustomers] = useState([]); 
  const [analytics, setAnalytics] = useState({ totalCustomers: 0, stageDistribution: {} });
  const [searchTerm, setSearchTerm] = useState("");
  const [customerForm, setCustomerForm] = useState({ name: "", email: "", visits: "", purchases: "" });
  const [isInjecting, setIsInjecting] = useState(false);
  // Add live time for header attractive look
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  // ✅ Wrap fetch in useCallback
  const fetchDashboardData = useCallback(async () => {
    try {
      const [custRes, anaRes] = await Promise.all([
        API.get("/customers"), 
        API.get("/analytics")
      ]);
      setCustomers(Array.isArray(custRes.data) ? custRes.data : []);
      setAnalytics(anaRes.data || { totalCustomers: 0, stageDistribution: {} });
      console.log("✅ Matrix Synced:", custRes.data.length, "nodes found.");
    } catch (error) { 
      console.error("❌ Matrix Sync Error:", error.message); 
    }
  }, []);

  useEffect(() => { 
    fetchDashboardData();
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
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
        console.log("📈 Node Injected successfully");
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
      // Fake trend data for mini charts (Adding look, not removing functionality)
      const trendData = [{pv: 20}, {pv: 50}, {pv: 30}, {pv: 80}, {pv: 40}];
      const trendData2 = [{pv: 10}, {pv: 30}, {pv: 20}, {pv: 60}, {pv: 50}];
      const trendData3 = [{pv: 40}, {pv: 20}, {pv: 50}, {pv: 30}, {pv: 70}];

      return (
        <div className="tab-fade-in">
          {/* Dashboard Stats Dashboard */}
          <section className="stats-grid">
            <div className="premium-card kpi-card glass-glow-purple advanced-kpi shadow-glow">
              <div className="kpi-header">
                <div className="kpi-icon-box purple"><Users size={20}/></div>
                <span className="trend-label positive">+12% <ArrowUpRight size={14}/></span>
              </div>
              <div className="kpi-body">
                <p>Neural Nodes Connected</p>
                <h3>{customers?.length || 0}</h3>
              </div>
              <MiniChart data={trendData} color="#a855f7" /> {/* Preserving function, adding look */}
            </div>

            <div className="premium-card kpi-card glass-glow-blue advanced-kpi shadow-glow">
              <div className="kpi-header">
                <div className="kpi-icon-box blue"><Activity size={20}/></div>
                <span className="trend-label stable">Optimized Pulse</span>
              </div>
              <div className="kpi-body">
                <p>System Matrix Efficiency</p>
                <h3>
                  {customers.length > 0 
                    ? ((customers.reduce((a, b) => a + (b.engagementScore || 0), 0)) / customers.length).toFixed(1) 
                    : "0.0"}%
                </h3>
              </div>
              <MiniChart data={trendData2} color="#3b82f6" />
            </div>

            <div className="premium-card kpi-card glass-glow-gold advanced-kpi shadow-glow">
              <div className="kpi-header">
                <div className="kpi-icon-box gold"><TrendingUp size={20}/></div>
                <span className="trend-label forecasted">Targeted</span>
              </div>
              <div className="kpi-body">
                <p>Projected Matrix Value</p>
                <h3>${(customers.filter(c => c.stage === "Purchase").length * 999).toLocaleString()}</h3>
              </div>
              <MiniChart data={trendData3} color="#eab308" />
            </div>
          </section>

          <div className="dashboard-main-grid-layout"> {/* Updated grid for attractiveness */}
            <div className="visual-panel-primary">
              {/* Ultra Smooth Area Chart */}
              <div className="premium-card chart-container advanced-shadow shadow-glow">
                <div className="card-title-bar">
                  <div className="title-text"><Sparkles size={16} className="sparkle-anim"/> <span>Neural Velocity Index</span></div>
                  <div className="title-actions"><Cpu size={14}/> <Filter size={14}/> <Download size={14}/></div>
                </div>
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={customers.length > 0 ? customers.slice(0, 15).reverse() : []} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorEng" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                    <XAxis dataKey="name" hide /> 
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip 
                      contentStyle={{backgroundColor: '#1e293b', borderRadius: '12px', border: '1px solid #334155', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)', color: '#fff'}}
                      itemStyle={{color: '#818cf8'}}
                    />
                    <Area type="monotone" dataKey="engagementScore" stroke="#818cf8" strokeWidth={4} fill="url(#colorEng)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Advanced Form */}
              <div className="premium-card form-container glass-morph shadow-glow">
                <div className="card-title-bar"><PlusCircle size={18} color="#6366f1"/> <h3>Neural Node Registry</h3></div>
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
                  <div className="input-group">
                    <input type="number" placeholder="Visits" value={customerForm.visits} onChange={e => setCustomerForm({...customerForm, visits: e.target.value})} />
                    <input type="number" placeholder="Conversion" value={customerForm.purchases} onChange={e => setCustomerForm({...customerForm, purchases: e.target.value})} />
                    <button type="submit" className={`primary-btn-premium ${isInjecting ? 'loading' : ''}`} disabled={isInjecting}>
                      {isInjecting ? 'Processing...' : 'Deploy Node'} <ArrowRight size={16}/>
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* New section added for looks and complexity, without removing functionality */}
            <div className="side-panel-advanced premium-card glass-morph">
              <div className="card-title-bar"><BrainCircuit size={16} color="#a855f7"/> <h3>Neural Matrix Analysis</h3></div>
              <div className="analysis-content">
                <div className="analysis-item">
                  <span className="label">Primary Lifecycle:</span>
                  <span className="value text-purple">{analytics.stageDistribution?.Awareness || 0} Nodes</span>
                </div>
                <div className="analysis-item">
                  <span className="label">Optimal Sync:</span>
                  <span className="value text-gold">{customers.filter(c => c.engagementScore > 70).length} Nodes</span>
                </div>
                <button className="primary-btn-premium sm-btn w-full mt-10">Generate Detailed Report <Zap size={14} /></button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === "audience") {
      return (
        <div className="tab-fade-in premium-card table-section-pro glass-morph shadow-glow">
          <div className="table-header-pro">
            <div><h2>Registry Matrix</h2><p>Real-time system sync status</p></div>
            <div className="search-box-premium">
              <Search size={16} color="#94a3b8"/>
              <input type="text" placeholder="Search node by name..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
            </div>
          </div>
          <div className="table-wrapper">
             <table className="pro-table">
               <thead><tr><th>Node Entity</th><th>Pulse</th><th>Strength</th><th>Lifecycle</th><th>Ops</th></tr></thead>
               <tbody>
                 {customers.length > 0 ? (
                   customers
                    .filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map(c => (
                      <tr key={c._id || Math.random()} className="row-hover">
                        <td><div className="node-cell"><div className="avatar-grad">{c.name?.charAt(0) || "N"}</div><div><strong>{c.name}</strong><span>{c.email}</span></div></div></td>
                        <td><div className={`status-pill-v2 ${(c.engagementScore || 0) > 50 ? 'active' : 'idle'}`}>{(c.engagementScore || 0) > 50 ? 'High Power' : 'Low Power'}</div></td>
                        <td><div className="sync-score-wrapper"><span>{c.engagementScore || 0}%</span><div className="sync-bar-bg"><div className="sync-bar-fill" style={{width: `${c.engagementScore || 0}%`}}></div></div></div></td>
                        <td><span className={`badge-pill-v2 ${c.stage?.toLowerCase() || 'unknown'}`}>{c.stage || 'Awareness'}</span></td>
                        <td><button className="icon-btn-v3"><MoreHorizontal size={18} /></button></td>
                      </tr>
                    ))
                 ) : (
                   <tr><td colSpan="5" className="empty-state">No data available in the Neural Matrix.</td></tr>
                 )}
               </tbody>
             </table>
          </div>
        </div>
      );
    }

    if (activeTab === "campaigns") {
      return (
        <div className="tab-fade-in premium-card hero-section-v3 advanced-hero glass-morph shadow-glow">
          <div className="hero-content-pro">
             <div className="hero-visual-v3">
                <Rocket size={80} color="#6366f1" className="rocket-float-pro"/>
                <div className="glow-orbit"></div>
             </div>
             <h2>Neural Campaign Orchestrator</h2>
             <p>Deploy autonomous marketing protocols across digital sectors.</p>
             <div className="btn-group">
                <button className="primary-btn-premium lg-btn"><Zap size={18}/> Initiate Protocol</button>
                <button className="secondary-btn-premium lg-btn"><ShieldCheck size={18}/> System Security Audit</button>
             </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="app-shell-premium advanced-shell">
      {/* Sidebar and Header logic stays exactly as you provided, with better CSS structure */}
      <aside className="sidebar-premium glass-morph">
        <div className="brand-premium"><div className="logo-icon"><Zap size={20} fill="#fff"/></div> <span>NEXUS AI</span></div>
        <nav className="nav-list-premium">
          <button className={activeTab === "overview" ? "active" : ""} onClick={() => setActiveTab("overview")}><LayoutDashboard size={18}/> Core Overview</button>
          <button className={activeTab === "audience" ? "active" : ""} onClick={() => setActiveTab("audience")}><Users size={18}/> Node Matrix</button>
          <button className={activeTab === "campaigns" ? "active" : ""} onClick={() => setActiveTab("campaigns")}><Globe size={18}/> Deployments</button>
          <div className="nav-label">System Architecture</div>
          <button className="disabled"><ShieldCheck size={18}/> Firewalls</button>
          <button className="disabled"><Cpu size={18}/> Core Config</button>
        </nav>
        
        {/* Added New section for look and complexity */}
        <div className="sidebar-feed premium-card shadow-glow-indigo">
          <div className="feed-header"><BotMessageSquare size={14} color="#818cf8"/> <span>Neural core activity</span></div>
          <div className="feed-item"><ArrowUpRight size={12}/> Node-X synced successfully</div>
          <div className="feed-item"><Filter size={12}/> Optimization protocol engaged</div>
        </div>

        <div className="sidebar-footer">
            <div className="user-pill-pro user-pill-advanced"><div className="u-avatar">RA</div><div><strong>Root Admin</strong><small>Node Ludhiana</small></div></div>
        </div>
      </aside>

      <main className="main-content-premium">
        <header className="header-premium glass-morph shadow-glow">
          <div className="header-left">
            <div className="live-status-label-advanced"><div className="pulse-dot-pro"></div> SYSTEM ONLINE</div>
            <h1>{activeTab.toUpperCase()} <span className="h-sub">/ Matrix</span></h1>
          </div>
          <div className="header-right header-right-advanced">
             <div className="calendar-pill advanced-pill"><Calendar size={14}/> {new Date().toLocaleDateString()} / {time}</div>
             <button className="bell-btn-premium advanced-bell"><Bell size={20}/><span className="count">12</span></button>
          </div>
        </header>

        <div className="scroll-area advanced-scroll">
            {renderTabContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
