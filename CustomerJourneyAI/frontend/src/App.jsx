import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { 
  Users, Activity, Search, PlusCircle, 
  Target, LayoutDashboard, ShoppingCart, AlertTriangle,
  Bell, Calendar, ArrowUpRight, Zap, Globe, ShieldCheck,
  Filter, Download, MoreHorizontal, Sparkles, Rocket, Cpu,
  ArrowRight
} from "lucide-react";

// Funnel Data from your Journey Mapper
const funnelData = [
  { stage: 'Awareness', count: 12500 },
  { stage: 'Consideration', count: 4200 },
  { stage: 'Cart', count: 1800 },
  { stage: 'Purchase', count: 850 },
];

// API instance (Make sure backend is running on 5000)
const API = axios.create({ baseURL: "http://localhost:5000/api" });

function App() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [customers, setCustomers] = useState([]); // For the Node Matrix Table
  const [searchTerm, setSearchTerm] = useState("");
  const [isInjecting, setIsInjecting] = useState(false);
  const [customerForm, setCustomerForm] = useState({ name: "", email: "", visits: "", purchases: "" });

  // Fetch AI Journey Data on load
  useEffect(() => { 
    fetchDashboardData(); 
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetching the stats from your backend
      const res = await API.get("/dashboard-stats");
      setStats(res.data);

      // Generating some dummy data for the premium table (so it doesn't look empty)
      setCustomers([
        { _id: 1, name: "Rahul Sharma", email: "rahul@test.com", engagementScore: 85, stage: "Purchase" },
        { _id: 2, name: "Priya Singh", email: "priya@test.com", engagementScore: 42, stage: "Consideration" },
        { _id: 3, name: "Amit Verma", email: "amit@test.com", engagementScore: 91, stage: "Cart" },
      ]);
    } catch (error) { 
      console.error("Data Fetch Error:", error); 
    }
  };

  const handleAddNode = async (e) => {
    e.preventDefault();
    setIsInjecting(true);
    setTimeout(() => {
      alert("Lead Injected Successfully into Matrix!");
      setCustomerForm({ name: "", email: "", visits: "", purchases: "" });
      setIsInjecting(false);
    }, 1000);
  };

  const renderTabContent = () => {
    if (activeTab === "overview") {
      return (
        <div className="tab-fade-in">
          {/* KPI Cards (Replaced with AI Journey Metrics) */}
          <section className="stats-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
            
            <div className="premium-card kpi-card glass-morph">
              <div className="kpi-header">
                <div className="kpi-icon-box purple"><Target size={20}/></div>
                <span className="trend-label positive">+14% <ArrowUpRight size={14}/></span>
              </div>
              <div className="kpi-body">
                <p>Total Traffic (Awareness)</p>
                <h3>{stats?.awareness || "12,500"}</h3>
              </div>
            </div>

            <div className="premium-card kpi-card glass-morph">
              <div className="kpi-header">
                <div className="kpi-icon-box blue"><Activity size={20}/></div>
                <span className="trend-label stable">Stable</span>
              </div>
              <div className="kpi-body">
                <p>Consideration Stage</p>
                <h3>{stats?.consideration || "4,200"}</h3>
              </div>
            </div>

            <div className="premium-card kpi-card glass-morph">
              <div className="kpi-header">
                <div className="kpi-icon-box green"><ShoppingCart size={20}/></div>
                <span className="trend-label positive">+5.2% <ArrowUpRight size={14}/></span>
              </div>
              <div className="kpi-body">
                <p>Conversions</p>
                <h3>{stats?.purchase || "850"}</h3>
              </div>
            </div>

            <div className="premium-card kpi-card glass-morph warning" style={{ borderColor: 'rgba(239, 68, 68, 0.4)' }}>
              <div className="kpi-header">
                <div className="kpi-icon-box" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}><AlertTriangle size={20}/></div>
                <span className="trend-label" style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}>Requires Action</span>
              </div>
              <div className="kpi-body">
                <p>Churn Risk</p>
                <h3>{stats?.churnRisk || "12"}%</h3>
              </div>
            </div>

          </section>

          {/* Charts + Node Injector */}
          <div className="dashboard-grid-layout">
            <div className="visual-panel">
              
              {/* Funnel Chart Area */}
              <div className="premium-card chart-container shadow-glow">
                <div className="card-title-bar">
                  <div className="title-text">
                    <Sparkles size={16} className="sparkle-anim"/> 
                    <span>Customer Drop-off Funnel</span>
                  </div>
                  <div className="title-actions"><Filter size={14}/> <Download size={14}/></div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={funnelData}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.6}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="stage" stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip contentStyle={{backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: 'white'}} />
                    <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={3} fill="url(#colorCount)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Manual Entry Form */}
              <div className="premium-card form-container">
                <div className="card-title-bar"><PlusCircle size={18} color="#6366f1"/> <h3>Manual Lead Injector</h3></div>
                <form className="modern-form" onSubmit={handleAddNode}>
                  <div className="input-group">
                    <input type="text" placeholder="Customer Name" value={customerForm.name} onChange={e => setCustomerForm({...customerForm, name: e.target.value})} required />
                    <input type="email" placeholder="Email Address" value={customerForm.email} onChange={e => setCustomerForm({...customerForm, email: e.target.value})} required />
                  </div>
                  <div className="input-group">
                    <input type="number" placeholder="Visits" value={customerForm.visits} onChange={e => setCustomerForm({...customerForm, visits: e.target.value})} />
                    <input type="number" placeholder="Purchases" value={customerForm.purchases} onChange={e => setCustomerForm({...customerForm, purchases: e.target.value})} />
                    <button type="submit" className={`primary-btn-premium ${isInjecting ? 'loading' : ''}`} disabled={isInjecting}>
                      {isInjecting ? 'Injecting...' : 'Inject Lead'} <ArrowRight size={16}/>
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
            <div><h2>Neural Lead Intelligence</h2><p>Real-time customer journey status</p></div>
            <div className="search-box-premium">
              <Search size={16} color="#94a3b8"/>
              <input type="text" placeholder="Search customer..." value={searchTerm} onChange={(e)=>setSearchTerm(e.target.value)} />
            </div>
          </div>
          <div className="table-wrapper">
             <table className="pro-table">
               <thead><tr><th>Customer Identity</th><th>Engagement</th><th>Sync Score</th><th>Journey Stage</th><th>Action</th></tr></thead>
               <tbody>
                 {customers.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())).map(c => (
                   <tr key={c._id} className="row-hover">
                     <td><div className="node-cell"><div className="avatar-grad">{c.name.charAt(0)}</div><div><strong>{c.name}</strong><span>{c.email}</span></div></div></td>
                     <td><div className={`status-pill-v2 ${c.engagementScore > 50 ? 'active' : 'idle'}`}>{c.engagementScore > 50 ? 'High Intent' : 'Browsing'}</div></td>
                     <td><div className="sync-score-wrapper"><span>{c.engagementScore}%</span><div className="sync-bar-bg"><div className="sync-bar-fill" style={{width: `${c.engagementScore}%`}}></div></div></div></td>
                     <td><span className={`badge-pill-v2 ${c.stage?.toLowerCase()}`}>{c.stage}</span></td>
                     <td><button className="icon-btn-v3"><MoreHorizontal size={18} /></button></td>
                   </tr>
                 ))}
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
             <div className="hero-visual-v3">
                <Rocket size={60} color="#6366f1" className="rocket-float-pro"/>
                <div className="glow-orbit"></div>
             </div>
             <h2>AI Retargeting Orchestrator</h2>
             <p>Autonomous neural deployments active across Instagram & Google Ads.</p>
             <button className="primary-btn-premium lg-btn"><Zap size={18}/> Launch Campaign</button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="app-shell-premium">
      <aside className="sidebar-premium">
        <div className="brand-premium"><div className="logo-icon"><Zap size={20} fill="#fff"/></div> <span>JOURNEY AI</span></div>
        <nav className="nav-list-premium">
          <button className={activeTab === "overview" ? "active" : ""} onClick={() => setActiveTab("overview")}><LayoutDashboard size={18}/> Overview</button>
          <button className={activeTab === "audience" ? "active" : ""} onClick={() => setActiveTab("audience")}><Users size={18}/> Lead Matrix</button>
          <button className={activeTab === "campaigns" ? "active" : ""} onClick={() => setActiveTab("campaigns")}><Globe size={18}/> Deployments</button>
          <div className="nav-label">System Architecture</div>
          <button className="disabled"><ShieldCheck size={18}/> Security</button>
          <button className="disabled"><Cpu size={18}/> Config</button>
        </nav>
        <div className="sidebar-footer">
            <div className="user-pill-pro"><div className="u-avatar">K</div><div><strong>Admin Kishan</strong><small>Operations</small></div></div>
        </div>
      </aside>

      <main className="main-content-premium">
        <header className="header-premium glass-morph">
          <div className="header-left">
            <div className="live-status-label"><div className="pulse-dot-pro"></div> NOMINAL</div>
            <h1>{activeTab.toUpperCase()} <span className="h-sub">/ Analytics</span></h1>
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