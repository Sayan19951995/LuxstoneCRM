// src/components/DashboardLayout.tsx
import React, { useState } from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  Package,
  Boxes,
  ClipboardList,
  Settings,
  Menu,
  X,
  PlusCircle,
  Import,
  Bell,
  UserCircle,
  Search,
  Download,
  Info,
  Briefcase,
  Users,
  CalendarDays,
  BarChart,
  LogOut,
} from 'lucide-react'; // Импортируем иконки из lucide-react
import { motion } from 'framer-motion'; // Для анимаций

interface DashboardLayoutProps {
  children: React.ReactNode;
  onNavigate: (page: string) => void;
  userId: string | null;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, onNavigate, userId }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Определяем, какая страница сейчас активна, чтобы подсвечивать ее в навигации
  const getActivePage = () => {
    const path = window.location.pathname;
    // Используем простой isActive для примера, в реальном приложении можно использовать React Router
    if (path.includes('dashboard')) return 'Dashboard';
    if (path.includes('sales')) return 'Sales';
    if (path.includes('inventory')) return 'Inventory';
    if (path.includes('intransit')) return 'InTransit';
    if (path.includes('materials')) return 'Materials';
    if (path.includes('reports')) return 'Reports';
    if (path.includes('settings')) return 'Settings';
    if (path.includes('tasks')) return 'Tasks'; // Новые пункты меню
    if (path.includes('calendar')) return 'Calendar';
    if (path.includes('analytics')) return 'Analytics';
    if (path.includes('team')) return 'Team';
    if (path.includes('help')) return 'Help';
    if (path.includes('logout')) return 'Logout';
    return 'Dashboard'; // По умолчанию
  };
  const activePage = getActivePage();

  const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" />, role: ['Директор', 'Менеджер', 'Упаковщик', 'Курьер'] },
    { name: 'Tasks', icon: <Briefcase className="w-5 h-5" />, role: ['Директор', 'Менеджер'] },
    { name: 'Calendar', icon: <CalendarDays className="w-5 h-5" />, role: ['Директор', 'Менеджер'] },
    { name: 'Analytics', icon: <BarChart className="w-5 h-5" />, role: ['Директор'] },
    { name: 'Team', icon: <Users className="w-5 h-5" />, role: ['Директор'] },
    // Общие пункты (для примера, так как в дизайне их нет под "Menu")
    { name: 'Sales', icon: <TrendingUp className="w-5 h-5" />, role: ['Менеджер', 'Директор'] },
    { name: 'Inventory', icon: <Package className="w-5 h-5" />, role: ['Упаковщик', 'Директор'] },
    { name: 'InTransit', icon: <Boxes className="w-5 h-5" />, role: ['Директор'] },
    { name: 'Materials', icon: <ClipboardList className="w-5 h-5" />, role: ['Курьер', 'Директор'] },
    { name: 'Reports', icon: <BarChart className="w-5 h-5" />, role: ['Директор'] },
    
    { name: 'Settings', icon: <Settings className="w-5 h-5" />, role: ['Директор'] },
    { name: 'Help', icon: <Info className="w-5 h-5" />, role: ['Директор', 'Менеджер', 'Упаковщик', 'Курьер'] },
    { name: 'Logout', icon: <LogOut className="w-5 h-5" />, role: ['Директор', 'Менеджер', 'Упаковщик', 'Курьер'] },
  ];

  const currentUserRole = 'Директор'; // Заглушка для текущей роли пользователя

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Боковая панель для больших экранов */}
      <motion.aside
        initial={{ x: -256 }} // Скрыта по умолчанию при первом рендере
        animate={{ x: isSidebarOpen ? 0 : -256 }} // Для переключения на мобильных
        transition={{ type: "tween", duration: 0.3 }}
        // Классы для настольных: md:relative, md:translate-x-0 (всегда видна), md:flex, md:transform-none
        // Классы для мобильных: fixed, inset-y-0, left-0, z-40 (поверх), и условный transform
        className={`w-64 bg-white dark:bg-gray-800 shadow-lg flex-col rounded-r-3xl
          ${isSidebarOpen
            ? 'fixed inset-y-0 left-0 transform translate-x-0 z-40' // Открыта на мобильных
            : 'fixed inset-y-0 left-0 transform -translate-x-full z-40' // Закрыта на мобильных
          }
          md:relative md:flex md:translate-x-0 md:transform-none // Настольные: всегда видна, часть flex-макета
          transition-transform duration-300 ease-in-out` // Сохраняем переход для мобильного слайда
        }
      >
        <div className="p-6 flex items-center justify-between border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 flex items-center">
            <img src="https://placehold.co/40x40/000000/FFFFFF?text=D" alt="Donezo Logo" className="mr-2 rounded-full" />
            Donezo
          </h1>
          <button className="md:hidden text-gray-500 dark:text-gray-400" onClick={() => setIsSidebarOpen(false)}>
            <X className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
          <p className="text-xs text-gray-400 uppercase font-semibold mb-2 ml-3">Menu</p>
          {navItems.filter(item => ['Dashboard', 'Tasks', 'Calendar', 'Analytics', 'Team', 'Sales', 'Inventory', 'InTransit', 'Materials', 'Reports'].includes(item.name))
                   .map((item) => (
            item.role.includes(currentUserRole) && (
              <button
                key={item.name}
                onClick={() => onNavigate(item.name)}
                className={`w-full flex items-center p-3 rounded-lg text-left transition-colors duration-200 ease-in-out group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                  activePage === item.name
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-700 dark:hover:text-blue-300'
                }`}
              >
                {React.cloneElement(item.icon, {
                  className: `w-5 h-5 ${activePage === item.name ? 'text-white' : 'text-gray-500 group-hover:text-blue-700 dark:text-gray-400 dark:group-hover:text-blue-300'}`
                })}
                <span className={`ml-3 text-lg font-medium ${activePage === item.name ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>{item.name}</span>
              </button>
            )
          ))}
          <p className="text-xs text-gray-400 uppercase font-semibold mt-6 mb-2 ml-3">General</p>
          {navItems.filter(item => ['Settings', 'Help', 'Logout'].includes(item.name))
                   .map((item) => (
            item.role.includes(currentUserRole) && (
              <button
                key={item.name}
                onClick={() => onNavigate(item.name)}
                className={`w-full flex items-center p-3 rounded-lg text-left transition-colors duration-200 ease-in-out group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
                  activePage === item.name
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-blue-700 dark:hover:text-blue-300'
                }`}
              >
                {React.cloneElement(item.icon, {
                  className: `w-5 h-5 ${activePage === item.name ? 'text-white' : 'text-gray-500 group-hover:text-blue-700 dark:text-gray-400 dark:group-hover:text-blue-300'}`
                })}
                <span className={`ml-3 text-lg font-medium ${activePage === item.name ? 'text-white' : 'text-gray-700 dark:text-gray-300'}`}>{item.name}</span>
              </button>
            )
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
          <div className="bg-gradient-to-r from-green-400 to-blue-500 p-4 rounded-xl text-white shadow-lg text-center mb-4">
            <h4 className="font-bold text-lg mb-2">Загрузите наше мобильное приложение</h4>
            <p className="text-sm mb-4">Вы можете скачать наше мобильное приложение из Play Store или App Store</p>
            <button className="bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg shadow hover:bg-gray-100 transition-colors duration-200">
              <Download className="inline-block w-4 h-4 mr-2" /> Загрузить
            </button>
          </div>
          {userId && (
            <div className="flex items-center justify-center mt-4 text-gray-600 dark:text-gray-400">
              <span className="truncate">ID пользователя: {userId}</span>
            </div>
          )}
        </div>
      </motion.aside>

      {/* Основная область контента */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Заголовок для мобильных и настольных устройств */}
        <header className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow-md md:rounded-bl-3xl md:rounded-tr-3xl">
          <button className="text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md" onClick={() => setIsSidebarOpen(true)}>
            <Menu className="w-8 h-8" />
          </button>
          <div className="relative flex items-center flex-grow mx-4">
            <Search className="w-5 h-5 text-gray-400 absolute left-3" />
            <input
              type="text"
              placeholder="Искать задачу"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button className="text-gray-500 dark:text-gray-400 mr-4">
            <Bell className="w-6 h-6" />
          </button>
          <div className="flex items-center">
            <img
              src="https://placehold.co/40x40/FF5733/FFFFFF?text=TM" // Placeholder for user avatar
              alt="User Avatar"
              className="w-10 h-10 rounded-full mr-3"
            />
            <div className="text-sm">
              <p className="font-semibold text-gray-800 dark:text-gray-200">Тоток Майкл</p>
              <p className="text-gray-500 dark:text-gray-400">tmichael@gmail.com</p>
            </div>
          </div>
        </header>

        {/* Область контента */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
