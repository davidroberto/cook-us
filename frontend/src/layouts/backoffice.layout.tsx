import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { Users, ChefHat, LogOut } from "lucide-react";
import { useAuth } from "@src/contexts/useAuth";

const navItems = [
  { to: "/users", label: "Utilisateurs", icon: Users },
  { to: "/cook-requests", label: "Demandes", icon: ChefHat },
];

export const BackofficeLayout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#FDF6E7]">
      <aside className="w-56 shrink-0 border-r border-border/30 bg-card flex flex-col sticky top-0 h-screen">
        <div className="p-6">
          <span className="text-lg font-bold text-primary">Cook&apos;us</span>
          <p className="text-xs text-muted-foreground">Backoffice</p>
        </div>
        <nav className="px-3 flex-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-primary/10"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};
