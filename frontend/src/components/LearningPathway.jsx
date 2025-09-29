import React, { useState, useEffect } from 'react';
import { Target, BookOpen, Award, TrendingUp, Clock, Users, CheckCircle, ArrowRight } from 'lucide-react';
import axios from 'axios';

const LearningPathway = () => {
  const [pathwayData, setPathwayData] = useState(null);
  const [nsqfLevels, setNsqfLevels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    career_aspirations: '',
    prior_skills: '',
    academic_background: '',
    learning_pace: 'medium',
    digital_access: 'high'
  });

  useEffect(() => {
    fetchNsqfLevels();
  }, []);

  const fetchNsqfLevels = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/nsqf/levels');
      if (response.data.success) {
        setNsqfLevels(response.data.levels);
      }
    } catch (error) {
      console.error('Error fetching NSQF levels:', error);
    }
  };

  const generatePathway = async () => {
    setLoading(true);
    try {
      const skillsArray = formData.prior_skills.split(',').map(skill => skill.trim()).filter(skill => skill);
      
      const payload = {
        ...formData,
        prior_skills: skillsArray
      };

      const response = await axios.post('http://localhost:5000/api/nsqf/learning-pathway', payload);
      
      if (response.data.success) {
        setPathwayData(response.data.pathway);
      }
    } catch (error) {
      console.error('Error generating pathway:', error);
      alert('Failed to generate learning pathway. Please try again.');
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const styles = {
    container: {
      padding: '24px',
      maxWidth: '1200px',
      margin: '0 auto',
      backgroundColor: 'hsl(220, 14%, 96%)',
      minHeight: '100vh'
    },
    header: {
      textAlign: 'center',
      marginBottom: '32px'
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: 'hsl(222, 47%, 11%)',
      marginBottom: '8px'
    },
    subtitle: {
      color: 'hsl(215, 16%, 47%)',
      fontSize: '16px'
    },
    formCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 1px 3px 0 hsl(0 0% 0% / 0.1)',
      border: '1px solid hsl(220, 13%, 91%)'
    },
    formGroup: {
      marginBottom: '20px'
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
    select: {
      width: '100%',
      padding: '12px',
      border: '1px solid hsl(220, 13%, 91%)',
      borderRadius: '8px',
      fontSize: '14px',
      backgroundColor: 'white',
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
    pathwayCard: {
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '24px',
      boxShadow: '0 1px 3px 0 hsl(0 0% 0% / 0.1)',
      border: '1px solid hsl(220, 13%, 91%)'
    },
    levelInfo: {
      backgroundColor: 'hsl(238, 64%, 97%)',
      padding: '20px',
      borderRadius: '8px',
      marginBottom: '24px',
      border: '1px solid hsl(238, 64%, 90%)'
    },
    levelTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: 'hsl(238, 64%, 59%)',
      marginBottom: '8px'
    },
    pathwayPhase: {
      backgroundColor: 'white',
      border: '1px solid hsl(220, 13%, 91%)',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '16px',
      position: 'relative'
    },
    phaseHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '12px'
    },
    phaseTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: 'hsl(222, 47%, 11%)'
    },
    phaseBadge: {
      backgroundColor: 'hsl(238, 64%, 59%)',
      color: 'white',
      padding: '4px 8px',
      borderRadius: '4px',
      fontSize: '12px',
      fontWeight: '600'
    },
    phaseDescription: {
      color: 'hsl(215, 16%, 47%)',
      marginBottom: '12px'
    },
    phaseDetails: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '12px'
    },
    detail: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      color: 'hsl(215, 16%, 47%)'
    },
    recommendationsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px',
      marginTop: '24px'
    },
    recommendationCard: {
      backgroundColor: 'hsl(220, 14%, 98%)',
      padding: '20px',
      borderRadius: '8px',
      border: '1px solid hsl(220, 13%, 91%)'
    },
    recommendationTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: 'hsl(222, 47%, 11%)',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    skillsList: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    skillItem: {
      padding: '6px 0',
      borderBottom: '1px solid hsl(220, 13%, 91%)',
      fontSize: '14px',
      color: 'hsl(215, 16%, 47%)'
    },
    nsqfLevelsSection: {
      marginTop: '40px'
    },
    levelsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '16px',
      marginTop: '20px'
    },
    levelCard: {
      backgroundColor: 'white',
      padding: '16px',
      borderRadius: '8px',
      border: '1px solid hsl(220, 13%, 91%)',
      textAlign: 'center'
    },
    levelNumber: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: 'hsl(238, 64%, 59%)',
      marginBottom: '8px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>AI-Powered Learning Pathway Generator</h1>
        <p style={styles.subtitle}>
          Get personalized learning recommendations based on NSQF (National Skills Qualifications Framework)
        </p>
      </div>

      {/* Profile Form */}
      <div style={styles.formCard}>
        <h3>Your Profile</h3>
        
        <div style={styles.formGroup}>
          <label style={styles.label}>Career Aspirations</label>
          <input
            type="text"
            name="career_aspirations"
            value={formData.career_aspirations}
            onChange={handleInputChange}
            placeholder="e.g., Software Developer, Data Scientist, Project Manager"
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Prior Skills (comma-separated)</label>
          <textarea
            name="prior_skills"
            value={formData.prior_skills}
            onChange={handleInputChange}
            placeholder="e.g., Python, JavaScript, Data Analysis, Project Management"
            style={styles.textarea}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Academic Background</label>
          <input
            type="text"
            name="academic_background"
            value={formData.academic_background}
            onChange={handleInputChange}
            placeholder="e.g., Bachelor's in Computer Science, Diploma in Engineering"
            style={styles.input}
          />
        </div>

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

        <div style={styles.formGroup}>
          <label style={styles.label}>Digital Access</label>
          <select
            name="digital_access"
            value={formData.digital_access}
            onChange={handleInputChange}
            style={styles.select}
          >
            <option value="low">Low (Limited Internet)</option>
            <option value="medium">Medium (Regular Access)</option>
            <option value="high">High (Always Connected)</option>
          </select>
        </div>

        <button
          onClick={generatePathway}
          disabled={loading}
          style={styles.generateBtn}
        >
          <Target size={20} />
          {loading ? 'Generating...' : 'Generate Learning Pathway'}
        </button>
      </div>

      {/* Pathway Results */}
      {pathwayData && (
        <div style={styles.pathwayCard}>
          <h3>Your Personalized Learning Pathway</h3>
          
          {/* Predicted Level Info */}
          <div style={styles.levelInfo}>
            <div style={styles.levelTitle}>
              Predicted NSQF Level: {pathwayData.predicted_level}
            </div>
            <div style={styles.phaseDescription}>
              {pathwayData.level_info.description}
            </div>
          </div>

          {/* Learning Pathway Phases */}
          <h4>Learning Journey</h4>
          {pathwayData.learning_pathway.map((phase, index) => (
            <div key={index} style={styles.pathwayPhase}>
              <div style={styles.phaseHeader}>
                <div style={styles.phaseTitle}>{phase.phase}</div>
                <div style={styles.phaseBadge}>Level {phase.nsqf_level}</div>
              </div>
              <div style={styles.phaseDescription}>{phase.description}</div>
              <div style={styles.phaseDetails}>
                <div style={styles.detail}>
                  <Target size={16} />
                  Focus: {phase.focus}
                </div>
                <div style={styles.detail}>
                  <Clock size={16} />
                  Duration: {phase.duration}
                </div>
              </div>
              {index < pathwayData.learning_pathway.length - 1 && (
                <ArrowRight 
                  size={20} 
                  style={{
                    position: 'absolute',
                    right: '-10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'hsl(238, 64%, 59%)',
                    backgroundColor: 'white',
                    borderRadius: '50%'
                  }}
                />
              )}
            </div>
          ))}

          {/* Recommendations */}
          <div style={styles.recommendationsGrid}>
            <div style={styles.recommendationCard}>
              <div style={styles.recommendationTitle}>
                <BookOpen size={20} />
                Skills Focus
              </div>
              <ul style={styles.skillsList}>
                {pathwayData.recommendations.immediate_focus.map((skill, index) => (
                  <li key={index} style={styles.skillItem}>{skill}</li>
                ))}
              </ul>
            </div>

            <div style={styles.recommendationCard}>
              <div style={styles.recommendationTitle}>
                <Award size={20} />
                Career Opportunities
              </div>
              <ul style={styles.skillsList}>
                {pathwayData.recommendations.career_opportunities.map((role, index) => (
                  <li key={index} style={styles.skillItem}>{role}</li>
                ))}
              </ul>
            </div>

            <div style={styles.recommendationCard}>
              <div style={styles.recommendationTitle}>
                <TrendingUp size={20} />
                Employment Prospects
              </div>
              <div style={styles.skillItem}>
                {pathwayData.recommendations.employment_prospects}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* NSQF Levels Reference */}
      <div style={styles.nsqfLevelsSection}>
        <h3>NSQF Levels Reference</h3>
        <div style={styles.levelsGrid}>
          {nsqfLevels.slice(0, 5).map((level) => (
            <div key={level.level} style={styles.levelCard}>
              <div style={styles.levelNumber}>Level {level.level}</div>
              <div style={styles.phaseDescription}>
                {level.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LearningPathway;