import { Edit, MapPin, Mail, Phone, Calendar, Award, BookOpen, Download, Save, X, Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
  },
  editForm: {
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    bottom: '0',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000
  },
  editModal: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    width: '90%',
    maxWidth: '500px',
    maxHeight: '80vh',
    overflowY: 'auto'
  },
  editHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px'
  },
  editTitle: {
    fontSize: '20px',
    fontWeight: 'bold'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px'
  },
  formGroup: {
    marginBottom: '16px'
  },
  label: {
    display: 'block',
    marginBottom: '4px',
    fontWeight: '500',
    color: 'hsl(222, 47%, 11%)'
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid hsl(220, 13%, 91%)',
    borderRadius: '6px',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  textarea: {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid hsl(220, 13%, 91%)',
    borderRadius: '6px',
    fontSize: '14px',
    minHeight: '80px',
    resize: 'vertical',
    boxSizing: 'border-box'
  },
  saveButton: {
    backgroundColor: 'hsl(238, 64%, 59%)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500',
    marginRight: '8px'
  },
  cancelButton: {
    backgroundColor: 'hsl(220, 13%, 91%)',
    color: 'hsl(215, 16%, 47%)',
    padding: '8px 16px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '500'
  },
  loading: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px',
    color: 'hsl(215, 16%, 47%)'
  },
  error: {
    textAlign: 'center',
    padding: '40px',
    fontSize: '16px',
    color: 'hsl(0, 84%, 60%)'
  },
  skillForm: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px'
  },
  addButton: {
    backgroundColor: 'hsl(142, 71%, 45%)',
    color: 'white',
    padding: '4px 8px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '12px'
  }
};

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [newSkill, setNewSkill] = useState({ name: '', level: 50, category: '' });
  const navigate = useNavigate();

  // Load user data on component mount
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    
    loadUserData();
  }, [navigate]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Get token and extract user information
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to view your profile');
        return;
      }

      // Decode JWT token to get user info
      let userId = null;
      let userInfo = null;
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.id || payload.userId || payload.sub;
        userInfo = payload;
      } catch (decodeErr) {
        console.error('Token decode error:', decodeErr);
        setError('Invalid authentication token. Please log in again.');
        localStorage.removeItem('token');
        return;
      }

      if (!userId) {
        setError('User ID not found in token. Please log in again.');
        return;
      }

      // Fetch from Node.js backend
      let userProfile = null;
      try {
        const response = await axios.get(`http://localhost:5002/api/profile/${userId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        userProfile = response.data;
      } catch (err) {
        if (err.response?.status === 404) {
          console.log('User profile not found, creating new profile');
          
          // Create profile with actual user data from token
          userProfile = {
            _id: userId,
            name: userInfo.name || userInfo.username || 'User',
            email: userInfo.email || '',
            phone: '',
            location: '',
            role: 'Student',
            joinDate: new Date().toISOString(),
            skills: [],
            certificates: [],
            learningActivity: [],
            stats: {
              coursesCompleted: 0,
              certificatesEarned: 0,
              learningStreak: 0,
              hoursLearned: 0
            }
          };
          
          // Save new profile to backend
          try {
            const createResponse = await axios.post('http://localhost:5002/api/profile', userProfile, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            userProfile = createResponse.data;
          } catch (saveErr) {
            console.error('Could not save new profile to backend:', saveErr);
          }
        } else {
          throw err;
        }
      }

      setUserData(userProfile);
      setEditForm({
        name: userProfile.name,
        email: userProfile.email,
        phone: userProfile.phone,
        location: userProfile.location,
        role: userProfile.role
      });

    } catch (err) {
      console.error('Error loading user data:', err);
      setError('Failed to load profile data. Please try logging in again.');
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in to save changes');
        return;
      }

      const updatedProfile = {
        ...userData,
        ...editForm,
        updatedAt: new Date().toISOString()
      };

      await axios.put(`http://localhost:5002/api/profile/${userData._id}`, updatedProfile, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      setUserData(updatedProfile);
      setIsEditing(false);
      
    } catch (err) {
      console.error('Error saving profile:', err);
      alert('Failed to save profile changes. Please try again.');
    }
  };

  const addSkill = async () => {
    if (newSkill.name && newSkill.category) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          alert('Please log in to add skills');
          return;
        }

        const updatedSkills = [...userData.skills, newSkill];
        const updatedUserData = {
          ...userData,
          skills: updatedSkills
        };
        
        setUserData(updatedUserData);
        setNewSkill({ name: '', level: 50, category: '' });
        
        // Save to backend
        await axios.put(`http://localhost:5002/api/profile/${userData._id}`, updatedUserData, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      } catch (err) {
        console.error('Error saving skill:', err);
        alert('Failed to save skill. Please try again.');
      }
    }
  };

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    });
  };
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

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading your profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          {error}
          {error.includes('log in') && (
            <div style={{marginTop: '16px'}}>
              <button 
                onClick={() => navigate('/login')}
                style={{
                  backgroundColor: 'hsl(238, 64%, 59%)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                Go to Login
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>No profile data found</div>
      </div>
    );
  }

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
                <span style={styles.avatarText}>{getInitials(userData.name)}</span>
              </div>
              <h2 style={styles.profileName}>{userData.name}</h2>
              <p style={styles.profileRole}>{userData.role}</p>
            </div>

            <div style={styles.contactInfo}>
              <div style={styles.contactItem}>
                <MapPin style={styles.contactIcon} />
                <span>{userData.location}</span>
              </div>
              <div style={styles.contactItem}>
                <Mail style={styles.contactIcon} />
                <span>{userData.email}</span>
              </div>
              <div style={styles.contactItem}>
                <Phone style={styles.contactIcon} />
                <span>{userData.phone}</span>
              </div>
              <div style={styles.contactItem}>
                <Calendar style={styles.contactIcon} />
                <span>Joined {formatDate(userData.joinDate)}</span>
              </div>
            </div>

            <button 
              style={styles.editButton}
              onClick={() => setIsEditing(true)}
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
                <span style={{...styles.statValue, color: 'hsl(142, 71%, 45%)'}}>{userData.stats?.coursesCompleted || 0}</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>Certificates Earned</span>
                <span style={{...styles.statValue, color: 'hsl(38, 92%, 50%)'}}>{userData.stats?.certificatesEarned || 0}</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>Learning Streak</span>
                <span style={{...styles.statValue, color: 'hsl(238, 64%, 59%)'}}>{userData.stats?.learningStreak || 0} days</span>
              </div>
              <div style={styles.statItem}>
                <span style={styles.statLabel}>Hours Learned</span>
                <span style={{...styles.statValue, color: 'hsl(221, 83%, 53%)'}}>{userData.stats?.hoursLearned || 0}h</span>
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
                onClick={() => {/* Could open skill addition modal */}}
                onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
                onMouseOut={(e) => e.target.style.textDecoration = 'none'}
              >
                Add Skills
              </a>
            </div>

            {/* Add new skill form */}
            <div style={styles.skillForm}>
              <input
                type="text"
                placeholder="Skill name"
                value={newSkill.name}
                onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                style={{...styles.input, flex: 1}}
              />
              <input
                type="text"
                placeholder="Category"
                value={newSkill.category}
                onChange={(e) => setNewSkill({...newSkill, category: e.target.value})}
                style={{...styles.input, flex: 1}}
              />
              <input
                type="number"
                min="0"
                max="100"
                value={newSkill.level}
                onChange={(e) => setNewSkill({...newSkill, level: parseInt(e.target.value)})}
                style={{...styles.input, width: '80px'}}
              />
              <button onClick={addSkill} style={styles.addButton}>
                <Plus style={{width: '12px', height: '12px'}} />
              </button>
            </div>
            
            <div style={styles.skillsGrid}>
              {userData.skills?.map((skill, index) => (
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
              {userData.certificates?.map((cert, index) => (
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
              {userData.learningActivity?.map((activity, index) => (
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

      {/* Edit Profile Modal */}
      {isEditing && (
        <div style={styles.editForm}>
          <div style={styles.editModal}>
            <div style={styles.editHeader}>
              <h3 style={styles.editTitle}>Edit Profile</h3>
              <button 
                style={styles.closeButton}
                onClick={() => setIsEditing(false)}
              >
                <X style={{width: '20px', height: '20px'}} />
              </button>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Name</label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Email</label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Phone</label>
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Location</label>
              <input
                type="text"
                value={editForm.location}
                onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Role/Aspiration</label>
              <input
                type="text"
                value={editForm.role}
                onChange={(e) => setEditForm({...editForm, role: e.target.value})}
                style={styles.input}
              />
            </div>

            <div style={{textAlign: 'right', marginTop: '24px'}}>
              <button 
                style={styles.cancelButton}
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button 
                style={styles.saveButton}
                onClick={saveProfile}
              >
                <Save style={{width: '16px', height: '16px', marginRight: '4px'}} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;