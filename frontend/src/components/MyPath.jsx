import { Check, Clock, Lock, PlayCircle, Target, BookOpen } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";

// Path steps will be loaded from NSQF service
const initialPathSteps = [];

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
  },
  nsqfForm: {
    backgroundColor: 'hsl(0, 0%, 100%)',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 1px 3px 0 hsl(0 0% 0% / 0.1)',
    border: '1px solid hsl(220, 13%, 91%)',
    marginBottom: '32px'
  },
  formHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '24px'
  },
  formTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'hsl(222, 47%, 11%)',
    margin: 0,
    marginBottom: '4px'
  },
  formSubtitle: {
    color: 'hsl(215, 16%, 47%)',
    margin: 0,
    fontSize: '14px'
  },
  formGroup: {
    marginBottom: '20px',
    flex: 1
  },
  formRow: {
    display: 'flex',
    gap: '16px'
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: 'hsl(222, 47%, 11%)'
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid hsl(220, 13%, 91%)',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '12px',
    border: '1px solid hsl(220, 13%, 91%)',
    borderRadius: '8px',
    fontSize: '14px',
    minHeight: '80px',
    resize: 'vertical',
    boxSizing: 'border-box'
  },
  select: {
    width: '100%',
    padding: '12px',
    border: '1px solid hsl(220, 13%, 91%)',
    borderRadius: '8px',
    fontSize: '14px',
    backgroundColor: 'white',
    boxSizing: 'border-box'
  },
  generateBtn: {
    backgroundColor: 'hsl(238, 64%, 59%)',
    color: 'white',
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    margin: '0 auto'
  },
  nsqfInfo: {
    backgroundColor: 'hsl(238, 64%, 97%)',
    padding: '16px',
    borderRadius: '8px',
    marginBottom: '24px',
    border: '1px solid hsl(238, 64%, 90%)'
  },
  resetBtn: {
    backgroundColor: 'transparent',
    color: 'hsl(238, 64%, 59%)',
    padding: '8px 16px',
    border: '1px solid hsl(238, 64%, 59%)',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    float: 'right'
  },
  nsqfBadge: {
    backgroundColor: 'hsl(238, 64%, 97%)',
    color: 'hsl(238, 64%, 59%)',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '600',
    marginLeft: '8px'
  },
  durationBadge: {
    backgroundColor: 'hsl(220, 13%, 91%)',
    color: 'hsl(215, 16%, 47%)',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    marginLeft: '8px'
  },
  stepDescription: {
    fontSize: '14px',
    color: 'hsl(215, 16%, 47%)',
    margin: '8px 0',
    lineHeight: '1.4'
  },
  stepFocus: {
    fontSize: '14px',
    color: 'hsl(222, 47%, 11%)',
    margin: '8px 0',
    lineHeight: '1.4'
  },
  pathContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  pathStep: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px'
  },
  stepIndicator: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '8px'
  },
  stepIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  connector: {
    width: '2px',
    height: '60px',
    backgroundColor: 'hsl(220, 13%, 91%)',
    marginTop: '8px'
  },
  stepContent: {
    flex: 1
  },
  stepCard: {
    backgroundColor: 'white',
    border: '1px solid hsl(220, 13%, 91%)',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  },
  stepHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px'
  },
  stepMeta: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '8px',
    flexWrap: 'wrap'
  },
  actionButton: {
    backgroundColor: 'hsl(238, 64%, 59%)',
    color: 'white',
    padding: '8px 16px',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  modulesSection: {
    marginTop: '16px'
  },
  modulesTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'hsl(222, 47%, 11%)',
    marginBottom: '12px'
  },
  modulesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  moduleContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  moduleInfo: {
    flex: 1
  },
  currentIndicator: {
    fontSize: '12px',
    color: 'hsl(238, 64%, 59%)',
    fontWeight: '500'
  }
};

const MyPath = () => {
  const [pathSteps, setPathSteps] = useState(initialPathSteps);
  const [nsqfData, setNsqfData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showNsqfForm, setShowNsqfForm] = useState(!localStorage.getItem('userNsqfData'));

  useEffect(() => {
    // Load saved NSQF data if available
    const savedData = localStorage.getItem('userNsqfData');
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setNsqfData(parsedData);
      generatePathFromNsqf(parsedData);
    }
  }, []);

  const generatePathFromNsqf = (nsqfPathway) => {
    if (!nsqfPathway || !nsqfPathway.learning_pathway) return;

    const steps = nsqfPathway.learning_pathway.map((phase, index) => ({
      id: index + 1,
      title: phase.phase,
      nsqf_level: phase.nsqf_level,
      description: phase.description,
      focus: phase.focus,
      duration: phase.duration,
      status: index === 0 ? 'in-progress' : 'upcoming',
      modules: [
        { name: `${phase.focus} - Foundation`, completed: index === 0 },
        { name: `${phase.focus} - Intermediate`, completed: false, current: index === 0 },
        { name: `${phase.focus} - Advanced`, completed: false }
      ]
    }));

    setPathSteps(steps);
  };

  const handleNsqfSubmit = async (formData) => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/nsqf/learning-pathway', formData);
      
      if (response.data.success) {
        const pathwayData = response.data.pathway;
        setNsqfData(pathwayData);
        localStorage.setItem('userNsqfData', JSON.stringify(pathwayData));
        generatePathFromNsqf(pathwayData);
        setShowNsqfForm(false);
      }
    } catch (error) {
      console.error('Error generating pathway:', error);
      alert('Failed to generate learning pathway. Please try again.');
    }
    setLoading(false);
  };

  const resetPath = () => {
    localStorage.removeItem('userNsqfData');
    setNsqfData(null);
    setPathSteps([]);
    setShowNsqfForm(true);
  };

  const NSQFForm = () => {
    const [formData, setFormData] = useState({
      career_aspirations: '',
      learning_pace: 'medium'
    });

    const handleInputChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      handleNsqfSubmit(formData);
    };

    return (
      <div style={styles.nsqfForm}>
        <div style={styles.formHeader}>
          <Target size={32} style={{ color: 'hsl(238, 64%, 59%)' }} />
          <div>
            <h3 style={styles.formTitle}>Generate Your Learning Path</h3>
            <p style={styles.formSubtitle}>
              Tell us about your background to get personalized NSQF-based recommendations
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Career Aspirations</label>
            <input
              type="text"
              name="career_aspirations"
              value={formData.career_aspirations}
              onChange={handleInputChange}
              placeholder="e.g., Software Developer, Data Scientist"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Learning Pace</label>
              <select
                name="learning_pace"
                value={formData.learning_pace}
                onChange={handleInputChange}
                style={styles.select}
              >
                <option value="slow">Slow (Part-time)</option>
                <option value="medium">Medium (Balanced)</option>
                <option value="fast">Fast (Intensive)</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={styles.generateBtn}
          >
            <Target size={20} />
            {loading ? 'Generating Path...' : 'Generate My Learning Path'}
          </button>
        </form>
      </div>
    );
  };
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
      {showNsqfForm ? (
        <>
          <div style={styles.header}>
            <h1 style={styles.title}>Create Your Learning Path</h1>
            <p style={styles.subtitle}>Get AI-powered recommendations based on NSQF standards</p>
          </div>
          <NSQFForm />
        </>
      ) : (
        <>
          <div style={styles.header}>
            <h1 style={styles.title}>
              {nsqfData ? `Your NSQF Level ${nsqfData.predicted_level} Learning Path` : 'Your Learning Path'}
            </h1>
            <p style={styles.subtitle}>Follow your personalized learning journey designed by AI</p>
            <button onClick={resetPath} style={styles.resetBtn}>
              Reset Path
            </button>
          </div>

          {/* NSQF Info Display */}
          {nsqfData && (
            <div style={styles.nsqfInfo}>
              <h4 style={{ margin: '0 0 8px 0', color: 'hsl(238, 64%, 59%)' }}>
                NSQF Level {nsqfData.predicted_level}: {nsqfData.level_info.title}
              </h4>
              <p style={{ margin: '0 0 12px 0', fontSize: '14px' }}>
                {nsqfData.level_info.description}
              </p>
              <div style={{ fontSize: '12px', color: 'hsl(215, 16%, 47%)' }}>
                <strong>Focus Areas:</strong> {nsqfData.recommendations.immediate_focus.join(', ')}
              </div>
            </div>
          )}

          {/* Progress Overview */}
          <div style={styles.overviewCard}>
            <h3 style={styles.overviewTitle}>Overall Progress</h3>
            <div style={styles.progressSection}>
              <div style={styles.progressContainer}>
                <div style={styles.progressLabels}>
                  <span style={{color: 'hsl(215, 16%, 47%)'}}>
                    {nsqfData ? `NSQF Level ${nsqfData.predicted_level} Career Path` : 'Learning Path'}
                  </span>
                  <span style={{fontWeight: '600', color: 'hsl(238, 64%, 59%)'}}>
                    {Math.round((pathSteps.filter(step => step.status === 'completed').length / Math.max(pathSteps.length, 1)) * 100)}% Complete
                  </span>
                </div>
                <div style={styles.progressBar}>
                  <div style={{
                    ...styles.progressFill,
                    width: `${(pathSteps.filter(step => step.status === 'completed').length / Math.max(pathSteps.length, 1)) * 100}%`
                  }}></div>
                </div>
              </div>
            </div>
            <div style={styles.statsGrid}>
              <div style={styles.statItem}>
                <div style={{...styles.statNumber, color: 'hsl(142, 71%, 45%)'}}>
                  {pathSteps.filter(step => step.status === 'completed').length}
                </div>
                <div style={styles.statLabel}>Completed</div>
              </div>
              <div style={styles.statItem}>
                <div style={{...styles.statNumber, color: 'hsl(238, 64%, 59%)'}}>
                  {pathSteps.filter(step => step.status === 'in-progress').length}
                </div>
                <div style={styles.statLabel}>In Progress</div>
              </div>
              <div style={styles.statItem}>
                <div style={{...styles.statNumber, color: 'hsl(215, 16%, 47%)'}}>
                  {pathSteps.filter(step => step.status === 'upcoming').length}
                </div>
                <div style={styles.statLabel}>Upcoming</div>
              </div>
              <div style={styles.statItem}>
                <div style={{...styles.statNumber, color: 'hsl(222, 47%, 11%)'}}>
                  {pathSteps.length}
                </div>
                <div style={styles.statLabel}>Total Phases</div>
              </div>
            </div>
          </div>

          {/* Learning Path Steps */}
          <div style={styles.pathContainer}>
            {pathSteps.length === 0 ? (
              <div style={styles.nsqfInfo}>
                <p>No learning path generated yet. Please use the form above to create your personalized path.</p>
              </div>
            ) : (
              pathSteps.map((step, index) => {
                const StatusIcon = getStatusIcon(step.status).icon;
                const iconStyle = getStatusIcon(step.status);
                
                return (
                  <div key={step.id} style={styles.pathStep}>
                    <div style={styles.stepIndicator}>
                      <div style={{
                        ...styles.stepIcon,
                        backgroundColor: iconStyle.bgColor,
                        color: iconStyle.color
                      }}>
                        <StatusIcon size={20} />
                      </div>
                      {index < pathSteps.length - 1 && <div style={styles.connector}></div>}
                    </div>
                    
                    <div style={styles.stepContent}>
                      <div style={styles.stepCard}>
                        <div style={styles.stepHeader}>
                          <div>
                            <h3 style={styles.stepTitle}>{step.title}</h3>
                            <div style={styles.stepMeta}>
                              <span style={{...styles.statusBadge, ...getStatusBadgeStyle(step.status)}}>
                                {step.status.replace('-', ' ')}
                              </span>
                              {step.nsqf_level && (
                                <span style={styles.nsqfBadge}>
                                  NSQF Level {step.nsqf_level}
                                </span>
                              )}
                              {step.duration && (
                                <span style={styles.durationBadge}>
                                  {step.duration}
                                </span>
                              )}
                            </div>
                            {step.description && (
                              <p style={styles.stepDescription}>{step.description}</p>
                            )}
                            {step.focus && (
                              <p style={styles.stepFocus}>
                                <strong>Focus:</strong> {step.focus}
                              </p>
                            )}
                          </div>
                          
                          {step.status !== 'upcoming' && (
                            <button style={styles.actionButton}>
                              <PlayCircle size={16} />
                              {step.status === 'completed' ? 'Review' : 'Continue'}
                            </button>
                          )}
                        </div>

                        <div style={styles.modulesSection}>
                          <h4 style={styles.modulesTitle}>Learning Modules</h4>
                          <div style={styles.modulesList}>
                            {step.modules.map((module, moduleIndex) => (
                              <div key={moduleIndex} style={{
                                ...styles.moduleItem,
                                ...getModuleStyle(module)
                              }}>
                                <div style={styles.moduleContent}>
                                  <div style={{
                                    ...styles.moduleIcon,
                                    backgroundColor: module.completed ? 'hsl(142, 71%, 45%)' : 
                                                     module.current ? 'hsl(238, 64%, 59%)' : 'hsl(220, 13%, 91%)'
                                  }}>
                                    {module.completed ? '✓' : moduleIndex + 1}
                                  </div>
                                  <div style={styles.moduleInfo}>
                                    <div style={{
                                      ...styles.moduleName,
                                      color: getModuleTextColor(module)
                                    }}>
                                      {module.name}
                                    </div>
                                    {module.current && (
                                      <div style={styles.currentIndicator}>Currently studying</div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>

                          {step.status === 'upcoming' && (
                            <div style={styles.upcomingMessage}>
                              <p style={{fontSize: '14px', color: 'hsl(215, 16%, 47%)', margin: 0}}>
                                Complete the previous phase to unlock this section
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MyPath;