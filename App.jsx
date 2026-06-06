import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Users, 
  Package, 
  BarChart3, 
  LogOut, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Search, 
  TrendingUp, 
  DollarSign, 
  FileText 
} from 'lucide-react';

export default function App() {
  // حالات تسجيل الدخول والمستخدم
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(''); // 'admin' أو 'cashier'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // تبويبات لوحة التحكم
  const [activeTab, setActiveTab] = useState('pos');

  // بيانات النظام الافتراضية
  const [products, setProducts] = useState([
    { id: 1, name: 'مياه معدنية 500 مل', price: 500, category: 'مشروبات', stock: 50 },
    { id: 2, name: 'شيبس ليز عائلي', price: 1250, category: 'سناك', stock: 30 },
    { id: 3, name: 'عصير برتقال طبيعي', price: 1500, category: 'مشروبات', stock: 20 },
    { id: 4, name: 'بسكويت شوكولاتة', price: 750, category: 'سناك', stock: 40 }
  ]);

  const [cart, setCart] = useState([]);
  const [sales, setSales] = useState([
    { id: 101, date: '2026-06-06', items: 3, total: 3250, cashier: 'سارة' },
    { id: 102, date: '2026-06-06', items: 1, total: 1500, cashier: 'أحمد' }
  ]);

  // نموذج إضافة منتج جديد
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('مشروبات');
  const [newProdStock, setNewProdStock] = useState('');

  // دالة تسجيل الدخول المصححة
  const handleLogin = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    const enteredUser = username.trim().toLowerCase();
    const enteredPass = password.trim();

    if (enteredUser === 'admin' && enteredPass === '1234') {
      setIsLoggedIn(true);
      setRole('admin');
      setError('');
      setActiveTab('dashboard'); // المدير يفتح على الإحصائيات
    } else if (enteredUser === 'sara' && enteredPass === '1234') {
      setIsLoggedIn(true);
      setRole('cashier');
      setError('');
      setActiveTab('pos'); // الكاشير يفتح على شاشة البيع فوراً
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  // دالة تسجيل الخروج
  const handleLogout = () => {
    setIsLoggedIn(false);
    setRole('');
    setUsername('');
    setPassword('');
    setCart([]);
  };

  // العمليات على السلة (POS)
  const addToCart = (product) => {
    if (product.stock <= 0) return;
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
    setProducts(products.map(p => p.id === product.id ? { ...p, stock: p.stock - 1 } : p));
  };

  const removeFromCart = (item) => {
    setCart(cart.filter(c => c.id !== item.id));
    setProducts(products.map(p => p.id === item.id ? { ...p, stock: p.stock + item.qty } : p));
  };

  const checkout = () => {
    if (cart.length === 0) return;
    const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    
    const newSale = {
      id: sales.length + 101,
      date: new Date().toISOString().split('T')[0],
      items: totalItems,
      total: total,
      cashier: role === 'admin' ? 'أحمد' : 'سارة'
    };

    setSales([newSale, ...sales]);
    setCart([]);
    alert('تم إتمام البيع وطباعة الفاتورة بنجاح! 🎉');
  };

  // إضافة منتج جديد من قبل المدير
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice || !newProdStock) return;

    const newProd = {
      id: products.length + 1,
      name: newProdName,
      price: parseFloat(newProdPrice),
      category: newProdCategory,
      stock: parseInt(newProdStock)
    };

    setProducts([...products, newProd]);
    setNewProdName('');
    setNewProdPrice('');
    setNewProdStock('');
  };

  // حساب إجمالي المبيعات
  const totalSalesRevenue = sales.reduce((sum, sale) => sum + sale.total, 0);

  // واجهة تسجيل الدخول
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 font-sans p-4" dir="rtl">
        <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-700">
          <div className="text-center mb-8">
            <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/30">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">نظام كاشير النور</h1>
            <p className="text-slate-400 mt-2 text-sm">يرجى تسجيل الدخول لإدارة المبيعات</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-slate-300 text-sm mb-2 font-medium">اسم المستخدم</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition text-right"
                placeholder="مثال: admin أو sara"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 text-sm mb-2 font-medium">كلمة المرور</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 transition text-right"
                placeholder="••••"
                required
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            <button 
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow-lg shadow-blue-600/20 transition duration-200"
            >
              تسجيل الدخول
            </button>
          </form>
        </div>
      </div>
    );
  }

  // واجهة التطبيق الرئيسية بعد الدخول
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col md:flex-row" dir="rtl">
      
      {/* القائمة الجانبية (Sidebar) */}
      <div className="w-full md:w-64 bg-slate-800 border-l border-slate-700 flex flex-col justify-between p-4">
        <div>
          <div className="flex items-center gap-3 pb-6 mb-6 border-b border-slate-700">
            <div className="bg-blue-600 p-2 rounded-xl">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-white text-lg">كاشير النور</h2>
              <span className="text-xs bg-slate-700 text-blue-400 px-2 py-0.5 rounded-full font-medium">
                {role === 'admin' ? 'المدير العام' : 'حساب كاشير'}
              </span>
            </div>
          </div>

          <nav className="space-y-2">
            {role === 'admin' && (
              <button 
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-700/50'}`}
              >
                <BarChart3 className="w-5 h-5" /> الإحصائيات العامة
              </button>
            )}

            <button 
              onClick={() => setActiveTab('pos')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${activeTab === 'pos' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-700/50'}`}
            >
              <ShoppingBag className="w-5 h-5" /> شاشة البيع (POS)
            </button>

            {role === 'admin' && (
              <button 
                onClick={() => setActiveTab('products')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${activeTab === 'products' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-700/50'}`}
              >
                <Package className="w-5 h-5" /> إدارة المخزن
              </button>
            )}

            <button 
              onClick={() => setActiveTab('sales')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition ${activeTab === 'sales' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-700/50'}`}
            >
              <FileText className="w-5 h-5" /> سجل الفواتير
            </button>
          </nav>
        </div>

        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl text-sm font-medium transition mt-8"
        >
          <LogOut className="w-5 h-5" /> تسجيل الخروج
        </button>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="flex-1 p-6 overflow-y-auto">
        
        {/* 1. تبويب الإحصائيات (Admin فقط) */}
        {activeTab === 'dashboard' && role === 'admin' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">لوحة التحكم والإحصائيات</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">إجمالي المبيعات</p>
                  <h3 className="text-2xl font-bold text-white mt-1">{totalSalesRevenue.toLocaleString()} د.ع</h3>
                </div>
                <div className="bg-emerald-500/10 p-3 rounded-xl text-emerald-400"><DollarSign className="w-6 h-6" /></div>
              </div>
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">الفواتير الصادرة</p>
                  <h3 className="text-2xl font-bold text-white mt-1">{sales.length} فاتورة</h3>
                </div>
                <div className="bg-blue-500/10 p-3 rounded-xl text-blue-400"><FileText className="w-6 h-6" /></div>
              </div>
              <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">المنتجات بالمخزن</p>
                  <h3 className="text-2xl font-bold text-white mt-1">{products.length} صنف</h3>
                </div>
                <div className="bg-amber-500/10 p-3 rounded-xl text-amber-400"><Package className="w-6 h-6" /></div>
              </div>
            </div>
          </div>
        )}

        {/* 2. شاشة البيع (POS) */}
        {activeTab === 'pos' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* قسم المنتجات المتاحة */}
            <div className="lg:col-span-2 space-y-4">
              <h1 className="text-2xl font-bold text-white">شاشة البيع السريع</h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {products.map(product => (
                  <button 
                    key={product.id}
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col justify-between hover:border-blue-500 transition text-right disabled:opacity-50 disabled:pointer-events-none"
                  >
                    <div className="w-full">
                      <span className="text-xs bg-slate-700 text-slate-300 px-2 py-0.5 rounded-full">{product.category}</span>
                      <h3 className="font-bold text-white mt-2 text-lg">{product.name}</h3>
                    </div>
                    <div className="w-full flex justify-between items-center mt-4 border-t border-slate-700/50 pt-2">
                      <span className="text-blue-400 font-bold">{product.price.toLocaleString()} د.ع</span>
                      <span className={`text-xs ${product.stock < 10 ? 'text-amber-400' : 'text-slate-400'}`}>المخزن: {product.stock}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* سلة المشتريات والفاتورة */}
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-4 flex flex-col justify-between h-[calc(100vh-8rem)]">
              <div>
                <h2 className="font-bold text-white text-lg pb-3 border-b border-slate-700 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-blue-500" /> الفاتورة الحالية
                </h2>
                <div className="space-y-3 mt-4 overflow-y-auto max-h-[50vh]">
                  {cart.length === 0 ? (
                    <p className="text-slate-500 text-center py-8 text-sm">السلة فارغة. اضغط على المنتجات لإضافتها</p>
                  ) : (
                    cart.map(item => (
                      <div key={item.id} className="flex justify-between items-center bg-slate-900/50 p-3 rounded-xl border border-slate-700/40">
                        <div>
                          <h4 className="font-medium text-sm text-white">{item.name}</h4>
                          <span className="text-xs text-slate-400">{item.price} × {item.qty}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-blue-400 text-sm">{(item.price * item.qty).toLocaleString()}</span>
                          <button onClick={() => removeFromCart(item)} className="text-red-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="border-t border-slate-700 pt-4 space-y-4">
                <div className="flex justify-between items-center text-lg font-bold text-white">
                  <span>المجموع الكلي:</span>
                  <span className="text-xl text-emerald-400">{cart.reduce((sum, item) => sum + (item.price * item.qty), 0).toLocaleString()} د.ع</span>
                </div>
                <button 
                  onClick={checkout}
                  disabled={cart.length === 0}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:pointer-events-none text-white font-medium rounded-xl shadow-lg transition flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" /> إتمام العملية وطباعة (F12)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. إدارة المخزن (Admin فقط) */}
        {activeTab === 'products' && role === 'admin' && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-white">إدارة المنتجات والمخزن</h1>
            
            {/* نموذج إضافة منتج جديد */}
            <form onSubmit={handleAddProduct} className="bg-slate-800 p-4 rounded-xl border border-slate-700 grid grid-cols-1 sm:grid-cols-5 gap-4 items-end">
              <div className="sm:col-span-2">
                <label className="block text-xs text-slate-400 mb-1">اسم المنتج</label>
                <input type="text" value={newProdName} onChange={(e) => setNewProdName(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm" placeholder="مثال: بسكويت غندور" required />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">السعر (د.ع)</label>
                <input type="number" value={newProdPrice} onChange={(e) => setNewProdPrice(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm" placeholder="1000" required />
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">الكمية بالمخزن</label>
                <input type="number" value={newProdStock} onChange={(e) => setNewProdStock(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm" placeholder="50" required />
              </div>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg text-sm flex items-center justify-center gap-2 h-10"><Plus className="w-4 h-4" /> إضافة</button>
            </form>

            {/* جدول المنتجات الحالية */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-700/50 text-slate-300 text-sm">
                    <th className="p-3">المعرف</th>
                    <th className="p-3">اسم المنتج</th>
                    <th className="p-3">السعر</th>
                    <th className="p-3">الكمية المتاحة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700 text-sm">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-slate-700/20">
                      <td className="p-3 text-slate-400">#{p.id}</td>
                      <td className="p-3 font-medium text-white">{p.name}</td>
                      <td className="p-3 text-blue-400">{p.price.toLocaleString()} د.ع</td>
                      <td className="p-3"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${p.stock < 10 ? 'bg-red-500/10 text-red-400' : 'bg-slate-900 text-slate-300'}`}>{p.stock} قطعة</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. سجل المبيعات والفواتير */}
        {activeTab === 'sales' && (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-white">سجل العمليات والفواتير الصادرة</h1>
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <table className="w-full text-right border-collapse">
                <thead>
                  <tr className="bg-slate-700/50 text-slate-300 text-sm">
                    <th className="p-3">رقم الفاتورة</th>
                    <th className="p-3">التاريخ</th>
                    <th className="p-3">عدد المواد</th>
                    <th className="p-3">المجموع الكلي</th>
                    <th className="p-3">الموظف المسؤول</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700 text-sm">
                  {sales.map(sale => (
                    <tr key={sale.id} className="hover:bg-slate-700/20">
                      <td className="p-3 text-blue-400 font-medium">#{sale.id}</td>
                      <td className="p-3 text-slate-300">{sale.date}</td>
                      <td className="p-3 text-slate-300">{sale.items} قطع</td>
                      <td className="p-3 text-emerald-400 font-bold">{sale.total.toLocaleString()} د.ع</td>
                      <td className="p-3 text-slate-400">{sale.cashier}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
