import { NavLink, Outlet } from 'react-router-dom'
import { Users, ChefHat } from 'lucide-react'

const navItems = [
    { to: '/users', label: 'Utilisateurs', icon: Users },
    { to: '/cook-requests', label: 'Demandes', icon: ChefHat },
]

export const BackofficeLayout = () => {
    return (
        <div className="flex min-h-screen bg-[#FDF6E7]">
            <aside className="w-56 shrink-0 border-r border-border bg-card">
                <div className="p-6">
                    <span className="text-lg font-bold text-primary">Cook&apos;us</span>
                    <p className="text-xs text-muted-foreground">Backoffice</p>
                </div>
                <nav className="px-3 pb-6">
                    {navItems.map(({ to, label, icon: Icon }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                `flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
                                    isActive
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-foreground hover:bg-primary/10'
                                }`
                            }
                        >
                            <Icon className="h-4 w-4" />
                            {label}
                        </NavLink>
                    ))}
                </nav>
            </aside>

            <div className="flex-1 overflow-auto">
                <Outlet />
            </div>
        </div>
    )
}
