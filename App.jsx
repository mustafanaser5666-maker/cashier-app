import { useState, useEffect, useRef } from "react";

// ─── INITIAL DATA ───────────────────────────────────────────────────────────
const DEFAULT_EMPLOYEES = [
  { id: 1, name: "أحمد محمد", username: "ahmed", password: "1234", role: "admin", emoji: "👨‍💼" },
  { id: 2, name: "سارة علي", username: "sara", password: "1234", role: "cashier", emoji: "👩‍💼" },
  { id: 3, name: "خالد عمر", username: "khaled", password: "1234", role: "cashier", emoji: "👨‍💻" },
];

const DEFAULT_PRODUCTS = [
  { id: 1, name: "خبز توست", price: 3.5, category: "مخبوزات", emoji: "🍞", barcode: "6001", stock: 50, minStock: 10 },
  { id: 2, name: "حليب كامل الدسم", price: 8.75, category: "ألبان", emoji: "🥛", barcode: "6002", stock: 30, minStock: 5 },
  { id: 3, name: "بيض طازج (30 بيضة)", price: 22.0, category: "ألبان", emoji: "🥚", barcode: "6003", stock: 20, minStock: 5 },
  { id: 4, name: "دجاج مجمد", price: 35.0, category: "لحوم", emoji: "🍗", barcode: "6004", stock: 15, minStock: 5 },
  { id: 5, name: "أرز بسمتي 2كغ", price: 18.5, category: "حبوب", emoji: "🌾", barcode: "6005", stock: 40, minStock: 10 },
  { id: 6, name: "معكرونة سباغيتي", price: 5.25, category: "حبوب", emoji: "🍝", barcode: "6006", stock: 35, minStock: 8 },
  { id: 7, name: "طماطم طازجة", price: 6.0, category: "خضروات", emoji: "🍅", barcode: "6007", stock: 8, minStock: 10 },
  { id: 8, name: "بطاطس كيلو", price: 4.5, category: "خضروات", emoji: "🥔", barcode: "6008", stock: 25, minStock: 8 },
  { id: 9, name: "تفاح أحمر", price: 12.0, category: "فواكه", emoji: "🍎", barcode: "6009", stock: 3, minStock: 10 },
  { id: 10, name: "موز", price: 7.0, category: "فواكه", emoji: "🍌", barcode: "6010", stock: 18, minStock: 5 },
  { id: 11, name: "عصير برتقال 1ل", price: 9.5, category: "مشروبات", emoji: "🍊", barcode: "6011", stock: 22, minStock: 8 },
  { id: 12, name: "مياه معدنية 1.5ل", price: 2.5, category: "مشروبات", emoji: "💧", barcode: "6012", stock: 60, minStock: 20 },
  { id: 13, name: "شاي أحمر 100كيس", price: 14.0, category: "مشروبات", emoji: "🍵", barcode: "6013", stock: 12, minStock: 5 },
  { id: 14, name: "قهوة نسكافيه 200غ", price: 28.0, category: "مشروبات", emoji: "☕", barcode: "6014", stock: 10, minStock: 3 },
  { id: 15, name: "زيت زيتون 750مل", price: 32.0, category: "زيوت", emoji: "🫒", barcode: "6015", stock: 9, minStock: 5 },
  { id: 16, name: "سكر أبيض 1كغ", price: 6.5, category: "بهارات", emoji: "🍬", barcode: "6016", stock: 30, minStock: 10 },
  { id: 17, name: "ملح 1كغ", price: 3.0, category: "بهارات", emoji: "🧂", barcode: "6017", stock: 28, minStock: 8 },
  { id: 18, name: "صابون غسيل", price: 11.0, category: "منظفات", emoji: "🧴", barcode: "6018", stock: 4, minStock: 5 },
  { id: 19, name: "شامبو 400مل", price: 19.5, category: "عناية", emoji: "🛁", barcode: "6019", stock: 7, minStock: 5 },
  { id: 20, name: "شوكولاتة كيت كات", price: 8.0, category: "حلويات", emoji: "🍫", barcode: "6020", stock: 45, minStock: 10 },
];

const EMOJIS = ["🍞","🥛","🥚","🍗","🌾","🍝","🍅","🥔","🍎","🍌","🍊","💧","🍵","☕","🫒","🍬","🧂","🧴","🛁","🍫","🧀","🥩","🍕","🥗","🧃","🥤","🫙","🧈","🥜","🍯","🫘","🌽","🥦","🧅","🧄","🍋","🍇","🍓","🫐","🥝"];

// ─── PERSISTENT STORAGE (localStorage) ──────────────────────────────────────
const getStorageItem = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error("Storage error", e);
  }
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Cairo',sans-serif}
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-track{background:#1e293b}
::-webkit-scrollbar-thumb{background:#38bdf8;border-radius:3px}
.prod-card{background:#1e293b;border:1px solid #334155;border-radius:12px;padding:12px 8px;cursor:pointer;transition:all .15s;text-align:center;position:relative}
.prod-card:hover{border-color:#38bdf8;background:#1e3a5f;transform:translateY(-2px);box-shadow:0 6px 20px rgba(56,189,248,.2)}
.prod-card.low-stock{border-color:#f59e0b44}
.low-badge{position:absolute;top:6px;right:6px;background:#f59e0b;color:#0f172a;font-size:9px;font-weight:900;border-radius:6px;padding:1px 5px}
.out-badge{position:absolute;top:6px;right:6px;background:#ef4444;color:white;font-size:9px;font-weight:900;border-radius:6px;padding:1px 5px}
.cat-btn{background:#1e293b;border:1px solid #334155;border-radius:20px;padding:5px 14px;cursor:pointer;color:#94a3b8;font-size:12px;font-family:'Cairo',sans-serif;transition:all .15s;white-space:nowrap}
.cat-btn.active{background:#38bdf8;border-color:#38bdf8;color:#0f172a;font-weight:700}
.cat-btn:hover:not(.active){border-color:#38bdf8;color:#38bdf8}
.btn{border:none;border-radius:8px;font-family:'Cairo',sans-serif;cursor:pointer;font-weight:700;transition:all .15s}
.btn:hover{transform:translateY(-1px)}
.btn-blue{background:linear-gradient(135deg,#38bdf8,#0ea5e9);color:#0f172a}
.btn-blue:hover{box-shadow:0 6px 20px rgba(56,189,248,.4)}
.btn-green{background:linear-gradient(135deg,#22c55e,#16a34a);color:white}
.btn-red{background:#ef4444;color:white}
.btn-yellow{background:#f59e0b;color:#0f172a}
.btn-purple{background:linear-gradient(135deg,#a78bfa,#7c3aed);color:white}
.btn-gray{background:#334155;color:#e2e8f0}
.tab{background:transparent;border:none;padding:10px 16px;color:#64748b;font-family:'Cairo',sans-serif;font-size:13px;font-weight:700;cursor:pointer;border-bottom:3px solid transparent;transition:all .15s;white-space:nowrap}
.tab.active{color:#38bdf8;border-bottom-color:#38bdf8}
.tab:hover:not(.active){color:#94a3b8}
input,select,textarea{font-family:'Cairo',sans-serif}
.fi{width:100%;background:#0f172a;border:1px solid #334155;border-radius:8px;padding:8px 12px;color:#e2e8f0;font-size:14px;outline:none;transition:border-color .15s}
.fi:focus{border-color:#38bdf8}
.fl{font-size:12px;color:#94a3b8;margin-bottom:4px;display:block}
.notif{position:fixed;top:18px;left:50%;transform:translateX(-50%);background:#1e293b;border:1px solid #38bdf8;border-radius:10px;padding:9px 22px;font-size:13px;font-weight:600;z-index:9999;box-shadow:0 8px 30px rgba(0,0,0,.6);animation:sdn .25s ease}
@keyframes sdn{from{opacity:0;top:0}to{opacity:1;top:18px}}
.overlay{position:fixed;inset:0;background:rgba(0,0,0,.85);display:flex;align-items:center;justify-content:center;z-index:1000}
.modal{background:#1e293b;border:1px solid #334155;border-radius:16px;padding:24px;width:480px;max-height:92vh;overflow-y:auto}
.modal-sm{background:#1e293b;border:1px solid #334155;border-radius:16px;padding:24px;width:360px}
.receipt-paper{background:white;color:#111;border-radius:12px;padding:28px;width:360px;max-height:92vh;overflow-y:auto;font-family:'Cairo',monospace}
.dash{border:none;border-top:1px dashed #ccc;margin:10px 0}
.card{background:#1e293b;border:1px solid #334155;border-radius:12px;padding:18px}
.tbl{width:100%;border-collapse:collapse}
.tbl th{background:#0f172a;padding:9px 12px;text-align:right;font-size:12px;color:#64748b;font-weight:600;border-bottom:1px solid #334155}
.tbl td{padding:9px 12px;font-size:12px;border-bottom:1px solid #1e293b;vertical-align:middle}
.tbl tr:hover td{background:#0f172a55}
.badge{display:inline-block;padding:2px 10px;border-radius:10px;font-size:11px;font-weight:700}
.badge-blue{background:#0ea5e922;color:#38bdf8}
.badge-green{background:#16a34a22;color:#4ade80}
.badge-red{background:#ef444422;color:#f87171}
.badge-yellow{background:#f59e0b22;color:#fbbf24}
.qty-btn{background:#334155;border:none;border-radius:6px;color:#e2e8f0;width:26px;height:26px;cursor:pointer;font-size:15px;font-weight:700}
.qty-btn:hover{background:#38bdf8;color:#0f172a}
.emoji-grid{display:grid;grid-template-columns:repeat(8,1fr);gap:5px;max-height:130px;overflow-y:auto;margin-top:6px}
.eo{background:#0f172a;border:2px solid transparent;border-radius:7px;padding:5px;font-size:18px;cursor:pointer;text-align:center;transition:all .1s}
.eo.sel{border-color:#38bdf8;background:#1e3a5f}
.eo:hover{border-color:#475569}
.stat-card{background:#1e293b;border:1px solid #334155;border-radius:14px;padding:20px;text-align:center}
.login-wrap{min-height:100vh;background:#0f172a;display:flex;align-items:center;justify-content:center}
.login-box{background:#1e293b;border:1px solid #334155;border-radius:20px;padding:40px;width:380px}
`;

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmt = (n) => Number(n).toFixed(2);
const today = () => new Date().toISOString().slice(0, 10);

// ─── PRINT RECEIPT ────────────────────────────────────────────────────────────
function printReceipt(r) {
  const win = window.open("", "_blank", "width=400,height=600");
  win.document.write(`
    <html dir="rtl"><head><meta charset="utf-8">
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
      body{font-family:'Cairo',sans-serif;padding:20px;font-size:13px;color:#111;max-width:320px;margin:auto}
      h2{text-align:center;font-size:18px;margin:0}
      .sub{text-align:center;color:#666;font-size:11px;margin-bottom:4px}
      hr{border:none;border-top:1px dashed #ccc;margin:10px 0}
      .row{display:flex;justify-content:space-between;margin-bottom:5px}
      .total{font-size:17px;font-weight:900;border-top:2px solid #111;padding-top:8px}
      .change{font-size:15px;font-weight:700;color:green}
      .footer{text-align:center;font-size:11px;color:#888;margin-top:12px}
    </style></head><body>
    <h2>🏪 سوبرماركت النور</h2>
    <div class="sub">الرياض – المملكة العربية السعودية</div>
    <div class="sub">رقم الفاتورة: ${r.receiptNo} | ${r.date}</div>
    <div class="sub">الكاشير: ${r.cashier}</div>
    <hr>
    ${r.items.map(i => `<div class="row"><span>${i.emoji} ${i.name} × ${i.qty}</span><span>${fmt(i.price * i.qty)} ر.س</span></div>`).join("")}
    <hr>
    <div class="row"><span>المجموع الفرعي</span><span>${fmt(r.subtotal)} ر.س</span></div>
    ${r.discount > 0 ? `<div class="row" style="color:red"><span>خصم ${r.discount}%</span><span>− ${fmt(r.discountAmt)} ر.س</span></div>` : ""}
    <div class="row total"><span>الإجمالي</span><span>${fmt(r.total)} ر.س</span></div>
    <div class="row"><span>المدفوع</span><span>${fmt(r.paid)} ر.س</span></div>
    <div class="row change"><span>الباقي</span><span>${fmt(r.change)} ر.س</span></div>
    <div class="footer">شكراً لزيارتكم! أهلاً بكم دائماً 🌟</div>
    <script>window.onload=()=>{window.print();window.close()}<\/script>
    </body></html>`);
  win.document.close();
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  if (!currentUser) return <LoginScreen onLogin={setCurrentUser} />;
  return <CashierApp user={currentUser} onLogout={() => setCurrentUser(null)} />;
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");

  const login = () => {
    const emps = getStorageItem("pos_employees", DEFAULT_EMPLOYEES);
    const emp = emps.find(e => e.username === username.trim() && e.password === password);
    if (emp) {
      onLogin({ ...emp, loginTime: new Date() });
    } else setErr("اسم المستخدم أو كلمة المرور غير صحيحة");
  };

  return (
    <div className="login-wrap">
      <style>{CSS}</style>
      <div className="login-box">
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 52 }}>🏪</div>
          <div style={{ fontWeight: 900, fontSize: 22, color: "#38bdf8", marginTop: 8 }}>سوبرماركت النور</div>
          <div style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>نظام نقطة البيع</div>
        </div>
        <div style={{ marginBottom: 14 }}>
          <label className="fl">اسم المستخدم</label>
          <input className="fi" value={username} onChange={e => setUsername(e.target.value)} placeholder="أدخل اسم المستخدم" onKeyDown={e => e.key === "Enter" && login()} />
        </div>
        <div style={{ marginBottom: 18 }}>
          <label className="fl">كلمة المرور</label>
          <input className="fi" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && login()} />
        </div>
        {err && <div style={{ color: "#f87171", fontSize: 13, marginBottom: 12, textAlign: "center" }}>{err}</div>}
        <button className="btn btn-blue" onClick={login} style={{ width: "100%", padding: "12px", fontSize: 16 }}>🔐 تسجيل الدخول</button>
        <div style={{ marginTop: 20, padding: 14, background: "#0f172a", borderRadius: 10, fontSize: 12, color: "#64748b" }}>
          <div style={{ fontWeight: 700, marginBottom: 6, color: "#94a3b8" }}>حسابات تجريبية:</div>
          <div>👨‍💼 مدير: ahmed / 1234</div>
          <div>👩‍💼 كاشير: sara / 1234</div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN CASHIER APP ─────────────────────────────────────────────────────────
function CashierApp({ user, onLogout }) {
  const [products, setProducts] = useState(() => getStorageItem("pos_products", DEFAULT_PRODUCTS));
  const [employees, setEmployees] = useState(() => getStorageItem("pos_employees", DEFAULT_EMPLOYEES));
  const [sales, setSales] = useState(() => getStorageItem("pos_sales", []));
  const [tab, setTab] = useState("cashier");
  const [notif, setNotif] = useState(null);

  const isAdmin = user.role === "admin";

  useEffect(() => { setStorageItem("pos_products", products); }, [products]);
  useEffect(() => { setStorageItem("pos_employees", employees); }, [employees]);
  useEffect(() => { setStorageItem("pos_sales", sales); }, [sales]);

  const showNotif = (msg) => { setNotif(msg); setTimeout(() => setNotif(null), 2200); };

  const addSale = (receipt) => {
    setSales(prev => [receipt, ...prev]);
    setProducts(prev => prev.map(p => {
      const item = receipt.items.find(i => i.id === p.id);
      return item ? { ...p, stock: Math.max(0, p.stock - item.qty) } : p;
    }));
  };

  const lowStockCount = products.filter(p => p.stock <= p.minStock).length;
  const todaySales = sales.filter(s => s.dateKey === today());
  const todayRevenue = todaySales.reduce((s, r) => s + r.total, 0);

  const tabs = [
    { id: "cashier", label: "🧾 الكاشير" },
    ...(isAdmin ? [
      { id: "inventory", label: `📦 المخزون${lowStockCount > 0 ? ` (${lowStockCount}⚠️)` : ""}` },
      { id: "products", label: "🏷️ المنتجات" },
      { id: "reports", label: "📊 التقارير" },
      { id: "employees", label: "👥 الموظفون" },
    ] : []),
  ];

  return (
    <div style={{ direction: "rtl", fontFamily: "'Cairo',sans-serif", background: "#0f172a", minHeight: "100vh", color: "#e2e8f0", display: "flex", flexDirection: "column" }}>
      <style>{CSS}</style>
      {notif && <div className="notif">{notif}</div>}

      {/* Header */}
      <div style={{ background: "#1e293b", borderBottom: "1px solid #334155", display: "flex", alignItems: "center", padding: "0 16px", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 0", minWidth: 160 }}>
          <span style={{ fontSize: 22 }}>🛒</span>
          <div>
            <div style={{ fontWeight: 900, fontSize: 15, color: "#38bdf8" }}>كاشير النور</div>
            <div style={{ fontSize: 10, color: "#64748b" }}>مبيعات اليوم: {fmt(todayRevenue)} ر.س</div>
          </div>
        </div>
        <div style={{ flex: 1, display: "flex", overflowX: "auto", borderRight: "1px solid #334155", borderLeft: "1px solid #334155" }}>
          {tabs.map(t => <button key={t.id} className={`tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>{t.label}</button>)}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 160, justifyContent: "flex-end" }}>
          <span style={{ fontSize: 18 }}>{user.emoji}</span>
          <div style={{ fontSize: 12 }}>
            <div style={{ fontWeight: 700 }}>{user.name}</div>
            <div style={{ color: "#64748b" }}>{user.role === "admin" ? "مدير" : "كاشير"}</div>
          </div>
          <button className="btn btn-red" onClick={onLogout} style={{ padding: "5px 10px", fontSize: 12 }}>خروج</button>
        </div>
      </div>

      {/* Content */}
      {tab === "cashier" && <CashierTab products={products} user={user} onSale={addSale} showNotif={showNotif} />}
      {tab === "inventory" && <InventoryTab products={products} setProducts={setProducts} showNotif={showNotif} />}
      {tab === "products" && <ProductsTab products={products} setProducts={setProducts} showNotif={showNotif} />}
      {tab === "reports" && <ReportsTab sales={sales} employees={employees} />}
      {tab === "employees" && <EmployeesTab employees={employees} setEmployees={setEmployees} showNotif={showNotif} />}
    </div>
  );
}

// ─── CASHIER TAB ──────────────────────────────────────────────────────────────
function CashierTab({ products, user, onSale, showNotif }) {
  const [cart, setCart] = useState([]);
  const [selCat, setSelCat] = useState("الكل");
  const [search, setSearch] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paid, setPaid] = useState("");
  const [bcode, setBcode] = useState("");
  const [receipt, setReceipt] = useState(null);
  const bcRef = useRef(null);

  useEffect(() => { setTimeout(() => bcRef.current?.focus(), 100); }, []);

  const cats = ["الكل", ...new Set(products.map(p => p.category))];
  const filtered = products.filter(p => {
    const mc = selCat === "الكل" || p.category === selCat;
    const ms = p.name.includes(search) || p.barcode.includes(search);
    return mc && ms;
  });

  const addToCart = (p) => {
    if (p.stock === 0) { showNotif("❌ هذا المنتج غير متوفر في المخزون"); return; }
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      if (ex) {
        if (ex.qty >= p.stock) { showNotif(`⚠️ الكمية المتاحة: ${p.stock} فقط`); return prev; }
        return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...p, qty: 1 }];
    });
    showNotif(`✓ ${p.name}`);
  };

  const handleBarcode = (e) => {
    e.preventDefault();
    const v = bcode.trim();
    const p = products.find(p => p.barcode === v);
    if (p) addToCart(p); else showNotif("❌ الباركود غير مسجل");
    setBcode(""); bcRef.current?.focus();
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discountAmt = subtotal * discount / 100;
  const total = subtotal - discountAmt;
  const paidNum = parseFloat(paid) || 0;
  const change = paidNum - total;

  const checkout = () => {
    if (!cart.length) return;
    if (paidNum < total) { showNotif("❌ المبلغ المدفوع غير كافٍ"); return; }
    const r = {
      id: Date.now(),
      receiptNo: Math.floor(Math.random() * 90000 + 10000),
      cashier: user.name, cashierId: user.id,
      items: [...cart], subtotal, discount, discountAmt, total,
      paid: paidNum, change,
      date: new Date().toLocaleString("ar-SA"),
      dateKey: today(),
    };
    onSale(r);
    setReceipt(r);
  };

  const newSale = () => {
    setCart([]); setDiscount(0); setPaid(""); setReceipt(null);
    setTimeout(() => bcRef.current?.focus(), 100);
  };

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
      {/* Products */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", borderLeft: "1px solid #334155" }}>
        <div style={{ padding: "10px 14px", background: "#1e293b", borderBottom: "1px solid #334155", display: "flex", gap: 8 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 بحث..." style={{ flex: 1, background: "#0f172a", border: "1px solid #334155", borderRadius: 8, padding: "7px 12px", color: "#e2e8f0", fontSize: 13, outline: "none" }} />
          <form onSubmit={handleBarcode} style={{ display: "flex", gap: 6 }}>
            <input ref={bcRef} value={bcode} onChange={e => setBcode(e.target.value)} placeholder="📦 امسح الباركود..." style={{ width: 190, background: "#0f172a", border: "2px solid #38bdf8", borderRadius: 8, padding: "7px 11px", color: "#38bdf8", fontSize: 13, outline: "none", fontWeight: 700 }} autoFocus />
            <button type="submit" className="btn btn-blue" style={{ padding: "7px 12px", fontSize: 12 }}>إضافة</button>
          </form>
        </div>
        <div style={{ padding: "8px 14px", background: "#0f172a", borderBottom: "1px solid #1e293b", display: "flex", gap: 6, overflowX: "auto" }}>
          {cats.map(c => <button key={c} className={`cat-btn ${selCat === c ? "active" : ""}`} onClick={() => setSelCat(c)}>{c}</button>)}
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(120px,1fr))", gap: 10, alignContent: "start" }}>
          {filtered.map(p => (
            <div key={p.id} className={`prod-card ${p.stock <= p.minStock && p.stock > 0 ? "low-stock" : ""}`} onClick={() => addToCart(p)} style={{ opacity: p.stock === 0 ? 0.4 : 1 }}>
              {p.stock === 0 && <span className="out-badge">نفد</span>}
              {p.stock > 0 && p.stock <= p.minStock && <span className="low-badge">قليل</span>}
              <div style={{ fontSize: 30, marginBottom: 5 }}>{p.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: 11, color: "#e2e8f0", lineHeight: 1.3, marginBottom: 3 }}>{p.name}</div>
              <div style={{ color: "#38bdf8", fontWeight: 900, fontSize: 14 }}>{fmt(p.price)} ر.س</div>
              <div style={{ fontSize: 10, color: "#475569", marginTop: 2 }}>مخزون: {p.stock}</div>
            </div>
          ))}
          {!filtered.length && <div style={{ gridColumn: "1/-1", textAlign: "center", color: "#475569", padding: 40 }}>لا توجد منتجات</div>}
        </div>
      </div>

      {/* Cart */}
      <div style={{ width: 360, background: "#1e293b", display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid #334155", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontWeight: 900, fontSize: 14 }}>🧾 الفاتورة — {cart.length} صنف</span>
          {cart.length > 0 && <button className="btn btn-red" onClick={() => setCart([])} style={{ padding: "3px 10px", fontSize: 11 }}>مسح</button>}
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 10 }}>
          {!cart.length ? (
            <div style={{ textAlign: "center", color: "#334155", marginTop: 50 }}>
              <div style={{ fontSize: 44 }}>🛒</div>
              <div style={{ marginTop: 8, fontSize: 13 }}>امسح الباركود أو اختر منتجاً</div>
            </div>
          ) : cart.map(item => (
            <div key={item.id} style={{ background: "#0f172a", border: "1px solid #334155", borderRadius: 9, padding: 9, marginBottom: 6, display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ fontSize: 20 }}>{item.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
                <div style={{ color: "#38bdf8", fontSize: 12, fontWeight: 700 }}>{fmt(item.price * item.qty)} ر.س</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <button className="qty-btn" onClick={() => setCart(prev => prev.map(i => i.id === item.id ? { ...i, qty: Math.max(1, i.qty - 1) } : i))}>−</button>
                <span style={{ fontWeight: 700, minWidth: 18, textAlign: "center", fontSize: 13 }}>{item.qty}</span>
                <button className="qty-btn" onClick={() => {
                  if (item.qty >= item.stock) { showNotif(`⚠️ الحد: ${item.stock}`); return; }
                  setCart(prev => prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i));
                }}>+</button>
                <button className="btn btn-red" onClick={() => setCart(prev => prev.filter(i => i.id !== item.id))} style={{ padding: "2px 6px", fontSize: 11 }}>✕</button>
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: 12, borderTop: "1px solid #334155", background: "#0f172a" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#94a3b8", marginBottom: 6 }}>
            <span>المجموع:</span><span>{fmt(subtotal)} ر.س</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
            <label style={{ fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap" }}>خصم %:</label>
            <input type="number" min="0" max="100" value={discount} onChange={e => setDiscount(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))} style={{ width: 60, background: "#1e293b", border: "1px solid #334155", borderRadius: 7, padding: "5px 8px", color: "#e2e8f0", fontSize: 13, outline: "none", textAlign: "center" }} />
            {discount > 0 && <span style={{ color: "#f87171", fontSize: 12 }}>−{fmt(discountAmt)}</span>}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 900, color: "#38bdf8", marginBottom: 10, padding: "9px 11px", background: "#1e293b", borderRadius: 9 }}>
            <span>الإجمالي:</span><span>{fmt(total)} ر.س</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <label style={{ fontSize: 12, color: "#94a3b8", whiteSpace: "nowrap" }}>المدفوع:</label>
            <input type="number" value={paid} placeholder="0.00" onChange={e => setPaid(e.target.value)} style={{ flex: 1, background: "#1e293b", border: "1px solid #334155", borderRadius: 8, padding: "7px 10px", color: "#fbbf24", fontSize: 15, fontWeight: 700, outline: "none", textAlign: "center" }} />
          </div>
          {paid && paidNum >= total && (
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700, color: "#4ade80", marginBottom: 8, padding: "6px 10px", background: "#052e16", borderRadius: 7 }}>
              <span>الباقي:</span><span>{fmt(change)} ر.س</span>
            </div>
          )}
          <button className="btn btn-blue" onClick={checkout} style={{ width: "100%", padding: "12px", fontSize: 15, borderRadius: 10 }}>💳 إتمام البيع</button>
        </div>
      </div>

      {/* Receipt */}
      {receipt && (
        <div className="overlay">
          <div className="receipt-paper">
            <div style={{ textAlign: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 28 }}>🏪</div>
              <div style={{ fontWeight: 900, fontSize: 18 }}>سوبرماركت النور</div>
              <div style={{ fontSize: 11, color: "#666" }}>الرياض – المملكة العربية السعودية</div>
              <div style={{ fontSize: 11, color: "#888", marginTop: 3 }}>فاتورة: #{receipt.receiptNo} | الكاشير: {receipt.cashier}</div>
              <div style={{ fontSize: 11, color: "#888" }}>{receipt.date}</div>
            </div>
            <hr className="dash" />
            {receipt.items.map(i => (
              <div key={i.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                <span>{i.emoji} {i.name} × {i.qty}</span>
                <span style={{ fontWeight: 600 }}>{fmt(i.price * i.qty)}</span>
              </div>
            ))}
            <hr className="dash" />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
              <span>المجموع الفرعي</span><span>{fmt(receipt.subtotal)} ر.س</span>
            </div>
            {receipt.discount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "red", marginBottom: 3 }}>
                <span>خصم ${receipt.discount}%</span><span>−{fmt(receipt.discountAmt)} ر.س</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 900, borderTop: "2px solid #111", paddingTop: 7, marginBottom: 5 }}>
              <span>الإجمالي</span><span>{fmt(receipt.total)} ر.س</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}>
              <span>المدفوع</span><span>{fmt(receipt.paid)} ر.س</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 700, color: "green" }}>
              <span>الباقي</span><span>{fmt(receipt.change)} ر.س</span>
            </div>
            <hr className="dash" />
            <div style={{ textAlign: "center", fontSize: 11, color: "#888", marginBottom: 14 }}>شكراً لزيارتكم 🌟</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-blue" onClick={() => printReceipt(receipt)} style={{ flex: 1, padding: "10px", fontSize: 14 }}>🖨️ طباعة</button>
              <button className="btn btn-green" onClick={newSale} style={{ flex: 1, padding: "10px", fontSize: 14 }}>🔄 جديد</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── INVENTORY TAB ────────────────────────────────────────────────────────────
function InventoryTab({ products, setProducts, showNotif }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // all | low | out
  const [adjustId, setAdjustId] = useState(null);
  const [adjValue, setAdjValue] = useState("");

  const filtered = products.filter(p => {
    const ms = p.name.includes(search) || p.barcode.includes(search);
    if (filter === "low") return ms && p.stock > 0 && p.stock <= p.minStock;
    if (filter === "out") return ms && p.stock === 0;
    return ms;
  });

  const adjust = (id) => {
    const v = parseInt(adjValue);
    if (isNaN(v) || v < 0) { showNotif("❌ أدخل كمية صحيحة"); return; }
    setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: v } : p));
    showNotif("✅ تم تحديث المخزون");
    setAdjustId(null); setAdjValue("");
  };

  const low = products.filter(p => p.stock > 0 && p.stock <= p.minStock).length;
  const out = products.filter(p => p.stock === 0).length;

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        <div className="stat-card">
          <div style={{ fontSize: 28 }}>📦</div>
          <div style={{ fontWeight: 900, fontSize: 22, color: "#38bdf8", marginTop: 4 }}>{products.length}</div>
          <div style={{ color: "#64748b", fontSize: 12 }}>إجمالي الأصناف</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: 28 }}>✅</div>
          <div style={{ fontWeight: 900, fontSize: 22, color: "#4ade80", marginTop: 4 }}>{products.filter(p => p.stock > p.minStock).length}</div>
          <div style={{ color: "#64748b", fontSize: 12 }}>متوفر بكمية جيدة</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: 28 }}>⚠️</div>
          <div style={{ fontWeight: 900, fontSize: 22, color: "#fbbf24", marginTop: 4 }}>{low}</div>
          <div style={{ color: "#64748b", fontSize: 12 }}>مخزون منخفض</div>
        </div>
        <div className="stat-card">
          <div style={{ fontSize: 28 }}>🚫</div>
          <div style={{ fontWeight: 900, fontSize: 22, color: "#f87171", marginTop: 4 }}>{out}</div>
          <div style={{ color: "#64748b", fontSize: 12 }}>نفد من المخزون</div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 بحث..." style={{ flex: 1, background: "#1e293b", border: "1px solid #334155", borderRadius: 8, padding: "8px 12px", color: "#e2e8f0", fontSize: 13, outline: "none" }} />
        {["all", "low", "out"].map(f => (
          <button key={f} className={`cat-btn ${filter === f ? "active" : ""}`} onClick={() => setFilter(f)}>
            {f === "all" ? "الكل" : f === "low" ? "⚠️ منخفض" : "🚫 نفد"}
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="tbl">
          <thead>
            <tr>
              <th>المنتج</th><th>الباركود</th><th>المخزون الحالي</th><th>الحد الأدنى</th><th>الحالة</th><th>تعديل الكمية</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td><div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 18 }}>{p.emoji}</span><span style={{ fontWeight: 600 }}>{p.name}</span></div></td>
                <td><span style={{ fontFamily: "monospace", color: "#38bdf8" }}>{p.barcode}</span></td>
                <td><span style={{ fontWeight: 700, fontSize: 15, color: p.stock === 0 ? "#f87171" : p.stock <= p.minStock ? "#fbbf24" : "#4ade80" }}>{p.stock}</span></td>
                <td style={{ color: "#64748b" }}>{p.minStock}</td>
                <td>
                  {p.stock === 0 ? <span className="badge badge-red">نفد</span>
                    : p.stock <= p.minStock ? <span className="badge badge-yellow">منخفض</span>
                    : <span className="badge badge-green">متوفر</span>}
                </td>
                <td>
                  {adjustId === p.id ? (
                    <div style={{ display: "flex", gap: 5 }}>
                      <input type="number" value={adjValue} onChange={e => setAdjValue(e.target.value)} placeholder="الكمية" style={{ width: 80, background: "#0f172a", border: "1px solid #38bdf8", borderRadius: 6, padding: "4px 8px", color: "#e2e8f0", fontSize: 12, outline: "none" }} autoFocus />
                      <button className="btn btn-green" onClick={() => adjust(p.id)} style={{ padding: "4px 10px", fontSize: 11 }}>✓</button>
                      <button className="btn btn-gray" onClick={() => setAdjustId(null)} style={{ padding: "4px 8px", fontSize: 11 }}>✕</button>
                    </div>
                  ) : (
                    <button className="btn btn-yellow" onClick={() => { setAdjustId(p.id); setAdjValue(String(p.stock)); }} style={{ padding: "4px 12px", fontSize: 11 }}>تعديل</button>
                  )}
                </td>
              </tr>
            ))}
            {!filtered.length && <tr><td colSpan={6} style={{ textAlign: "center", color: "#475569", padding: 30 }}>لا توجد نتائج</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── PRODUCTS TAB ─────────────────────────────────────────────────────────────
function ProductsTab({ products, setProducts, showNotif }) {
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", category: "", barcode: "", emoji: "🛒", stock: "", minStock: "5" });

  const filtered = products.filter(p => p.name.includes(search) || p.barcode.includes(search) || p.category.includes(search));

  const openAdd = () => { setEditing(null); setForm({ name: "", price: "", category: "", barcode: "", emoji: "🛒", stock: "0", minStock: "5" }); setShowModal(true); };
  const openEdit = (p) => { setEditing(p); setForm({ name: p.name, price: String(p.price), category: p.category, barcode: p.barcode, emoji: p.emoji, stock: String(p.stock), minStock: String(p.minStock) }); setShowModal(true); };

  const save = () => {
    if (!form.name.trim() || !form.price || !form.barcode.trim() || !form.category.trim()) { showNotif("❌ أكمل الحقول المطلوبة"); return; }
    const dup = products.find(p => p.barcode === form.barcode.trim() && p.id !== editing?.id);
    if (dup) { showNotif(`❌ الباركود موجود: ${dup.name}`); return; }
    if (editing) {
      setProducts(prev => prev.map(p => p.id === editing.id ? { ...p, ...form, price: parseFloat(form.price), stock: parseInt(form.stock) || 0, minStock: parseInt(form.minStock) || 5 } : p));
      showNotif("✅ تم التعديل");
    } else {
      const id = Math.max(0, ...products.map(p => p.id)) + 1;
      setProducts(prev => [...prev, { id, name: form.name.trim(), price: parseFloat(form.price), category: form.category.trim(), barcode: form.barcode.trim(), emoji: form.emoji, stock: parseInt(form.stock) || 0, minStock: parseInt(form.minStock) || 5 }]);
      showNotif("✅ تم إضافة المنتج");
    }
    setShowModal(false);
  };

  const del = (id) => {
    if (!window.confirm("حذف المنتج؟")) return;
    setProducts(prev => prev.filter(p => p.id !== id));
    showNotif("🗑️ تم الحذف");
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <div style={{ fontWeight: 900, fontSize: 18 }}>🏷️ إدارة المنتجات — {products.length} صنف</div>
        <button className="btn btn-green" onClick={openAdd} style={{ padding: "9px 18px", fontSize: 13 }}>+ إضافة منتج</button>
      </div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 بحث بالاسم أو الباركود أو الفئة..." style={{ width: "100%", maxWidth: 400, background: "#1e293b", border: "1px solid #334155", borderRadius: 8, padding: "8px 12px", color: "#e2e8f0", fontSize: 13, outline: "none", marginBottom: 14 }} />
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <table className="tbl">
          <thead><tr><th>المنتج</th><th>الباركود</th><th>الفئة</th><th>السعر</th><th>مخزون</th><th>الإجراءات</th></tr></thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id}>
                <td><div style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ fontSize: 18 }}>{p.emoji}</span><span style={{ fontWeight: 600 }}>{p.name}</span></div></td>
                <td><span style={{ fontFamily: "monospace", color: "#38bdf8", fontSize: 12 }}>{p.barcode}</span></td>
                <td><span className="badge badge-blue">{p.category}</span></td>
                <td><span style={{ color: "#38bdf8", fontWeight: 700 }}>{fmt(p.price)} ر.س</span></td>
                <td><span style={{ color: p.stock === 0 ? "#f87171" : p.stock <= p.minStock ? "#fbbf24" : "#4ade80", fontWeight: 700 }}>{p.stock}</span></td>
                <td><div style={{ display: "flex", gap: 5 }}>
                  <button className="btn btn-yellow" onClick={() => openEdit(p)} style={{ padding: "3px 10px", fontSize: 11 }}>✏️ تعديل</button>
                  <button className="btn btn-red" onClick={() => del(p.id)} style={{ padding: "3px 10px", fontSize: 11 }}>🗑️</button>
                </div></td>
              </tr>
            ))}
            {!filtered.length && <tr><td colSpan={6} style={{ textAlign: "center", color: "#475569", padding: 30 }}>لا توجد منتجات</td></tr>}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="overlay">
          <div className="modal">
            <div style={{ fontWeight: 900, fontSize: 17, marginBottom: 18, color: "#38bdf8" }}>{editing ? "✏️ تعديل المنتج" : "➕ منتج جديد"}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div style={{ gridColumn: "1/-1" }}>
                <label className="fl">اسم المنتج *</label>
                <input className="fi" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="اسم المنتج" />
              </div>
              <div>
                <label className="fl">الباركود * <span style={{ color: "#475569", fontSize: 10 }}>(امسح أو اكتب)</span></label>
                <input className="fi" value={form.barcode} onChange={e => setForm({ ...form, barcode: e.target.value })} placeholder="6281234567890" style={{ fontFamily: "monospace", color: "#38bdf8" }} />
              </div>
              <div>
                <label className="fl">السعر (ر.س) *</label>
                <input className="fi" type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0.00" />
              </div>
              <div>
                <label className="fl">الفئة *</label>
                <input className="fi" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="مثال: مشروبات" list="cats" />
                <datalist id="cats">{[...new Set(products.map(p => p.category))].map(c => <option key={c} value={c} />)}</datalist>
              </div>
              <div>
                <label className="fl">الكمية الابتدائية</label>
                <input className="fi" type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="0" />
              </div>
              <div>
                <label className="fl">الحد الأدنى للمخزون</label>
                <input className="fi" type="number" value={form.minStock} onChange={e => setForm({ ...form, minStock: e.target.value })} placeholder="5" />
              </div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="fl">الأيقونة — <span style={{ fontSize: 20 }}>{form.emoji}</span></label>
              <div className="emoji-grid">{EMOJIS.map(e => <div key={e} className={`eo ${form.emoji === e ? "sel" : ""}`} onClick={() => setForm({ ...form, emoji: e })}>{e}</div>)}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-green" onClick={save} style={{ flex: 1, padding: "11px", fontSize: 14 }}>{editing ? "💾 حفظ" : "✅ إضافة"}</button>
              <button className="btn btn-red" onClick={() => setShowModal(false)} style={{ padding: "11px 18px", fontSize: 14 }}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── REPORTS TAB ──────────────────────────────────────────────────────────────
function ReportsTab({ sales, employees }) {
  const [dateFilter, setDateFilter] = useState(today());
  const [viewSale, setViewSale] = useState(null);

  const daySales = sales.filter(s => s.dateKey === dateFilter);
  const revenue = daySales.reduce((s, r) => s + r.total, 0);
  const itemsSold = daySales.reduce((s, r) => s + r.items.reduce((a, i) => a + i.qty, 0), 0);
  const avgTicket = daySales.length ? revenue / daySales.length : 0;
  const discountTotal = daySales.reduce((s, r) => s + r.discountAmt, 0);

  // Top products
  const productMap = {};
  daySales.forEach(s => s.items.forEach(i => {
    productMap[i.name] = (productMap[i.name] || 0) + i.qty;
  }));
  const topProducts = Object.entries(productMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // By cashier
  const cashierMap = {};
  daySales.forEach(s => { cashierMap[s.cashier] = (cashierMap[s.cashier] || 0) + s.total; });

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
        <div style={{ fontWeight: 900, fontSize: 18 }}>📊 تقارير المبيعات</div>
        <input type="date" value={dateFilter} onChange={e => setDateFilter(e.target.value)} style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8, padding: "7px 12px", color: "#e2e8f0", fontSize: 13, outline: "none" }} />
        <span style={{ color: "#64748b", fontSize: 13 }}>{daySales.length} فاتورة</span>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 20 }}>
        {[
          { icon: "💰", label: "الإيرادات", value: `${fmt(revenue)} ر.س`, color: "#38bdf8" },
          { icon: "🧾", label: "عدد الفواتير", value: daySales.length, color: "#4ade80" },
          { icon: "📦", label: "قطع مباعة", value: itemsSold, color: "#a78bfa" },
          { icon: "🎯", label: "متوسط الفاتورة", value: `${fmt(avgTicket)} ر.س`, color: "#fbbf24" },
        ].map(k => (
          <div key={k.label} className="stat-card">
            <div style={{ fontSize: 26 }}>{k.icon}</div>
            <div style={{ fontWeight: 900, fontSize: 20, color: k.color, marginTop: 4 }}>{k.value}</div>
            <div style={{ color: "#64748b", fontSize: 11, marginTop: 2 }}>{k.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        {/* Top products */}
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 12, color: "#94a3b8" }}>🏆 أكثر المنتجات مبيعاً</div>
          {topProducts.length ? topProducts.map(([name, qty], i) => (
            <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: ["#fbbf24","#94a3b8","#cd7c4a","#64748b","#64748b"][i], fontWeight: 900, fontSize: 13 }}>#{i + 1}</span>
                <span style={{ fontSize: 13 }}>{name}</span>
              </div>
              <span className="badge badge-blue">{qty} قطعة</span>
            </div>
          )) : <div style={{ color: "#475569", textAlign: "center", padding: 20 }}>لا توجد مبيعات</div>}
        </div>

        {/* By cashier */}
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 12, color: "#94a3b8" }}>👥 مبيعات الموظفين</div>
          {Object.keys(cashierMap).length ? Object.entries(cashierMap).sort((a, b) => b[1] - a[1]).map(([name, total]) => (
            <div key={name} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <span style={{ fontSize: 13 }}>👤 {name}</span>
              <span style={{ color: "#4ade80", fontWeight: 700, fontSize: 13 }}>{fmt(total)} ر.س</span>
            </div>
          )) : <div style={{ color: "#475569", textAlign: "center", padding: 20 }}>لا توجد بيانات</div>}
          {discountTotal > 0 && <div style={{ marginTop: 12, padding: "8px 12px", background: "#0f172a", borderRadius: 8, display: "flex", justifyContent: "space-between", fontSize: 12 }}>
            <span style={{ color: "#94a3b8" }}>إجمالي الخصومات:</span>
            <span style={{ color: "#f87171" }}>−{fmt(discountTotal)} ر.س</span>
          </div>}
        </div>
      </div>

      {/* Sales list */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        <div style={{ padding: "12px 14px", borderBottom: "1px solid #334155", fontWeight: 700 }}>🧾 سجل الفواتير</div>
        <table className="tbl">
          <thead><tr><th>#</th><th>الوقت</th><th>الكاشير</th><th>الأصناف</th><th>الإجمالي</th><th>تفاصيل</th></tr></thead>
          <tbody>
            {daySales.length ? daySales.map(s => (
              <tr key={s.id}>
                <td style={{ color: "#64748b" }}>{s.receiptNo}</td>
                <td style={{ color: "#64748b" }}>{s.date.split("،")[1]?.trim() || s.date}</td>
                <td>{s.cashier}</td>
                <td>{s.items.reduce((a, i) => a + i.qty, 0)} قطعة</td>
                <td><span style={{ color: "#38bdf8", fontWeight: 700 }}>{fmt(s.total)} ر.س</span></td>
                <td><button className="btn btn-gray" onClick={() => setViewSale(s)} style={{ padding: "3px 10px", fontSize: 11 }}>عرض</button></td>
              </tr>
            )) : <tr><td colSpan={6} style={{ textAlign: "center", color: "#475569", padding: 30 }}>لا توجد فواتير لهذا اليوم</td></tr>}
          </tbody>
        </table>
      </div>

      {/* View sale modal */}
      {viewSale && (
        <div className="overlay">
          <div className="receipt-paper">
            <div style={{ textAlign: "center", marginBottom: 12 }}>
              <div style={{ fontWeight: 900, fontSize: 17 }}>🏪 سوبرماركت النور</div>
              <div style={{ fontSize: 11, color: "#888" }}>#{viewSale.receiptNo} | {viewSale.date}</div>
              <div style={{ fontSize: 11, color: "#888" }}>الكاشير: {viewSale.cashier}</div>
            </div>
            <hr className="dash" />
            {viewSale.items.map(i => <div key={i.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}><span>{i.emoji} {i.name} ×{i.qty}</span><span>{fmt(i.price * i.qty)}</span></div>)}
            <hr className="dash" />
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}><span>المجموع</span><span>{fmt(viewSale.subtotal)} ر.س</span></div>
            {viewSale.discount > 0 && <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "red", marginBottom: 3 }}><span>خصم {viewSale.discount}%</span><span>−{fmt(viewSale.discountAmt)}</span></div>}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15, fontWeight: 900, borderTop: "2px solid #111", paddingTop: 6, marginBottom: 4 }}><span>الإجمالي</span><span>{fmt(viewSale.total)} ر.س</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 3 }}><span>المدفوع</span><span>{fmt(viewSale.paid)} ر.س</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, fontWeight: 700, color: "green" }}><span>الباقي</span><span>{fmt(viewSale.change)} ر.س</span></div>
            <hr className="dash" />
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-blue" onClick={() => printReceipt(viewSale)} style={{ flex: 1, padding: "9px", fontSize: 13 }}>🖨️ طباعة</button>
              <button className="btn btn-gray" onClick={() => setViewSale(null)} style={{ flex: 1, padding: "9px", fontSize: 13 }}>إغلاق</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── EMPLOYEES TAB ────────────────────────────────────────────────────────────
function EmployeesTab({ employees, setEmployees, showNotif }) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", username: "", password: "", role: "cashier", emoji: "👤" });
  const [showPass, setShowPass] = useState({});

  const EMO_EMP = ["👨‍💼","👩‍💼","👨‍💻","👩‍💻","🧑‍💼","👨‍🍳","👩‍🍳","🧑‍🔧","👮","🧑‍💼"];

  const openAdd = () => { setEditing(null); setForm({ name: "", username: "", password: "", role: "cashier", emoji: "👤" }); setShowModal(true); };
  const openEdit = (e) => { setEditing(e); setForm({ name: e.name, username: e.username, password: e.password, role: e.role, emoji: e.emoji }); setShowModal(true); };

  const save = () => {
    if (!form.name.trim() || !form.username.trim() || !form.password.trim()) { showNotif("❌ أكمل جميع الحقول"); return; }
    const dup = employees.find(e => e.username === form.username.trim() && e.id !== editing?.id);
    if (dup) { showNotif("❌ اسم المستخدم موجود"); return; }
    if (editing) {
      setEmployees(prev => prev.map(e => e.id === editing.id ? { ...e, ...form } : e));
      showNotif("✅ تم التعديل");
    } else {
      const id = Math.max(0, ...employees.map(e => e.id)) + 1;
      setEmployees(prev => [...prev, { id, ...form }]);
      showNotif("✅ تم إضافة الموظف");
    }
    setShowModal(false);
  };

  const del = (id) => {
    if (employees.length <= 1) { showNotif("❌ لا يمكن حذف جميع الموظفين"); return; }
    if (!window.confirm("حذف الموظف؟")) return;
    setEmployees(prev => prev.filter(e => e.id !== id));
    showNotif("🗑️ تم الحذف");
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div style={{ fontWeight: 900, fontSize: 18 }}>👥 إدارة الموظفين — {employees.length} موظف</div>
        <button className="btn btn-green" onClick={openAdd} style={{ padding: "9px 18px", fontSize: 13 }}>+ إضافة موظف</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
        {employees.map(e => (
          <div key={e.id} className="card">
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
              <span style={{ fontSize: 40 }}>{e.emoji}</span>
              <div>
                <div style={{ fontWeight: 900, fontSize: 16 }}>{e.name}</div>
                <span className={`badge ${e.role === "admin" ? "badge-purple" : "badge-blue"}`} style={{ background: e.role === "admin" ? "#7c3aed22" : "#0ea5e922", color: e.role === "admin" ? "#a78bfa" : "#38bdf8" }}>
                  {e.role === "admin" ? "👑 مدير" : "👤 كاشير"}
                </span>
              </div>
            </div>
            <div style={{ background: "#0f172a", borderRadius: 8, padding: "10px 12px", marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 5 }}>
                <span style={{ color: "#64748b" }}>اسم المستخدم:</span>
                <span style={{ fontFamily: "monospace", color: "#38bdf8" }}>{e.username}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, alignItems: "center" }}>
                <span style={{ color: "#64748b" }}>كلمة المرور:</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ fontFamily: "monospace" }}>{showPass[e.id] ? e.password : "••••"}</span>
                  <button className="btn btn-gray" onClick={() => setShowPass(p => ({ ...p, [e.id]: !p[e.id] }))} style={{ padding: "2px 6px", fontSize: 10 }}>{showPass[e.id] ? "🙈" : "👁️"}</button>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-yellow" onClick={() => openEdit(e)} style={{ flex: 1, padding: "7px", fontSize: 12 }}>✏️ تعديل</button>
              <button className="btn btn-red" onClick={() => del(e.id)} style={{ flex: 1, padding: "7px", fontSize: 12 }}>🗑️ حذف</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="overlay">
          <div className="modal-sm">
            <div style={{ fontWeight: 900, fontSize: 17, marginBottom: 18, color: "#38bdf8" }}>{editing ? "✏️ تعديل الموظف" : "➕ موظف جديد"}</div>
            <div style={{ marginBottom: 12 }}>
              <label className="fl">الاسم الكامل *</label>
              <input className="fi" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="الاسم" />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label className="fl">اسم المستخدم *</label>
              <input className="fi" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} placeholder="username" style={{ fontFamily: "monospace" }} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label className="fl">كلمة المرور *</label>
              <input className="fi" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} placeholder="••••" />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label className="fl">الصلاحية</label>
              <select className="fi" value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                <option value="cashier">👤 كاشير</option>
                <option value="admin">👑 مدير (وصول كامل)</option>
              </select>
            </div>
            <div style={{ marginBottom: 18 }}>
              <label className="fl">الأيقونة — <span style={{ fontSize: 22 }}>{form.emoji}</span></label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
                {EMO_EMP.map(e => <div key={e} className={`eo ${form.emoji === e ? "sel" : ""}`} onClick={() => setForm({ ...form, emoji: e })} style={{ fontSize: 22, padding: 7 }}>{e}</div>)}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-green" onClick={save} style={{ flex: 1, padding: "11px", fontSize: 14 }}>{editing ? "💾 حفظ" : "✅ إضافة"}</button>
              <button className="btn btn-red" onClick={() => setShowModal(false)} style={{ padding: "11px 16px", fontSize: 14 }}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
