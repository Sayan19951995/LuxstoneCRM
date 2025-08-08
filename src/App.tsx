import { Outlet, NavLink } from "react-router-dom";

export default function App() {
  const tabs = [
    { to: "/", label: "Дашборд" },
    { to: "/sales", label: "Продажи" },
    { to: "/inventory", label: "Склад" },
    { to: "/in-transit", label: "В пути" },
    { to: "/materials", label: "Материалы" },
    { to: "/reports", label: "Отчёты" },
    { to: "/settings", label: "Настройки" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-5xl mx-auto pb-16">
        <Outlet />
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t">
        <div className="max-w-5xl mx-auto flex overflow-auto">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.to === "/"}
              className={({ isActive }) =>
                `px-3 py-3 text-sm whitespace-nowrap ${
                  isActive ? "bg-black text-white" : "text-black"
                }`
              }
            >
              {t.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
