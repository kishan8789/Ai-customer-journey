import React, { useEffect, React, useCallback, useState } from "react";
import axios from "axios";
import "./App.css";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { 
  Users, Activity, TrendingUp, Search, PlusCircle, 
  Target, LogOut, LayoutDashboard,
  Bell, Calendar, ArrowUpRight, Zap, Globe, ShieldCheck,
  Filter, Download, MoreHorizontal, Sparkles, Rocket, Cpu,
  Terminal, Database, ArrowRight
} from "lucide-react";

// ✅ API instance 
const API = axios.create({ baseURL: "http://localhost:5000/api" });

function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [customers, setCustomers] = useState([]); // Default empty array
  const [analytics, setAnalytics] = useState({ totalCustomers: 0, stageDistribution: {} });
  const [searchTerm, setSearchTerm] = useState("");
  const [customerForm, setCustomerForm] = useState({ name: "", email: "", visits: "", purchases: "" });
  const [isInjecting, setIsInjecting] = useState(false);

  // ✅ 1. Wrap fetch in useCallback to prevent infinite loops
  const fetchDashboardData = useCallback(async () => {
    try {
      const [custRes, anaRes] = await Promise.all([
        API.get("/customers"), 
        API.get("/analytics")
      ]);
      // Ensure data is an array
      setCustomers(Array.isArray(custRes.data) ? custRes.data : []);
      setAnalytics(anaRes.data || null);
      console.log("✅ Matrix Synced:", custRes.data.length, "nodes found.");
    } catch (error) { 
      console.error("❌ Data Sync Error:", error); 
    }
  }, []);

  // ✅ 2. Proper useEffect call
  useEffect(() => { 
    fetchDashboardData(); 
  }, [fetchDashboardData]);

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
        // ✅ 3. Refresh data immediately after injection
        await fetchDashboardData(); 
        alert("📈 Node Injected into Matrix!");
      }
    } catch (error) {
      console.error("❌ Node Injection Error:", error);
      alert("Injection Failed. Check server connection.");
    } finally {
      setIsInjecting(false);
    }
  };

  const renderTabContent = () => {
    if (activeTab === "overview") {
      return (
        <div className="tab-fade-in">
          <section className="stats-grid">
            <div className="premium-card kpi-card glass-morph">
              <div className="kpi-header">
                <div className="kpi-icon-box purple"><Users size={20}/></div>
                <span className="trend-label positive">+12% <ArrowUpRight size={14}/></span>
              </div>
              <div className="kpi-body">
                <p>Network Leads</p>
                <h3>{customers?.length || 0}</h3>
              </div>
            </div>

            <div className="premium-card kpi-card glass-morph">
              <div className="kpi-header">
                <div className="kpi-icon-box green"><Activity size={20}/></div>
                <span className="trend-label stable">Optimized</span>
              </div>
              <div className="kpi-body">
                <p>AI Efficiency</p>
                <h3>
                  {customers.length > 0 
                    ? ((customers.reduce((a, b) => a + (b.engagementScore || 0), 0)) / customers.length).toFixed(1) 
                    : "0.0"}%
                </h3>
              </div>
            </div>

            <div className="premium-card kpi-card glass-morph">
              <div className="kpi-header">
                <div className="kpi-icon-box gold"><TrendingUp size={20}/></div>
                <span className="trend-label forecasted">Forecast</span>
              </div>
              <div className="kpi-body">
                <p>Revenue Potential</p>
                <h3>${(customers.filter(c => c.stage === "Purchase").length * 499).toLocaleString()}</h3>
              </div>
            </div>
          </section>

          <div className="dashboard-grid-layout">
            <div className="visual-panel">
              <div className="premium-card chart-container shadow-glow">
                <div className="card-title-bar">
                  <div className="title-text"><Sparkles size={16} className="sparkle-anim"/> <span>Neural Matrix Velocity</span></div>
                  <div className="title-actions"><Filter size={14}/> <Download size={14}/></div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={customers.length > 0 ? customers.slice(0, 15).reverse() : []}>
                    <defs>
                      <linearGradient id="colorEng" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.04)" />
                    <XAxis dataKey="name" hide /> 
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)'}} />
                    <Area type="monotone" dataKey="engagementScore" stroke="#6366f1" strokeWidth={3} fill="url(#colorEng)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="premium-card form-container">
                <div className="card-title-bar"><PlusCircle size={18} color="#6366f1"/> <h3>Manual Node Injector</h3></div>
                <form className="modern-form" onSubmit={handleAddNode}>
                  <div className="input-group">
                    <input type="text" placeholder="Subject Name" value={customerForm.name} onChange={e => setCustomerForm({...customerForm, name: e.target.value})} required />
                    <input type="email" placeholder="Access Email" value={customerForm.email} onChange={e => setCustomerForm({...customerForm, email: e.target.value})} required />
                  </div>
                  <div className="input-group">
                    <input type="number" placeholder="Visits" value={customerForm.visits} onChange={e => setCustomerForm({...customerForm, visits: e.target.value})} />
                    <input type="number" placeholder="Conversions" value={customerForm.purchases} onChange={e => setCustomerForm({...customerForm, purchases: e.target.value})} />
                    <button type="submit" className={`primary-btn-premium ${isInjecting ? 'loading' : ''}`} disabled={isInjecting}>
                      {isInjecting ? 'Injecting...' : 'Inject Node'} <ArrowRight size={16}/>
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
            <div><h2>Neural Node Intelligence</h2><p>Real-time matrix sync status</p></div>
            <div className="search-box-premium">
              <Search size={16} color="#94a3b8"/>
              <input type="text" placeholder="Search node by name..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
            </div>
          </div>
          <div className="table-wrapper">
             <table className="pro-table">
               <thead><tr><th>Node Entity</th><th>Sync Status</th><th>Strength</th><th>Lifecycle</th><th>Action</th></tr></thead>
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
                   <tr><td colSpan="5" style={{textAlign: 'center', padding: '40px', color: '#94a3b8'}}>No data available in the Neural Matrix.</td></tr>
                 )}
               </tbody>
             </table>
          </div>
        </div>
      );
    }
    // ... campaigns tab remains same
    return null;
  };

  return (
    <div className="app-shell-premium">
      {/* Sidebar and Header logic stays exactly as you provided */}
      <aside className="sidebar-premium">
        <div className="brand-premium"><div className="logo-icon"><Zap size={20} fill="#fff"/></div> <span>NEXUS AI</span></div>
        <nav className="nav-list-premium">
          <button className={activeTab === "overview" ? "active" : ""} onClick={() => setActiveTab("overview")}><LayoutDashboard size={18}/> Overview</button>
          <button className={activeTab === "audience" ? "active" : ""} onClick={() => setActiveTab("audience")}><Users size={18}/> Node Matrix</button>
          <button className={activeTab === "campaigns" ? "active" : ""} onClick={() => setActiveTab("campaigns")}><Globe size={18}/> Deployments</button>
          <div className="nav-label">System Architecture</div>
          <button className="disabled"><ShieldCheck size={18}/> Security</button>
          <button className="disabled"><Cpu size={18}/> Config</button>
        </nav>
        <div className="sidebar-footer">
            <div className="user-pill-pro"><div className="u-avatar">K</div><div><strong>Root Admin</strong><small>Node Ludhiana</small></div></div>
        </div>
      </aside>

      <main className="main-content-premium">
        <header className="header-premium glass-morph">
          <div className="header-left">
            <div className="live-status-label"><div className="pulse-dot-pro"></div> NOMINAL</div>
            <h1>{activeTab.toUpperCase()} <span className="h-sub">/ Intelligence</span></h1>
          </div>
          <div className="header-right">
             <div className="calendar-pill"><Calendar size={14}/> {new Date().toLocaleTimeString()}</div>
             <button className="bell-btn-premium"><Bell size={20}/><span className="count">3</span></button>
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
