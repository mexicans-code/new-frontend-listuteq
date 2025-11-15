import { Link, useLocation } from 'react-router-dom';
import { 
    FaHome, 
    FaBuilding, 
    FaBook, 
    FaUsers, 
    FaCog,
    FaChartBar 
} from 'react-icons/fa';

export default function Sidebar({ isAbierto }) {
    const location = useLocation();

    const menuItems = [
        { path: '/dashboard', label: 'Inicio', icon: FaHome },
        { path: '/dashboard/divisiones', label: 'Divisiones', icon: FaBuilding },
        { path: '/dashboard/programas', label: 'Programas', icon: FaBook },
        { path: '/dashboard/usuarios', label: 'Usuarios', icon: FaUsers },
        { path: '/dashboard/materias', label: 'Materias', icon: FaBook },
        { path: '/dashboard/reportes', label: 'Reportes', icon: FaChartBar },
        { path: '/dashboard/configuracion', label: 'Configuración', icon: FaCog },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <aside 
            className={`bg-gray-800 text-white transition-all duration-300 
            ${isAbierto ? 'w-64' : 'w-20'} 
            flex-shrink-0 overflow-y-auto`}
        >
            <div className="p-4 border-b border-gray-700">
                <h2 className={`font-bold text-xl text-center 
                    ${!isAbierto && 'hidden'}`}>
                    Mi Sistema
                </h2>
                {!isAbierto && (
                    <div className="text-center text-2xl">🏫</div>
                )}
            </div>

            <nav className="mt-4">
                <ul className="space-y-2 px-2">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center gap-4 px-4 py-3 rounded-lg 
                                    transition hover:bg-gray-700
                                    ${isActive(item.path) ? 'bg-blue-600' : ''}`}
                                >
                                    <Icon className="text-xl flex-shrink-0" />
                                    <span className={`${!isAbierto && 'hidden'}`}>
                                        {item.label}
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
}
