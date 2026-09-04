import '../../styles/topbar.css';

export function Topbar({ isAdmin, onAdminExit, onNavToggle, onAdminLogin, route, onNavigate }) {
  return (
    <div className="topbar">
      <div className="wrap topbar-inner">
        <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('home'); }} className="brand">
          <div className="brand-mark"></div>
          <div className="brand-text">
            <b>SINDHULI FC CLUBHOUSE</b>
            <span>MANAGE · PLAY · CONNECT</span>
          </div>
        </a>

        {isAdmin ? (
          <div className="topbar-right">
            <span style={{ color: 'var(--bone-dim)', fontSize: '12.5px', marginRight: '6px' }}>Admin Mode</span>
            <button className="btn btn-outline btn-sm" onClick={onAdminExit}>Exit to Site</button>
          </div>
        ) : (
          <div className="topbar-right">
            <nav className="main-nav">
              {['home', 'matches', 'standings', 'players', 'teams', 'competitions', 'news'].map(v => (
                <a key={v} href="#" onClick={(e) => { e.preventDefault(); onNavigate(v); }} className={route.view === v ? 'active' : ''}>
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </a>
              ))}
            </nav>
            <button className="btn btn-gold" onClick={() => onNavigate('admin')}>Manager Login</button>
            <button className="hamburger" onClick={onNavToggle}>☰</button>
          </div>
        )}
      </div>
    </div>
  );
}