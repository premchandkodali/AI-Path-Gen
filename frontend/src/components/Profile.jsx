import { Edit, MapPin, Mail, Phone, Calendar, Award, BookOpen, Download } from "lucide-react";

const skills = [
  { name: "Python", level: 85, category: "Programming" },
  { name: "SQL", level: 78, category: "Database" },
  { name: "Excel", level: 92, category: "Tools" },
  { name: "Data Visualization", level: 70, category: "Analytics" },
  { name: "Statistics", level: 65, category: "Mathematics" },
  { name: "Communication", level: 88, category: "Soft Skills" },
  { name: "Pandas", level: 75, category: "Programming" },
  { name: "Tableau", level: 60, category: "Tools" }
];

const certificates = [
  {
    title: "Python for Data Science",
    issuer: "SkillPath AI",
    date: "March 2024",
    credentialId: "SP-PDS-2024-001",
    verified: true
  },
  {
    title: "Excel Advanced Analytics",
    issuer: "NCVET Certified",
    date: "February 2024",
    credentialId: "NCVET-EAA-2024-456",
    verified: true
  },
  {
    title: "Data Analysis Fundamentals",
    issuer: "Skill India",
    date: "January 2024",
    credentialId: "SI-DAF-2024-789",
    verified: true
  }
];

const learningActivity = [
  { course: "Python Data Structures", progress: 85, status: "In Progress" },
  { course: "Statistical Analysis", progress: 100, status: "Completed" },
  { course: "Machine Learning Basics", progress: 45, status: "In Progress" },
  { course: "SQL Advanced Queries", progress: 100, status: "Completed" }
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
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 2fr',
    gap: '32px'
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  rightColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  card: {
    backgroundColor: 'hsl(0, 0%, 100%)',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px 0 hsl(0 0% 0% / 0.1)',
    border: '1px solid hsl(220, 13%, 91%)'
  },
  profileSection: {
    textAlign: 'center',
    marginBottom: '24px'
  },
  avatar: {
    width: '96px',
    height: '96px',
    background: 'linear-gradient(135deg, hsl(238, 64%, 59%), hsl(238, 70%, 65%))',
    borderRadius: '50%',
    margin: '0 auto 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  avatarText: {
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold'
  },
  profileName: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'hsl(222, 47%, 11%)',
    marginBottom: '4px'
  },
  profileRole: {
    color: 'hsl(215, 16%, 47%)'
  },
  contactInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    marginBottom: '24px'
  },
  contactItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px'
  },
  contactIcon: {
    width: '16px',
    height: '16px',
    color: 'hsl(215, 16%, 47%)'
  },
  editButton: {
    width: '100%',
    backgroundColor: 'hsl(238, 64%, 59%)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  },
  statsCard: {},
  statsTitle: {
    fontWeight: '600',
    fontSize: '18px',
    marginBottom: '16px'
  },
  statsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  statItem: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  statLabel: {
    color: 'hsl(215, 16%, 47%)'
  },
  statValue: {
    fontWeight: 'bold'
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px'
  },
  sectionTitle: {
    fontWeight: '600',
    fontSize: '18px'
  },
  sectionLink: {
    color: 'hsl(238, 64%, 59%)',
    fontWeight: '500',
    fontSize: '14px',
    textDecoration: 'none',
    cursor: 'pointer'
  },
  skillsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '16px'
  },
  skillItem: {
    padding: '16px',
    backgroundColor: 'hsl(220, 13%, 91%, 0.3)',
    borderRadius: '8px'
  },
  skillHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  skillName: {
    fontWeight: '500',
    color: 'hsl(222, 47%, 11%)'
  },
  skillPercentage: {
    fontSize: '14px',
    color: 'hsl(215, 16%, 47%)'
  },
  skillBar: {
    width: '100%',
    backgroundColor: 'hsl(220, 13%, 91%)',
    borderRadius: '9999px',
    height: '8px',
    marginBottom: '4px'
  },
  skillProgress: {
    height: '8px',
    borderRadius: '9999px'
  },
  skillCategory: {
    fontSize: '12px',
    color: 'hsl(215, 16%, 47%)'
  },
  certificatesContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  certificateItem: {
    padding: '16px',
    backgroundColor: 'hsl(220, 13%, 91%, 0.3)',
    borderRadius: '8px'
  },
  certificateContent: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  certificateLeft: {
    flex: 1
  },
  certificateHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '4px'
  },
  certificateIcon: {
    width: '20px',
    height: '20px',
    color: 'hsl(38, 92%, 50%)'
  },
  certificateTitle: {
    fontWeight: 'bold',
    color: 'hsl(222, 47%, 11%)'
  },
  verifiedBadge: {
    backgroundColor: 'hsl(142, 71%, 45%, 0.1)',
    color: 'hsl(142, 71%, 45%)',
    padding: '2px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500'
  },
  certificateIssuer: {
    fontSize: '14px',
    color: 'hsl(215, 16%, 47%)',
    marginBottom: '4px'
  },
  certificateDetails: {
    fontSize: '12px',
    color: 'hsl(215, 16%, 47%)'
  },
  downloadButton: {
    backgroundColor: 'hsl(220, 13%, 91%)',
    color: 'hsl(215, 16%, 47%)',
    padding: '8px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  activityContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  activityItem: {
    padding: '16px',
    backgroundColor: 'hsl(220, 13%, 91%, 0.3)',
    borderRadius: '8px'
  },
  activityHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '8px'
  },
  activityLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  activityIcon: {
    width: '20px',
    height: '20px',
    color: 'hsl(238, 64%, 59%)'
  },
  activityName: {
    fontWeight: '500',
    color: 'hsl(222, 47%, 11%)'
  },
  activityStatus: {
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500'
  },
  activityProgress: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  },
  activityBar: {
    flex: 1,
    backgroundColor: 'hsl(220, 13%, 91%)',
    borderRadius: '9999px',
    height: '8px'
  },
  activityFill: {
    height: '8px',
    borderRadius: '9999px'
  },
  activityPercentage: {
    fontSize: '14px',
    color: 'hsl(215, 16%, 47%)'
  }
};

const Profile = () => {
  const getSkillColor = (level) => {
    if (level >= 80) return 'hsl(142, 71%, 45%)';
    if (level >= 60) return 'hsl(38, 92%, 50%)';
    return 'hsl(221, 83%, 53%)';
  };

  const getActivityStatusStyle = (status) => {
    if (status === 'Completed') {
      return { backgroundColor: 'hsl(142, 71%, 45%, 0.1)', color: 'hsl(142, 71%, 45%)' };
    }
    return { backgroundColor: 'hsl(38, 92%, 50%, 0.1)', color: 'hsl(38, 92%, 50%)' };
  };

  const getActivityBarColor = (status) => {
    return status === 'Completed' ? 'hsl(142, 71%, 45%)' : 'hsl(238, 64%, 59%)';
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Profile</h1>
        <p style={styles.subtitle}>Manage your learning profile and track your progress</p>
      </div>

      <div style={styles.mainGrid}>
        {/* Left Column - Profile Info */}
        <div style={styles.leftColumn}>
          {/* Profile Card */}
          <div style={styles.card}>
            <div style={styles.profileSection}>
              <div style={styles.avatar}>
                <span style={styles.avatarText}>PS</span>
              </div>
              <h2 style={styles.profileName}>Priya Sharma</h2>
              <p style={styles.profileRole}>Aspiring Data Analyst</p>
            </div>

            <div style={styles.contactInfo}>
              <div style={styles.contactItem}>
                <MapPin style={styles.contactIcon} />
                <span>Vijayawada, Andhra Pradesh</span>
              </div>
              <div style={styles.contactItem}>
                <Mail style={styles.contactIcon} />
                <span>priya.sharma@email.com</span>
              </div>
              <div style={styles.contactItem}>
                <Phone style={styles.contactIcon} />
                <span>+91 98765 43210</span>
              </div>
              <div style={styles.contactItem}>
                <Calendar style={styles.contactIcon} />
                <span>Joined February 2024</span>
              </div>
            </div>

            <button 
              style={styles.editButton}
              onMouseOver={(e) => e.target.style.backgroundColor = 'hsl(238, 64%, 59%, 0.9)'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'hsl(238, 64%, 59%)'}
            >
              <Edit style={{width: '16px', height: '16px'}} />
              Edit Profile
            </button>
          </div>

          {/* Quick Stats */}
          <div style={{...styles.card, ...styles.statsCard}}>
            <h3 style={styles.statsTitle}>Learning Stats</h3>
            <div style={styles.statsContainer}>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>Courses Completed</span>
                <span style={{...styles.statValue, color: 'hsl(142, 71%, 45%)'}}>8</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>Certificates Earned</span>
                <span style={{...styles.statValue, color: 'hsl(38, 92%, 50%)'}}>3</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>Learning Streak</span>
                <span style={{...styles.statValue, color: 'hsl(238, 64%, 59%)'}}>15 days</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>Hours Learned</span>
                <span style={{...styles.statValue, color: 'hsl(221, 83%, 53%)'}}>124h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Skills & Credentials */}
        <div style={styles.rightColumn}>
          {/* Skills Section */}
          <div style={styles.card}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>My Skills</h3>
              <a 
                style={styles.sectionLink}
                onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                onMouseOut={(e) => e.target.style.textDecoration = 'none'}
              >
                Add Skills
              </a>
            </div>
            
            <div style={styles.skillsGrid}>
              {skills.map((skill, index) => (
                <div key={index} style={styles.skillItem}>
                  <div style={styles.skillHeader}>
                    <span style={styles.skillName}>{skill.name}</span>
                    <span style={styles.skillPercentage}>{skill.level}%</span>
                  </div>
                  <div style={styles.skillBar}>
                    <div 
                      style={{
                        ...styles.skillProgress,
                        backgroundColor: getSkillColor(skill.level),
                        width: `${skill.level}%`
                      }}
                    ></div>
                  </div>
                  <span style={styles.skillCategory}>{skill.category}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Certificates & Credentials */}
          <div style={styles.card}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Credentials & Certificates</h3>
              <a 
                style={styles.sectionLink}
                onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                onMouseOut={(e) => e.target.style.textDecoration = 'none'}
              >
                View All
              </a>
            </div>
            
            <div style={styles.certificatesContainer}>
              {certificates.map((cert, index) => (
                <div key={index} style={styles.certificateItem}>
                  <div style={styles.certificateContent}>
                    <div style={styles.certificateLeft}>
                      <div style={styles.certificateHeader}>
                        <Award style={styles.certificateIcon} />
                        <h4 style={styles.certificateTitle}>{cert.title}</h4>
                        {cert.verified && (
                          <span style={styles.verifiedBadge}>
                            Verified
                          </span>
                        )}
                      </div>
                      <p style={styles.certificateIssuer}>Issued by {cert.issuer}</p>
                      <p style={styles.certificateDetails}>
                        {cert.date} • Credential ID: {cert.credentialId}
                      </p>
                    </div>
                    <button 
                      style={styles.downloadButton}
                      onMouseOver={(e) => e.target.style.backgroundColor = 'hsl(220, 13%, 91%, 0.8)'}
                      onMouseOut={(e) => e.target.style.backgroundColor = 'hsl(220, 13%, 91%)'}
                    >
                      <Download style={{width: '16px', height: '16px'}} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Learning Activity */}
          <div style={styles.card}>
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>Recent Learning Activity</h3>
              <a 
                style={styles.sectionLink}
                onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                onMouseOut={(e) => e.target.style.textDecoration = 'none'}
              >
                View Full History
              </a>
            </div>
            
            <div style={styles.activityContainer}>
              {learningActivity.map((activity, index) => (
                <div key={index} style={styles.activityItem}>
                  <div style={styles.activityHeader}>
                    <div style={styles.activityLeft}>
                      <BookOpen style={styles.activityIcon} />
                      <span style={styles.activityName}>{activity.course}</span>
                    </div>
                    <span style={{
                      ...styles.activityStatus,
                      ...getActivityStatusStyle(activity.status)
                    }}>
                      {activity.status}
                    </span>
                  </div>
                  <div style={styles.activityProgress}>
                    <div style={styles.activityBar}>
                      <div 
                        style={{
                          ...styles.activityFill,
                          backgroundColor: getActivityBarColor(activity.status),
                          width: `${activity.progress}%`
                        }}
                      ></div>
                    </div>
                    <span style={styles.activityPercentage}>{activity.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;