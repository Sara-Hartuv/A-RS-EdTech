import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { ShoppingCart, User, LogOut, Store } from "lucide-react";
import logo from "../../assets/מיתרים-אופציה-1 (1).gif";

export default function TopBar() {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const logout = useAuthStore((s) => s.logout);

  const isAuthenticated = !!user && !!token;
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 shadow-sm border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24 py-2">
          {/* Logo - Left Side */}
          <Link to="/" className="flex flex-col items-center justify-center group py-1">
            <img 
              src={logo} 
              alt="מייתרים - תוכנית עיצוב התנהגות" 
              className="h-32 w-auto -mt-10 object-contain transition-transform group-hover:scale-105"
            />
            <p className="text-[10px] text-slate-600 font-medium -mt-6">תוכנית עיצוב התנהגות</p>
          </Link>

          {/* Navigation & User Info - Right Side */}
          <div className="flex items-center gap-6" dir="rtl">
            {isAuthenticated && (
              <>
                {/* Student View Navigation */}
                {user?.role === 'student' && (
                  <nav className="hidden md:flex items-center gap-1">
                    <NavLink
                      to="/products"
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                          isActive
                            ? "bg-blue-50 text-blue-700 shadow-sm"
                            : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                        }`
                      }
                    >
                      <Store className="w-4 h-4" />
                      <span>הקיוסק</span>
                    </NavLink>
                    
                    <NavLink
                      to="/cart"
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                          isActive
                            ? "bg-blue-50 text-blue-700 shadow-sm"
                            : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                        }`
                      }
                    >
                      <ShoppingCart className="w-4 h-4" />
                      <span>הסל שלי</span>
                    </NavLink>
                    
                    <NavLink
                      to="/student"
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                          isActive
                            ? "bg-blue-50 text-blue-700 shadow-sm"
                            : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                        }`
                      }
                    >
                      <User className="w-4 h-4" />
                      <span>פרופיל אישי</span>
                    </NavLink>
                  </nav>
                )}

                {/* Teacher/Admin View Navigation */}
                {(user?.role === 'teacher' || user?.role === 'admin') && (
                  <nav className="hidden md:flex items-center gap-1">
                    <NavLink
                      to="/teacher"
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                          isActive
                            ? "bg-blue-50 text-blue-700 shadow-sm"
                            : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                        }`
                      }
                    >
                      דשבורד מורה
                    </NavLink>
                    
                    <NavLink
                      to="/products"
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                          isActive
                            ? "bg-blue-50 text-blue-700 shadow-sm"
                            : "text-slate-600 hover:bg-blue-50 hover:text-blue-600"
                        }`
                      }
                    >
                      מוצרים
                    </NavLink>
                  </nav>
                )}

                {/* User Greeting & Logout */}
                <div className="flex items-center gap-3 border-r border-slate-200 pr-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-slate-700">
                      שלום ל{user?.name}! 👋
                    </p>
                    <p className="text-xs text-slate-500">
                      {user?.role === 'student' ? 'תלמיד/ה' : user?.role === 'teacher' ? 'מורה' : 'מנהל/ת'}
                    </p>
                  </div>
                  
                  <button
                    onClick={handleLogout}
                    className="p-2 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all"
                    title="יציאה"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            )}

            {!isAuthenticated && (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `px-5 py-2 rounded-lg font-medium transition-all ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
                  }`
                }
              >
                כניסה
              </NavLink>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        {isAuthenticated && user?.role === 'student' && (
          <div className="md:hidden border-t border-slate-200 py-2" dir="rtl">
            <nav className="flex justify-around">
              <NavLink
                to="/products"
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-3 py-2 rounded-lg ${
                    isActive ? "text-blue-700" : "text-slate-600"
                  }`
                }
              >
                <Store className="w-5 h-5" />
                <span className="text-xs font-medium">הקיוסק</span>
              </NavLink>
              
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-3 py-2 rounded-lg ${
                    isActive ? "text-blue-700" : "text-slate-600"
                  }`
                }
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="text-xs font-medium">הסל שלי</span>
              </NavLink>
              
              <NavLink
                to="/student"
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 px-3 py-2 rounded-lg ${
                    isActive ? "text-blue-700" : "text-slate-600"
                  }`
                }
              >
                <User className="w-5 h-5" />
                <span className="text-xs font-medium">פרופיל</span>
              </NavLink>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
