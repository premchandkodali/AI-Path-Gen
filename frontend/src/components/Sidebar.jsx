import { Home, Map, BookOpen, Compass, Target, Briefcase, User } from "lucide-react";

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'myPath', label: 'My Path', icon: Map },
  { id: 'courses', label: 'Courses', icon: BookOpen },
  { id: 'explore', label: 'Explore', icon: Compass },
  { id: 'assessments', label: 'Assessments', icon: Target },
  { id: 'careerHub', label: 'Career Hub', icon: Briefcase },
  { id: 'profile', label: 'My Profile', icon: User },
];

const styles = {
  container: {
    position: 'fixed',
    left: 0,
    top: 0,
    height: '100%',
    width: '256px',
    backgroundColor: 'hsl(215, 25%, 20%)',
    borderRight: '1px solid hsl(220, 13%, 91%)',
    animation: 'slideIn 0.3s ease-out'
  },
  content: {
    padding: '24px'
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '32px'
  },
  logo: {
    width: '40px',
    height: '40px',
    background: 'linear-gradient(135deg, hsl(238, 64%, 59%), hsl(238, 70%, 65%))',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  logoText: {
    width: '24px',
    height: '24px',
    color: 'white',
    fontWeight: 'bold'
  },
  title: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'hsl(220, 14%, 96%)'
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  navButton: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '8px',
    transition: 'all 0.2s',
    textAlign: 'left',
    border: 'none',
    cursor: 'pointer'
  },
  navButtonActive: {
    backgroundColor: 'hsl(238, 64%, 59%)',
    color: 'white',
    boxShadow: '0 10px 15px -3px hsl(0 0% 0% / 0.1)'
  },
  navButtonInactive: {
    color: 'hsl(220, 14%, 96%)',
    backgroundColor: 'transparent'
  },
  navButtonInactiveHover: {
    backgroundColor: 'hsl(238, 64%, 59%, 0.1)',
    color: 'hsl(238, 64%, 59%)'
  },
  navButtonText: {
    fontWeight: '500'
  }
};

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.header}>
          <div style={styles.logo}>
            <div style={styles.logoText}>SP</div>
          </div>
          <h1 style={styles.title}>SkillPath AI</h1>
        </div>
        
        <nav style={styles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  ...styles.navButton,
                  ...(isActive ? styles.navButtonActive : styles.navButtonInactive)
                }}
                onMouseOver={(e) => {
                  if (!isActive) {
                    Object.assign(e.target.style, styles.navButtonInactiveHover);
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive) {
                    Object.assign(e.target.style, styles.navButtonInactive);
                  }
                }}
              >
                <Icon size={20} />
                <span style={styles.navButtonText}>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;