import { Target, Clock, Award, BookOpen, CheckCircle } from "lucide-react";

const availableAssessments = [
  {
    id: 1,
    skill: "Python Programming",
    difficulty: "Beginner",
    duration: "45 minutes",
    questions: 25,
    description: "Test your understanding of Python basics, data types, and control structures.",
    badge: "🐍"
  },
  {
    id: 2,
    skill: "Data Analysis with Pandas",
    difficulty: "Intermediate",
    duration: "60 minutes",
    questions: 30,
    description: "Evaluate your skills in data manipulation and analysis using Pandas library.",
    badge: "📊"
  },
  {
    id: 3,
    skill: "SQL Fundamentals",
    difficulty: "Beginner",
    duration: "40 minutes",
    questions: 20,
    description: "Assess your knowledge of database queries, joins, and data manipulation.",
    badge: "🗄️"
  },
  {
    id: 4,
    skill: "Statistics for Data Science",
    difficulty: "Intermediate",
    duration: "50 minutes",
    questions: 35,
    description: "Test your understanding of statistical concepts and probability distributions.",
    badge: "📈"
  },
  {
    id: 5,
    skill: "Machine Learning Basics",
    difficulty: "Advanced",
    duration: "75 minutes",
    questions: 40,
    description: "Evaluate your knowledge of ML algorithms, model evaluation, and feature engineering.",
    badge: "🤖"
  }
];

const completedAssessments = [
  {
    skill: "Python Basics",
    score: 85,
    maxScore: 100,
    completedAt: "2 hours ago",
    badge: "🏆",
    level: "Proficient"
  },
  {
    skill: "Excel Fundamentals",
    score: 92,
    maxScore: 100,
    completedAt: "3 days ago",
    badge: "🥇",
    level: "Expert"
  },
  {
    skill: "Data Visualization",
    score: 78,
    maxScore: 100,
    completedAt: "1 week ago",
    badge: "🥉",
    level: "Intermediate"
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    marginBottom: '32px'
  },
  statCard: {
    backgroundColor: 'hsl(0, 0%, 100%)',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px 0 hsl(0 0% 0% / 0.1)',
    border: '1px solid hsl(220, 13%, 91%)'
  },
  statHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px'
  },
  statIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  statLabel: {
    fontSize: '14px',
    color: 'hsl(215, 16%, 47%)'
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'hsl(222, 47%, 11%)'
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'hsl(222, 47%, 11%)',
    marginBottom: '16px'
  },
  assessmentsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginBottom: '32px'
  },
  assessmentCard: {
    backgroundColor: 'hsl(0, 0%, 100%)',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px 0 hsl(0 0% 0% / 0.1)',
    border: '1px solid hsl(220, 13%, 91%)',
    transition: 'box-shadow 0.2s'
  },
  assessmentContent: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '16px'
  },
  assessmentBadge: {
    fontSize: '32px'
  },
  assessmentDetails: {
    flex: 1
  },
  assessmentHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '12px'
  },
  assessmentTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'hsl(222, 47%, 11%)',
    marginBottom: '4px'
  },
  assessmentDescription: {
    color: 'hsl(215, 16%, 47%)',
    fontSize: '14px'
  },
  difficultyBadge: {
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: '500'
  },
  assessmentMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    marginBottom: '16px',
    fontSize: '14px',
    color: 'hsl(215, 16%, 47%)'
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  assessmentFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  certificateInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: 'hsl(215, 16%, 47%)'
  },
  takeTestButton: {
    backgroundColor: 'hsl(238, 64%, 59%)',
    color: 'white',
    padding: '8px 24px',
    borderRadius: '8px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  resultCard: {
    backgroundColor: 'hsl(0, 0%, 100%)',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px 0 hsl(0 0% 0% / 0.1)',
    border: '1px solid hsl(220, 13%, 91%)'
  },
  resultHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  resultLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  resultBadge: {
    fontSize: '24px'
  },
  resultInfo: {},
  resultTitle: {
    fontWeight: 'bold',
    color: 'hsl(222, 47%, 11%)'
  },
  resultDate: {
    fontSize: '14px',
    color: 'hsl(215, 16%, 47%)'
  },
  resultRight: {
    textAlign: 'right'
  },
  resultScore: {
    fontSize: '24px',
    fontWeight: 'bold'
  },
  resultPoints: {
    fontSize: '14px',
    color: 'hsl(215, 16%, 47%)'
  },
  resultLevel: {
    display: 'inline-block',
    marginTop: '4px',
    padding: '4px 8px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: '500'
  },
  resultProgressContainer: {
    marginTop: '16px'
  },
  resultProgressBar: {
    width: '100%',
    backgroundColor: 'hsl(220, 13%, 91%)',
    borderRadius: '9999px',
    height: '8px'
  },
  resultProgress: {
    height: '8px',
    borderRadius: '9999px'
  },
  viewAllButton: {
    textAlign: 'center',
    marginTop: '24px'
  },
  viewAllLink: {
    color: 'hsl(238, 64%, 59%)',
    fontWeight: '500',
    textDecoration: 'none',
    cursor: 'pointer'
  }
};

const Assessments = () => {
  const getDifficultyStyle = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return { color: 'hsl(142, 71%, 45%)', backgroundColor: 'hsl(142, 71%, 45%, 0.1)' };
      case 'Intermediate': return { color: 'hsl(38, 92%, 50%)', backgroundColor: 'hsl(38, 92%, 50%, 0.1)' };
      case 'Advanced': return { color: 'hsl(0, 84%, 60%)', backgroundColor: 'hsl(0, 84%, 60%, 0.1)' };
      default: return { color: 'hsl(215, 16%, 47%)', backgroundColor: 'hsl(220, 13%, 91%)' };
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'hsl(142, 71%, 45%)';
    if (score >= 70) return 'hsl(38, 92%, 50%)';
    return 'hsl(0, 84%, 60%)';
  };

  const getLevelStyle = (level) => {
    switch (level) {
      case 'Expert': return { backgroundColor: 'hsl(142, 71%, 45%, 0.1)', color: 'hsl(142, 71%, 45%)' };
      case 'Proficient': return { backgroundColor: 'hsl(38, 92%, 50%, 0.1)', color: 'hsl(38, 92%, 50%)' };
      default: return { backgroundColor: 'hsl(221, 83%, 53%, 0.1)', color: 'hsl(221, 83%, 53%)' };
    }
  };

  const getProgressBarColor = (score) => {
    if (score >= 90) return 'linear-gradient(135deg, hsl(142, 71%, 45%), hsl(150, 60%, 50%))';
    if (score >= 70) return 'hsl(38, 92%, 50%)';
    return 'hsl(0, 84%, 60%)';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Validate Your Skills</h1>
        <p style={styles.subtitle}>Take assessments to showcase your abilities and earn industry-recognized badges</p>
      </div>

      {/* Stats Overview */}
      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <div style={{...styles.statIcon, backgroundColor: 'hsl(238, 64%, 59%, 0.1)'}}>
              <Target style={{width: '20px', height: '20px', color: 'hsl(238, 64%, 59%)'}} />
            </div>
            <span style={styles.statLabel}>Available Tests</span>
          </div>
          <div style={styles.statValue}>{availableAssessments.length}</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <div style={{...styles.statIcon, backgroundColor: 'hsl(142, 71%, 45%, 0.1)'}}>
              <CheckCircle style={{width: '20px', height: '20px', color: 'hsl(142, 71%, 45%)'}} />
            </div>
            <span style={styles.statLabel}>Completed</span>
          </div>
          <div style={styles.statValue}>{completedAssessments.length}</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <div style={{...styles.statIcon, backgroundColor: 'hsl(38, 92%, 50%, 0.1)'}}>
              <Award style={{width: '20px', height: '20px', color: 'hsl(38, 92%, 50%)'}} />
            </div>
            <span style={styles.statLabel}>Badges Earned</span>
          </div>
          <div style={styles.statValue}>7</div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statHeader}>
            <div style={{...styles.statIcon, backgroundColor: 'hsl(221, 83%, 53%, 0.1)'}}>
              <BookOpen style={{width: '20px', height: '20px', color: 'hsl(221, 83%, 53%)'}} />
            </div>
            <span style={styles.statLabel}>Avg Score</span>
          </div>
          <div style={styles.statValue}>85%</div>
        </div>
      </div>

      {/* Available Assessments */}
      <div>
        <h2 style={styles.sectionTitle}>Available Assessments</h2>
        <div style={styles.assessmentsList}>
          {availableAssessments.map((assessment) => (
            <div 
              key={assessment.id} 
              style={styles.assessmentCard}
              onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px hsl(0 0% 0% / 0.1)'}
              onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 1px 3px 0 hsl(0 0% 0% / 0.1)'}
            >
              <div style={styles.assessmentContent}>
                <div style={styles.assessmentBadge}>{assessment.badge}</div>
                <div style={styles.assessmentDetails}>
                  <div style={styles.assessmentHeader}>
                    <div>
                      <h3 style={styles.assessmentTitle}>{assessment.skill}</h3>
                      <p style={styles.assessmentDescription}>{assessment.description}</p>
                    </div>
                    <span style={{
                      ...styles.difficultyBadge,
                      ...getDifficultyStyle(assessment.difficulty)
                    }}>
                      {assessment.difficulty}
                    </span>
                  </div>
                  
                  <div style={styles.assessmentMeta}>
                    <div style={styles.metaItem}>
                      <Clock style={{width: '16px', height: '16px'}} />
                      <span>{assessment.duration}</span>
                    </div>
                    <div style={styles.metaItem}>
                      <Target style={{width: '16px', height: '16px'}} />
                      <span>{assessment.questions} questions</span>
                    </div>
                  </div>

                  <div style={styles.assessmentFooter}>
                    <div style={styles.certificateInfo}>
                      <Award style={{width: '16px', height: '16px'}} />
                      <span>Earn a verified certificate upon completion</span>
                    </div>
                    <button 
                      style={styles.takeTestButton}
                      onMouseOver={(e) => e.target.style.backgroundColor = 'hsl(238, 64%, 59%, 0.9)'}
                      onMouseOut={(e) => e.target.style.backgroundColor = 'hsl(238, 64%, 59%)'}
                    >
                      Take Test
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* My Results */}
      <div>
        <h2 style={styles.sectionTitle}>My Results</h2>
        <div style={styles.assessmentsList}>
          {completedAssessments.map((result, index) => (
            <div key={index} style={styles.resultCard}>
              <div style={styles.resultHeader}>
                <div style={styles.resultLeft}>
                  <div style={styles.resultBadge}>{result.badge}</div>
                  <div style={styles.resultInfo}>
                    <h3 style={styles.resultTitle}>{result.skill}</h3>
                    <p style={styles.resultDate}>Completed {result.completedAt}</p>
                  </div>
                </div>
                
                <div style={styles.resultRight}>
                  <div style={{
                    ...styles.resultScore,
                    color: getScoreColor(result.score)
                  }}>
                    {result.score}%
                  </div>
                  <div style={styles.resultPoints}>
                    {result.score}/{result.maxScore} points
                  </div>
                  <span style={{
                    ...styles.resultLevel,
                    ...getLevelStyle(result.level)
                  }}>
                    {result.level}
                  </span>
                </div>
              </div>
              
              <div style={styles.resultProgressContainer}>
                <div style={styles.resultProgressBar}>
                  <div 
                    style={{
                      ...styles.resultProgress,
                      background: getProgressBarColor(result.score),
                      width: `${result.score}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Results */}
        <div style={styles.viewAllButton}>
          <a 
            style={styles.viewAllLink}
            onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
            onMouseOut={(e) => e.target.style.textDecoration = 'none'}
          >
            View All Assessment Results →
          </a>
        </div>
      </div>
    </div>
  );
};

export default Assessments;