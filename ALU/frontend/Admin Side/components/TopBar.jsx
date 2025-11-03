import PropTypes from "prop-types";
import {
  Bell,
  Search,
  ShieldCheck,
  Sparkles,
  Menu,
  UserCircle,
} from "lucide-react";
import "../styles/admin-base.css";

export default function TopBar({ onToggleSidebar }) {
  return (
    <header className="admin-topbar">
      <button
        type="button"
        className="admin-topbar__icon is-mobile"
        onClick={onToggleSidebar}
        aria-label="Toggle navigation"
      >
        <Menu size={18} />
      </button>
      <div className="admin-topbar__search">
        <Search size={16} />
        <input type="search" placeholder="Search tickets, members, files" />
      </div>
      <div className="admin-topbar__right">
        <span className="admin-topbar__shortcut">
          <ShieldCheck size={16} /> Secure channel active
        </span>
        <button type="button" className="admin-topbar__icon" aria-label="AI suggestions">
          <Sparkles size={18} />
        </button>
        <button type="button" className="admin-topbar__icon" aria-label="Notifications">
          <Bell size={18} />
          <span className="admin-badge is-critical">3</span>
        </button>
        <div className="admin-topbar__profile">
          <UserCircle size={32} />
          <div>
            <strong>Patricia Reyes</strong>
            <span>Admin Supervisor</span>
          </div>
        </div>
      </div>
    </header>
  );
}

TopBar.propTypes = {
  onToggleSidebar: PropTypes.func,
};
