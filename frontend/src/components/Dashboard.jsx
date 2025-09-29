import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Award, BookOpen, TrendingUp } from "lucide-react";
import heroImage from "@/assets/hero-learning.jpg";

const styles = {
  container: {
    padding: '24px',
    animation: 'fadeIn 0.3s ease-out'
  },
  header: {
    marginBottom: '32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: {
    fontSize: '30px',
    fontWeight: 'bold',
    color: 'hsl(222, 47%, 11%)',
    marginBottom: '8px'
  },
  subtitle: {
    color: 'hsl(215, 16%, 47%)'
  },
  heroSection: {
    marginBottom: '32px',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 10px 15px -3px hsl(0 0% 0% / 0.1)'
  },
  heroContent: {
    position: 'relative',
    height: '192px',
    background: `linear-gradient(135deg, rgba(79, 70, 229, 0.9), rgba(99, 102, 241, 0.8)), url(${heroImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '32px'
  },
  heroText: {
    color: 'white'
  },
  heroTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '8px'
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: '16px'
  },
  heroButton: {
    backgroundColor: 'white',
    color: 'hsl(238, 64%, 59%)',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: '600',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px'
  },
  card: {
    backgroundColor: 'hsl(0, 0%, 100%)',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px 0 hsl(0 0% 0% / 0.1)',
    border: '1px solid hsl(220, 13%, 91%)'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px'
  },
  cardIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  cardTitle: {
    fontWeight: '600',
    color: 'hsl(222, 47%, 11%)'
  },
  cardContentTitle: {
    fontWeight: 'bold',
    fontSize: '18px',
    marginBottom: '8px'
  },
  cardContentSubtitle: {
    color: 'hsl(215, 16%, 47%)',
    fontSize: '14px',
    marginBottom: '16px'
  },
  button: {
    width: '100%',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  primaryButton: {
    backgroundColor: 'hsl(238, 64%, 59%)',
    color: 'white'
  },
  logoutButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '0.375rem',
    cursor: 'pointer'
  },
  progressBar: {
    width: '100%',
    backgroundColor: 'hsl(220, 13%, 91%)',
    borderRadius: '9999px',
    height: '8px'
  },
  progressFill: {
    height: '8px',
    borderRadius: '9999px',
    background: 'linear-gradient(135deg, hsl(142, 71%, 45%), hsl(150, 60%, 50%))'
  },
  badgeContainer: {
    display: 'flex',
    gap: '12px',
    marginBottom: '16px'
  },
  badge: {
    width: '48px',
    height: '48px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  activitySection: {
    marginTop: '32px',
    backgroundColor: 'hsl(0, 0%, 100%)',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px 0 hsl(0 0% 0% / 0.1)',
    border: '1px solid hsl(220, 13%, 91%)'
  },
  activityTitle: {
    fontWeight: '600',
    fontSize: '18px',
    marginBottom: '16px'
  },
  activityList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  activityItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '12px',
    backgroundColor: 'hsl(220, 13%, 91%, 0.5)',
    borderRadius: '8px'
  },
  activityIcon: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  activityContent: {
    flex: 1
  },
  activityItemTitle: {
    fontWeight: '500'
  },
  activityItemSubtitle: {
    fontSize: '14px',
    color: 'hsl(215, 16%, 47%)'
  }
};

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Dashboard</h1>
            <p style={styles.subtitle}>Welcome back, let's continue learning!</p>
          </div>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout
          </button>
        </div>

        <div style={styles.heroSection}>
          <div style={styles.heroContent}>
            <div style={styles.heroText}>
              <h2 style={styles.heroTitle}>Master Your Next Skill</h2>
              <p style={styles.heroSubtitle}>Explore new courses and continue your learning journey.</p>
            </div>
            <button style={styles.heroButton}>Explore Courses</button>
          </div>
        </div>

        <div style={styles.grid}>
          {/* Up Next Card */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={{...styles.cardIcon, backgroundColor: 'hsl(238, 64%, 59%, 0.1)'}}>
                <Play style={{width: '20px', height: '20px', color: 'hsl(238, 64%, 59%)'}} />
              </div>
              <h3 style={styles.cardTitle}>Up Next</h3>
            </div>
            <h4 style={styles.cardContentTitle}>Introduction to Python</h4>
            <p style={styles.cardContentSubtitle}>Chapter 1: Variables and Data Types</p>
            <button style={{...styles.button, ...styles.primaryButton}}>
              Continue Learning
            </button>
          </div>

          {/* Path Progress Card */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={{...styles.cardIcon, backgroundColor: 'hsl(142, 71%, 45%, 0.1)'}}>
                <TrendingUp style={{width: '20px', height: '20px', color: 'hsl(142, 71%, 45%)'}} />
              </div>
              <h3 style={styles.cardTitle}>Path Progress</h3>
            </div>
            <h4 style={styles.cardContentTitle}>Data Analyst Career Path</h4>
            <div style={{marginBottom: '16px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px'}}>
                <span style={{color: 'hsl(215, 16%, 47%)'}}>Progress</span>
                <span style={{fontWeight: '600', color: 'hsl(142, 71%, 45%)'}}>35% Complete</span>
              </div>
              <div style={styles.progressBar}>
                <div style={{...styles.progressFill, width: '35%'}}></div>
              </div>
            </div>
            <p style={styles.cardContentSubtitle}>3 of 8 modules completed</p>
          </div>

          {/* Achievements Card */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={{...styles.cardIcon, backgroundColor: 'hsl(38, 92%, 50%, 0.1)'}}>
                <Award style={{width: '20px', height: '20px', color: 'hsl(38, 92%, 50%)'}} />
              </div>
              <h3 style={styles.cardTitle}>Recent Achievements</h3>
            </div>
            <div style={styles.badgeContainer}>
              <div style={{...styles.badge, background: 'linear-gradient(135deg, hsl(238, 64%, 59%), hsl(238, 70%, 65%))'}}>
                <Award style={{width: '24px', height: '24px', color: 'white'}} />
              </div>
              <div style={{...styles.badge, background: 'linear-gradient(135deg, hsl(142, 71%, 45%), hsl(150, 60%, 50%))'}}>
                <BookOpen style={{width: '24px', height: '24px', color: 'white'}} />
              </div>
            </div>
            <p style={styles.cardContentSubtitle}>First Python Program & Data Types Master</p>
          </div>

          {/* Quick Recommendations Card */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <div style={{...styles.cardIcon, backgroundColor: 'hsl(221, 83%, 53%, 0.1)'}}>
                <BookOpen style={{width: '20px', height: '20px', color: 'hsl(221, 83%, 53%)'}} />
              </div>
              <h3 style={styles.cardTitle}>Recommended</h3>
            </div>
            <h4 style={styles.cardContentTitle}>SQL Fundamentals</h4>
            <p style={styles.cardContentSubtitle}>Perfect next step for data analysis</p>
            <button style={{...styles.button, backgroundColor: 'hsl(221, 83%, 53%)', color: 'white'}}>
              View Course
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={styles.activitySection}>
          <h3 style={styles.activityTitle}>Recent Activity</h3>
          <div style={styles.activityList}>
            <div style={styles.activityItem}>
              <div style={{...styles.activityIcon, backgroundColor: 'hsl(142, 71%, 45%)'}}>
                <Award style={{width: '16px', height: '16px', color: 'white'}} />
              </div>
              <div style={styles.activityContent}>
                <p style={styles.activityItemTitle}>Completed: Python Basics Assessment</p>
                <p style={styles.activityItemSubtitle}>Score: 85% • 2 hours ago</p>
              </div>
            </div>
            <div style={styles.activityItem}>
              <div style={{...styles.activityIcon, backgroundColor: 'hsl(238, 64%, 59%)'}}>
                <Play style={{width: '16px', height: '16px', color: 'white'}} />
              </div>
              <div style={styles.activityContent}>
                <p style={styles.activityItemTitle}>Watched: Data Types in Python</p>
                <p style={styles.activityItemSubtitle}>15 min lesson • Yesterday</p>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};

export default Dashboard;