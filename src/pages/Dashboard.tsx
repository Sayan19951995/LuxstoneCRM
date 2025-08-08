// src/pages/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { motion } from 'framer-motion';
import {
  Plus,
  Import,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  Package, // For inventory
  DollarSign // For sales/profit
} from 'lucide-react';

interface DashboardProps {
  userId: string;
}

// --- ФИКтивные ДАННЫЕ (Fake Data) ---
// Агрегированные данные о продажах за Июль 2025 и Июнь 2025 для графика трендов
// (На основе "Отчет продаж (Производство).xlsx - Июль 2025 new.csv" и "Июнь 2025 new.csv")
const FAKE_SALES_DATA_MONTHLY = [
  { date: 'Июнь 2025', Revenue: 5092300, Profit: 890508.99 },
  { date: 'Июль 2025', Revenue: 6494350, Profit: 1914122.5 },
];

// Фиктивные данные о продажах за последнюю неделю (имитация ежедневных продаж)
const FAKE_SALES_DATA_WEEKLY = [
  { date: 'Июл 29', Revenue: 150000, Profit: 30000 },
  { date: 'Июл 30', Revenue: 200000, Profit: 45000 },
  { date: 'Июл 31', Revenue: 180000, Profit: 35000 },
  { date: 'Авг 01', Revenue: 250000, Profit: 60000 },
  { date: 'Авг 02', Revenue: 190000, Profit: 40000 },
  { date: 'Авг 03', Revenue: 300000, Profit: 75000 },
  { date: 'Авг 04', Revenue: 220000, Profit: 50000 },
];

// Детализированные данные о складских остатках
// (На основе "Отчет продаж (Производство).xlsx - Июль 2025 new.csv", "Товарка.xlsx - Июль 2025 Отчет.csv",
// "Цех Luxstone себест продукций и ЗП.xlsx - ЗП процент.csv", "Продажи МОП 2025.xlsx - Август 2025 МОП.csv")
const FAKE_INVENTORY_DATA = [
  { id: 'prod1', productName: 'Стул Luxstone', quantity: 41, costPrice: 9000, sellingPrice: 30554.88, criticalStock: 5 }, // Июль 2025 Продажи
  { id: 'prod2', productName: 'Парта Luma', quantity: 25, costPrice: 26000, sellingPrice: 55000, criticalStock: 5 }, // ЗП Процент, вымышленная цена продажи
  { id: 'prod3', productName: 'Проектор Lumi 1000', quantity: 13, costPrice: 80000, sellingPrice: 198000, criticalStock: 5 }, // Товарка Июль
  { id: 'prod4', productName: 'Пианино Lapiano', quantity: 7, costPrice: 135000, sellingPrice: 256842.86, criticalStock: 5 }, // Товарка Июль
  { id: 'prod5', productName: 'Кровать Twin', quantity: 8, costPrice: 77000, sellingPrice: 180000, criticalStock: 5 }, // ЗП Процент, вымышленная цена продажи
  { id: 'prod6', productName: 'Набор Luma', quantity: 4, costPrice: 70000, sellingPrice: 99000, criticalStock: 5 }, // Август МОП, вымышленная себестоимость
  { id: 'prod7', productName: 'Стул Luxstone 06', quantity: 11, costPrice: 16000, sellingPrice: 61818.18, criticalStock: 5 }, // Июнь 2025 Продажи
];

// Данные о товарах в пути из Китая
// (На основе "Товарка.xlsx - Партнеры China.csv" для названий продуктов и поставщиков)
const FAKE_IN_TRANSIT_DATA = [
  { id: 'transit1', productName: 'Lumi1000', quantity: 100, expectedArrival: '2024-08-20', supplier: 'Shenzhen Lanbian Technology', costPerItem: 78000, status: 'In Transit' },
  { id: 'transit2', productName: 'Пианино Leni', quantity: 20, expectedArrival: '2024-09-05', supplier: 'Quanzhou Xionghai Electronic Technology', costPerItem: 120000, status: 'Customs' },
  { id: 'transit3', productName: 'Экран проектор', quantity: 50, expectedArrival: '2024-09-15', supplier: 'Shenzhen Future Information Technology', costPerItem: 15000, status: 'In Transit' },
  { id: 'transit4', productName: 'Десткие кресла', quantity: 30, expectedArrival: '2024-08-25', supplier: 'Xinxiang Linshan Trading', costPerItem: 20000, status: 'In Transit' },
];

const COLORS_CHART = ['#51d087', '#4299e1', '#f6ad55', '#fc8181', '#667eea', '#ed8936']; // Более яркие цвета для графиков

const Dashboard: React.FC<DashboardProps> = ({ userId }) => {
  const [monthlySalesData, setMonthlySalesData] = useState<any[]>([]);
  const [weeklySalesData, setWeeklySalesData] = useState<any[]>([]);
  const [inventorySummary, setInventorySummary] = useState<any[]>([]);
  const [inTransitItems, setInTransitItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setMonthlySalesData(FAKE_SALES_DATA_MONTHLY);
      setWeeklySalesData(FAKE_SALES_DATA_WEEKLY);
      setInventorySummary(FAKE_INVENTORY_DATA);
      setInTransitItems(FAKE_IN_TRANSIT_DATA);
      setLoading(false);
    }, 500);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
        <p className="ml-4 text-lg text-gray-700 dark:text-gray-300">Загрузка дашбордов...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center text-lg mt-8">{error}</div>;
  }

  // Общая стоимость на складе (по себестоимости)
  const totalStockValue = inventorySummary.reduce((sum, item) => sum + (item.costPrice * item.quantity || 0), 0);
  const criticalStockCount = inventorySummary.filter(item => item.quantity < item.criticalStock).length;

  // Самые продаваемые товары (по количеству на складе, как индикатор популярности)
  const topSellingProducts = [...inventorySummary]
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5); // Топ-5 самых продаваемых (с самым большим количеством на складе)

  // Обновленные метрики для карточек обзора
  const totalRevenueJuly = FAKE_SALES_DATA_MONTHLY.find(item => item.date === 'Июль 2025')?.Revenue || 0;
  const totalProfitJuly = FAKE_SALES_DATA_MONTHLY.find(item => item.date === 'Июль 2025')?.Profit || 0;
  const itemsInTransitCount = inTransitItems.length;
  const totalCriticalStockItems = criticalStockCount;

  return (
    <div className="container mx-auto p-4 md:p-6 bg-gray-100 dark:bg-gray-900 rounded-3xl min-h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">Дашборд</h2>
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md flex items-center"
          >
            <Plus className="w-5 h-5 mr-2" /> Добавить
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white hover:bg-gray-50 text-gray-800 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600 font-semibold py-2 px-4 rounded-lg shadow-md flex items-center border border-gray-300 dark:border-gray-600"
          >
            <Import className="w-5 h-5 mr-2" /> Импортировать
          </motion.button>
        </div>
      </div>

      <p className="text-gray-600 dark:text-gray-400 mb-8">
        Обзор ключевых показателей вашего бизнеса.
      </p>

      {/* Overview Cards (Бизнес-метрики) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 flex flex-col items-start"
        >
          <div className="flex items-center justify-between w-full mb-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Доход (Июль 2025)</h3>
            <ArrowRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <p className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">{totalRevenueJuly.toLocaleString()} KZT</p>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span>Увеличение с прошлого месяца</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 flex flex-col items-start"
        >
          <div className="flex items-center justify-between w-full mb-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Прибыль (Июль 2025)</h3>
            <ArrowRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{totalProfitJuly.toLocaleString()} KZT</p>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
            <span>Увеличение с прошлого месяца</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 flex flex-col items-start"
        >
          <div className="flex items-center justify-between w-full mb-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Товаров в пути</h3>
            <ArrowRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <p className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">{itemsInTransitCount}</p>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Package className="w-4 h-4 text-purple-500 mr-1" />
            <span>Активные поставки</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 flex flex-col items-start"
        >
          <div className="flex items-center justify-between w-full mb-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Критический остаток</h3>
            <ArrowRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          </div>
          <p className="text-4xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">{totalCriticalStockItems}</p>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
            <span>Требует внимания</span>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Продажи за неделю */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Продажи за неделю</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={weeklySalesData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value: number) => `${value.toLocaleString()} KZT`} />
              <Legend />
              <Line type="monotone" dataKey="Revenue" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={2} name="Доход" />
              <Line type="monotone" dataKey="Profit" stroke="#82ca9d" strokeWidth={2} name="Прибыль" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Total Money in Stock */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center text-center"
        >
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Общая стоимость склада</h3>
          <DollarSign className="w-16 h-16 text-green-500 mb-4" />
          <p className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">{totalStockValue.toLocaleString()} KZT</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm">Текущая стоимость всех товаров на складе.</p>
        </motion.div>
      </div>

      {/* Top Selling Products and Monthly Sales Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        {/* Top Selling Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Самые продаваемые товары (Топ-5)</h3>
          {topSellingProducts.length > 0 ? (
            <ul className="space-y-3">
              {topSellingProducts.map((item, index) => (
                <li key={item.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
                  <div className="flex items-center">
                    <span className="font-bold text-xl mr-3 text-blue-500">{index + 1}.</span>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{item.productName}</p>
                  </div>
                  <span className="text-lg text-gray-700 dark:text-gray-300">{item.quantity} шт.</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">Нет данных о продаваемых товарах.</p>
          )}
        </motion.div>

        {/* Monthly Sales Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.7 }}
          className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Аналитика продаж (Ежемесячно)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={monthlySalesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value: number) => `${value.toLocaleString()} KZT`} />
              <Legend />
              <Bar dataKey="Revenue" fill={COLORS_CHART[0]} radius={[10, 10, 0, 0]} name="Доход" />
              <Bar dataKey="Profit" fill={COLORS_CHART[1]} radius={[10, 10, 0, 0]} name="Прибыль" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Critical Stock Notifications */}
      {criticalStockCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="bg-red-100 dark:bg-red-900 rounded-xl shadow-lg p-6 mt-6 border border-red-300 dark:border-red-700"
        >
          <h3 className="text-2xl font-semibold text-red-800 dark:text-red-200 mb-4">Важные уведомления о складе</h3>
          <ul className="space-y-2">
            <li className="text-red-600 dark:text-red-400 font-semibold">
              🚨 Внимание: {criticalStockCount} позиций имеют критический остаток на складе!
            </li>
            {inventorySummary.filter(item => item.quantity < item.criticalStock).map(item => (
              <li key={item.id} className="text-red-600 dark:text-red-400 text-sm">
                - {item.productName}: {item.quantity} шт. (критический: {item.criticalStock} шт.)
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
