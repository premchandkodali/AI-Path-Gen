import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'hsl(220, 14%, 96%)'
  },
  content: {
    textAlign: 'center'
  },
  heading: {
    marginBottom: '1rem',
    fontSize: '2.25rem',
    fontWeight: 'bold',
    color: 'hsl(222, 47%, 11%)'
  },
  text: {
    marginBottom: '1rem',
    fontSize: '1.25rem',
    color: 'hsl(215, 16%, 47%)'
  },
  link: {
    color: 'hsl(238, 64%, 59%)',
    textDecoration: 'underline',
    cursor: 'pointer',
    transition: 'color 0.3s ease'
  }
};

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.heading}>404</h1>
        <p style={styles.text}>Oops! Page not found</p>
        <a 
          href="/" 
          style={styles.link}
          onMouseOver={(e) => e.target.style.color = 'hsl(238, 70%, 65%)'}
          onMouseOut={(e) => e.target.style.color = 'hsl(238, 64%, 59%)'}
        >
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;