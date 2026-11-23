import { BookOpen, LayoutDashboard, LogOut, MessageSquare, PlusCircle } from "lucide-react";
import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
    const Links = [
        {
            name: "Dashboard",
            path: "/author/dashboard",
            icon: LayoutDashboard,
        },
        {
            name: "My Books",
            path: "/author/book",
            icon: BookOpen,
        },
        {
            name: "My Tickets",
            path: "/author/ticket",
            icon: MessageSquare,
        },
        {
            name: "Create Ticket",
            path: "/author/createticket",
            icon: PlusCircle,
        },

    ]
    return (
        <>
            <aside className="sidebar">
                <div className="sidebar-brand">
                    <div className="brand-icon">B</div>
                    <div>
                        <h2>BookLeaf</h2>
                        <p>Author Portal</p>
                    </div>
                </div>

                <p className="sidebar-heading">WORKSPACE</p>
                {Links.map(({ name, path, icon: Icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) =>
                            `sidebar-link ${isActive ? "active" : ""}`
                        }
                    >
                        <Icon size={19} />

                        <span>{name}</span>
                    </NavLink>
                ))}
                <div className="sidebar-bottom">
                    <NavLink to="/" className="sidebar-link">
                        <LogOut size={19} />
                        <span>Logout</span>
                    </NavLink>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;