import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";
import MyPath from "@/components/MyPath";
import Courses from "@/components/Courses";
import Explore from "@/components/Explore";
import Assessments from "@/components/Assessments";
import CareerHub from "@/components/CareerHub";
import Profile from "@/components/Profile";

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: 'hsl(220, 14%, 96%)'
  },
  main: {
    flex: 1,
    marginLeft: '256px',
    minHeight: '100vh'
  }
};

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'myPath':
        return <MyPath />;
      case 'courses':
        return <Courses />;
      case 'explore':
        return <Explore />;
      case 'assessments':
        return <Assessments />;
      case 'careerHub':
        return <CareerHub />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div style={styles.container}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main style={styles.main}>
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;