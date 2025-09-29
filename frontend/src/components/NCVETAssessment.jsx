import React, { useState, useEffect } from 'react';
import { Target, Award, CheckCircle, Clock, BookOpen, FileText, Users, Star } from 'lucide-react';
import axios from 'axios';

const NCVETAssessment = () => {
  const [assessments, setAssessments] = useState([]);
  const [qualityMetrics, setQualityMetrics] = useState(null);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQualityMetrics();
    loadNCVETAssessments();
  }, []);

  const fetchQualityMetrics = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/ncvet/quality-metrics');
      if (response.data.success) {
        setQualityMetrics(response.data.metrics);
      }
    } catch (error) {
      console.error('Error fetching quality metrics:', error);
    }
  };

  const loadNCVETAssessments = () => {
    // NCVET-compliant assessment structure
    const ncvetAssessments = [
      {
        id: 'ncvet-001',
        title: 'NSQF Level 5 - Web Development Competency Assessment',
        description: 'Comprehensive assessment covering HTML5, CSS3, JavaScript, and responsive design',
        nsqf_level: 5,
        sector: 'Information Technology',
        duration: '4 hours',
        assessment_types: ['theoretical', 'practical', 'project'],
        weightages: {
          theoretical: 30,
          practical: 50,
          project: 20
        },
        competencies: [
          'Frontend Development',
          'Responsive Design',
          'JavaScript Programming',
          'Web Standards Compliance'
        ],
        certification_type: 'NCVET Recognized',
        passing_criteria: {
          minimum_score: 60,
          practical_mandatory: true,
          project_completion: true
        },
        status: 'available',
        enrolled: 145,
        completion_rate: 87
      },
      {
        id: 'ncvet-002',
        title: 'NSQF Level 6 - Data Analysis Professional Assessment',
        description: 'Advanced assessment for data analysis skills including Python, SQL, and statistical analysis',
        nsqf_level: 6,
        sector: 'Data Science',
        duration: '5 hours',
        assessment_types: ['theoretical', 'practical', 'case_study'],
        weightages: {
          theoretical: 25,
          practical: 60,
          case_study: 15
        },
        competencies: [
          'Statistical Analysis',
          'Python Programming',
          'Database Management',
          'Data Visualization',
          'Business Intelligence'
        ],
        certification_type: 'NCVET Recognized',
        passing_criteria: {
          minimum_score: 65,
          practical_mandatory: true,
          case_study_completion: true
        },
        status: 'available',
        enrolled: 89,
        completion_rate: 82
      },
      {
        id: 'ncvet-003',
        title: 'NSQF Level 4 - Digital Marketing Fundamentals',
        description: 'Assessment covering social media marketing, SEO, content marketing, and analytics',
        nsqf_level: 4,
        sector: 'Marketing',
        duration: '3 hours',
        assessment_types: ['theoretical', 'practical', 'portfolio'],
        weightages: {
          theoretical: 40,
          practical: 40,
          portfolio: 20
        },
        competencies: [
          'Social Media Marketing',
          'Search Engine Optimization',
          'Content Creation',
          'Digital Analytics'
        ],
        certification_type: 'NCVET Recognized',
        passing_criteria: {
          minimum_score: 60,
          practical_mandatory: true,
          portfolio_submission: true
        },
        status: 'available',
        enrolled: 203,
        completion_rate: 91
      }
    ];

    setAssessments(ncvetAssessments);
  };

  const validateAssessment = async (assessmentPlan) => {
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:5000/api/ncvet/validate-assessment', {
        assessment_plan: assessmentPlan
      });
      
      if (response.data.success) {
        return response.data.validation;
      }
    } catch (error) {
      console.error('Error validating assessment:', error);
    } finally {
      setLoading(false);
    }
  };

  const startAssessment = (assessment) => {
    setSelectedAssessment(assessment);
    // Here you would typically navigate to the assessment interface
    alert(`Starting ${assessment.title}\n\nThis is an NCVET-compliant assessment that will test your competencies across multiple evaluation criteria.`);
  };

  const getNSQFLevelColor = (level) => {
    const colors = {
      1: 'hsl(0, 69%, 67%)',
      2: 'hsl(25, 95%, 53%)', 
      3: 'hsl(48, 96%, 53%)',
      4: 'hsl(80, 61%, 50%)',
      5: 'hsl(142, 71%, 45%)',
      6: 'hsl(197, 71%, 52%)',
      7: 'hsl(221, 83%, 53%)',
      8: 'hsl(262, 83%, 58%)',
      9: 'hsl(300, 77%, 49%)',
      10: 'hsl(340, 75%, 55%)'
    };
    return colors[level] || 'hsl(215, 16%, 47%)';
  };

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
      color: 'hsl(215, 16%, 47%)',
      fontSize: '16px'
    },
    ncvetBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: 'hsl(142, 71%, 97%)',
      color: 'hsl(142, 71%, 45%)',
      padding: '8px 16px',
      borderRadius: '8px',
      fontSize: '14px',
      fontWeight: '600',
      marginTop: '12px',
      border: '1px solid hsl(142, 71%, 90%)'
    },
    qualitySection: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '32px',
      border: '1px solid hsl(220, 13%, 91%)',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    qualityTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: 'hsl(222, 47%, 11%)',
      marginBottom: '16px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    qualityGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '16px'
    },
    qualityItem: {
      padding: '16px',
      backgroundColor: 'hsl(220, 13%, 98%)',
      borderRadius: '8px',
      border: '1px solid hsl(220, 13%, 91%)'
    },
    qualityItemTitle: {
      fontWeight: '600',
      color: 'hsl(222, 47%, 11%)',
      marginBottom: '8px'
    },
    qualityItemDesc: {
      fontSize: '14px',
      color: 'hsl(215, 16%, 47%)'
    },
    assessmentsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
    assessmentCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      border: '1px solid hsl(220, 13%, 91%)',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      transition: 'box-shadow 0.2s'
    },
    assessmentHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '16px'
    },
    assessmentTitle: {
      fontSize: '20px',
      fontWeight: '600',
      color: 'hsl(222, 47%, 11%)',
      marginBottom: '8px'
    },
    assessmentDescription: {
      color: 'hsl(215, 16%, 47%)',
      marginBottom: '12px',
      lineHeight: '1.5'
    },
    assessmentMeta: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '12px',
      marginBottom: '16px'
    },
    metaBadge: {
      padding: '4px 12px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    },
    nsqfBadge: {
      backgroundColor: 'hsl(238, 64%, 97%)',
      color: 'hsl(238, 64%, 59%)'
    },
    sectorBadge: {
      backgroundColor: 'hsl(220, 13%, 95%)',
      color: 'hsl(215, 16%, 47%)'
    },
    durationBadge: {
      backgroundColor: 'hsl(200, 95%, 97%)',
      color: 'hsl(200, 95%, 40%)'
    },
    competenciesSection: {
      marginBottom: '20px'
    },
    competenciesTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: 'hsl(222, 47%, 11%)',
      marginBottom: '12px'
    },
    competenciesList: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px'
    },
    competencyTag: {
      backgroundColor: 'hsl(142, 71%, 97%)',
      color: 'hsl(142, 71%, 45%)',
      padding: '6px 12px',
      borderRadius: '6px',
      fontSize: '12px',
      fontWeight: '500',
      border: '1px solid hsl(142, 71%, 90%)'
    },
    assessmentTypes: {
      display: 'flex',
      gap: '16px',
      marginBottom: '20px'
    },
    typeItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '14px',
      color: 'hsl(215, 16%, 47%)'
    },
    footer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    enrollmentInfo: {
      fontSize: '14px',
      color: 'hsl(215, 16%, 47%)'
    },
    startButton: {
      backgroundColor: 'hsl(238, 64%, 59%)',
      color: 'white',
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'background-color 0.2s'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>NCVET Compliant Assessments</h1>
        <p style={styles.subtitle}>
          Take industry-recognized assessments aligned with National Skills Qualifications Framework
        </p>
        <div style={styles.ncvetBadge}>
          <Award size={16} />
          NCVET Recognized & Quality Assured
        </div>
      </div>

      {/* Quality Standards Section */}
      {qualityMetrics && (
        <div style={styles.qualitySection}>
          <h2 style={styles.qualityTitle}>
            <Star size={20} />
            NCVET Quality Standards
          </h2>
          <div style={styles.qualityGrid}>
            {qualityMetrics.compliance_checklist && Object.entries(qualityMetrics.compliance_checklist).map(([key, value]) => (
              <div key={key} style={styles.qualityItem}>
                <div style={styles.qualityItemTitle}>
                  {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </div>
                <div style={styles.qualityItemDesc}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assessments List */}
      <div style={styles.assessmentsList}>
        {assessments.map((assessment) => (
          <div
            key={assessment.id}
            style={styles.assessmentCard}
            onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)'}
            onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)'}
          >
            <div style={styles.assessmentHeader}>
              <div>
                <h3 style={styles.assessmentTitle}>{assessment.title}</h3>
                <p style={styles.assessmentDescription}>{assessment.description}</p>
                
                <div style={styles.assessmentMeta}>
                  <div style={{...styles.metaBadge, ...styles.nsqfBadge}}>
                    <Target size={12} />
                    NSQF Level {assessment.nsqf_level}
                  </div>
                  <div style={{...styles.metaBadge, ...styles.sectorBadge}}>
                    <BookOpen size={12} />
                    {assessment.sector}
                  </div>
                  <div style={{...styles.metaBadge, ...styles.durationBadge}}>
                    <Clock size={12} />
                    {assessment.duration}
                  </div>
                </div>
              </div>
            </div>

            <div style={styles.competenciesSection}>
              <h4 style={styles.competenciesTitle}>Core Competencies</h4>
              <div style={styles.competenciesList}>
                {assessment.competencies.map((competency, index) => (
                  <span key={index} style={styles.competencyTag}>
                    {competency}
                  </span>
                ))}
              </div>
            </div>

            <div style={styles.assessmentTypes}>
              {assessment.assessment_types.map((type, index) => (
                <div key={index} style={styles.typeItem}>
                  <FileText size={14} />
                  {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} 
                  ({assessment.weightages[type]}%)
                </div>
              ))}
            </div>

            <div style={styles.footer}>
              <div style={styles.enrollmentInfo}>
                <Users size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} />
                {assessment.enrolled} enrolled • {assessment.completion_rate}% completion rate
              </div>
              <button
                style={styles.startButton}
                onClick={() => startAssessment(assessment)}
                onMouseOver={(e) => e.target.style.backgroundColor = 'hsl(238, 64%, 55%)'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'hsl(238, 64%, 59%)'}
              >
                <CheckCircle size={16} />
                Start Assessment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NCVETAssessment;