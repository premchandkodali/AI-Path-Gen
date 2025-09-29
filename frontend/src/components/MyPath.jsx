import { Check, Clock, Lock, PlayCircle } from "lucide-react";

const pathSteps = [
  {
    id: 1,
    title: "Foundations of Programming",
    status: "completed",
    modules: [
      { name: "Introduction to Programming", completed: true },
      { name: "Basic Syntax & Logic", completed: true },
      { name: "Problem Solving Techniques", completed: true }
    ]
  },
  {
    id: 2,
    title: "Python for Data Science",
    status: "in-progress",
    modules: [
      { name: "NumPy Basics", completed: true },
      { name: "Pandas DataFrames", completed: false, current: true },
      { name: "Data Visualization", completed: false }
    ]
  },
  {
    id: 3,
    title: "Statistics & Probability",
    status: "upcoming",
    modules: [
      { name: "Descriptive Statistics", completed: false },
      { name: "Probability Distributions", completed: false },
      { name: "Hypothesis Testing", completed: false }
    ]
  },
  {
    id: 4,
    title: "Machine Learning Fundamentals",
    status: "upcoming",
    modules: [
      { name: "Supervised Learning", completed: false },
      { name: "Unsupervised Learning", completed: false },
      { name: "Model Evaluation", completed: false }
    ]
  }
];

const styles = {
  container: {
    padding: '24px',
    animation: 'fadeIn 0.3s ease-out'
  },
  header: {
    marginBottom: '32px'
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
  overviewCard: {
    marginBottom: '32px',
    backgroundColor: 'hsl(0, 0%, 100%)',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px 0 hsl(0 0% 0% / 0.1)',
    border: '1px solid hsl(220, 13%, 91%)'
  },
  overviewTitle: {
    fontWeight: '600',
    fontSize: '18px',
    marginBottom: '16px'
  },
  progressSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '16px'
  },
  progressContainer: {
    flex: 1
  },
  progressLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '14px',
    marginBottom: '8px'
  },
  progressBar: {
    width: '100%',
    backgroundColor: 'hsl(220, 13%, 91%)',
    borderRadius: '9999px',
    height: '12px'
  },
  progressFill: {
    height: '12px',
    borderRadius: '9999px',
    background: 'linear-gradient(135deg, hsl(238, 64%, 59%), hsl(238, 70%, 65%))',
    width: '35%',
    animation: 'progressAnimation 1s ease-out'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
    marginTop: '16px'
  },
  statItem: {
    textAlign: 'center'
  },
  statNumber: {
    fontSize: '24px',
    fontWeight: 'bold'
  },
  statLabel: {
    fontSize: '14px',
    color: 'hsl(215, 16%, 47%)'
  },
  timelineContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  stepContainer: {
    position: 'relative'
  },
  timelineConnector: {
    position: 'absolute',
    left: '24px',
    top: '64px',
    width: '1px',
    height: '80px',
    backgroundColor: 'hsl(220, 13%, 91%)'
  },
  stepCard: {
    backgroundColor: 'hsl(0, 0%, 100%)',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px 0 hsl(0 0% 0% / 0.1)',
    border: '1px solid hsl(220, 13%, 91%)'
  },
  stepCardInProgress: {
    border: '2px solid hsl(238, 64%, 59%, 0.2)'
  },
  stepContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px'
  },
  statusIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  stepDetails: {
    flex: 1
  },
  stepHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '12px'
  },
  stepTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'hsl(222, 47%, 11%)'
  },
  statusBadge: {
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: '500'
  },
  modulesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  moduleItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px',
    borderRadius: '8px'
  },
  moduleIcon: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  moduleName: {
    fontWeight: '500'
  },
  continueButton: {
    marginLeft: 'auto',
    backgroundColor: 'hsl(238, 64%, 59%)',
    color: 'white',
    padding: '4px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  upcomingMessage: {
    marginTop: '16px',
    padding: '12px',
    backgroundColor: 'hsl(220, 13%, 91%, 0.5)',
    borderRadius: '8px'
  }
};

const MyPath = () => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return { icon: Check, bgColor: 'hsl(142, 71%, 45%)', color: 'white' };
      case 'in-progress':
        return { icon: Clock, bgColor: 'hsl(238, 64%, 59%)', color: 'white' };
      default:
        return { icon: Lock, bgColor: 'hsl(220, 13%, 91%)', color: 'hsl(215, 16%, 47%)' };
    }
  };

  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'completed':
        return { backgroundColor: 'hsl(142, 71%, 45%, 0.1)', color: 'hsl(142, 71%, 45%)' };
      case 'in-progress':
        return { backgroundColor: 'hsl(238, 64%, 59%, 0.1)', color: 'hsl(238, 64%, 59%)' };
      default:
        return { backgroundColor: 'hsl(220, 13%, 91%)', color: 'hsl(215, 16%, 47%)' };
    }
  };

  const getModuleStyle = (module) => {
    if (module.current) {
      return {
        backgroundColor: 'hsl(238, 64%, 59%, 0.05)',
        border: '1px solid hsl(238, 64%, 59%, 0.2)'
      };
    }
    return {
      backgroundColor: 'hsl(220, 13%, 91%, 0.3)'
    };
  };

  const getModuleIconStyle = (module) => {
    if (module.completed) {
      return { backgroundColor: 'hsl(142, 71%, 45%)', color: 'white' };
    }
    if (module.current) {
      return { backgroundColor: 'hsl(238, 64%, 59%)', color: 'white' };
    }
    return { backgroundColor: 'hsl(220, 13%, 91%)', color: 'hsl(215, 16%, 47%)' };
  };

  const getModuleTextColor = (module) => {
    if (module.current) return 'hsl(238, 64%, 59%)';
    if (module.completed) return 'hsl(222, 47%, 11%)';
    return 'hsl(215, 16%, 47%)';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Your Path to Becoming a Data Analyst</h1>
        <p style={styles.subtitle}>Follow your personalized learning journey designed by AI</p>
      </div>

      {/* Progress Overview */}
      <div style={styles.overviewCard}>
        <h3 style={styles.overviewTitle}>Overall Progress</h3>
        <div style={styles.progressSection}>
          <div style={styles.progressContainer}>
            <div style={styles.progressLabels}>
              <span style={{color: 'hsl(215, 16%, 47%)'}}>Data Analyst Career Path</span>
              <span style={{fontWeight: '600', color: 'hsl(238, 64%, 59%)'}}>35% Complete</span>
            </div>
            <div style={styles.progressBar}>
              <div style={styles.progressFill}></div>
            </div>
          </div>
        </div>
        <div style={styles.statsGrid}>
          <div style={styles.statItem}>
            <div style={{...styles.statNumber, color: 'hsl(142, 71%, 45%)'}}>1</div>
            <div style={styles.statLabel}>Completed</div>
          </div>
          <div style={styles.statItem}>
            <div style={{...styles.statNumber, color: 'hsl(238, 64%, 59%)'}}>1</div>
            <div style={styles.statLabel}>In Progress</div>
          </div>
          <div style={styles.statItem}>
            <div style={{...styles.statNumber, color: 'hsl(215, 16%, 47%)'}}>2</div>
            <div style={styles.statLabel}>Upcoming</div>
          </div>
        </div>
      </div>

      {/* Learning Path Timeline */}
      <div style={styles.timelineContainer}>
        {pathSteps.map((step, index) => {
          const statusIcon = getStatusIcon(step.status);
          const StatusIconComponent = statusIcon.icon;
          
          return (
            <div key={step.id} style={styles.stepContainer}>
              {/* Timeline connector */}
              {index < pathSteps.length - 1 && (
                <div style={styles.timelineConnector}></div>
              )}
              
              <div style={{
                ...styles.stepCard,
                ...(step.status === 'in-progress' ? styles.stepCardInProgress : {})
              }}>
                <div style={styles.stepContent}>
                  {/* Status Icon */}
                  <div style={{
                    ...styles.statusIcon,
                    backgroundColor: statusIcon.bgColor,
                    color: statusIcon.color
                  }}>
                    <StatusIconComponent size={24} />
                  </div>

                  <div style={styles.stepDetails}>
                    <div style={styles.stepHeader}>
                      <h3 style={styles.stepTitle}>{step.title}</h3>
                      <span style={{
                        ...styles.statusBadge,
                        ...getStatusBadgeStyle(step.status)
                      }}>
                        {step.status === 'completed' ? 'Completed' : 
                         step.status === 'in-progress' ? 'In Progress' : 'Locked'}
                      </span>
                    </div>

                    {/* Modules */}
                    <div style={styles.modulesContainer}>
                      {step.modules.map((module, moduleIndex) => (
                        <div key={moduleIndex} style={{
                          ...styles.moduleItem,
                          ...getModuleStyle(module)
                        }}>
                          <div style={{
                            ...styles.moduleIcon,
                            ...getModuleIconStyle(module)
                          }}>
                            {module.completed ? (
                              <Check size={16} />
                            ) : module.current ? (
                              <PlayCircle size={16} />
                            ) : (
                              <div style={{
                                width: '8px',
                                height: '8px',
                                backgroundColor: 'currentColor',
                                borderRadius: '50%'
                              }}></div>
                            )}
                          </div>
                          <span style={{
                            ...styles.moduleName,
                            color: getModuleTextColor(module)
                          }}>
                            {module.name}
                          </span>
                          {module.current && (
                            <button 
                              style={styles.continueButton}
                              onMouseOver={(e) => e.target.style.backgroundColor = 'hsl(238, 64%, 59%, 0.9)'}
                              onMouseOut={(e) => e.target.style.backgroundColor = 'hsl(238, 64%, 59%)'}
                            >
                              Continue
                            </button>
                          )}
                        </div>
                      ))}
                    </div>

                    {step.status === 'upcoming' && (
                      <div style={styles.upcomingMessage}>
                        <p style={{fontSize: '14px', color: 'hsl(215, 16%, 47%)', margin: 0}}>
                          Complete the previous module to unlock this section
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyPath;