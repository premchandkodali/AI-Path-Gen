import { MapPin, Building, Calendar, ExternalLink, Briefcase, TrendingUp, Users } from "lucide-react";

const jobOpenings = [
  {
    id: 1,
    title: "Junior Data Analyst",
    company: "Tech Solutions Pvt. Ltd.",
    location: "Vijayawada, Andhra Pradesh",
    type: "Full-time",
    experience: "0-2 years",
    salary: "₹3-6 LPA",
    postedDate: "2 days ago",
    skillsMatch: ["Python", "SQL", "Excel"],
    matchPercentage: 85,
    description: "Join our growing analytics team to help drive data-driven decisions across the organization."
  },
  {
    id: 2,
    title: "Business Intelligence Associate",
    company: "Data Insights Corp",
    location: "Hyderabad, Telangana",
    type: "Full-time",
    experience: "1-3 years",
    salary: "₹4-8 LPA",
    postedDate: "1 week ago",
    skillsMatch: ["Tableau", "SQL", "Statistics"],
    matchPercentage: 78,
    description: "Create compelling visualizations and reports to support strategic business decisions."
  },
  {
    id: 3,
    title: "Data Science Intern",
    company: "Innovation Labs",
    location: "Bangalore, Karnataka",
    type: "Internship",
    experience: "0-1 years",
    salary: "₹15-25k/month",
    postedDate: "3 days ago",
    skillsMatch: ["Python", "Machine Learning", "Pandas"],
    matchPercentage: 92,
    description: "Work with our data science team on exciting ML projects and gain hands-on experience."
  },
  {
    id: 4,
    title: "Marketing Data Analyst",
    company: "Growth Marketing Co",
    location: "Mumbai, Maharashtra",
    type: "Full-time",
    experience: "2-4 years",
    salary: "₹6-10 LPA",
    postedDate: "5 days ago",
    skillsMatch: ["Google Analytics", "SQL", "Data Visualization"],
    matchPercentage: 71,
    description: "Analyze marketing campaigns and customer behavior to optimize ROI and growth strategies."
  }
];

const careerInsights = [
  {
    title: "Data Analyst",
    growth: "+23%",
    avgSalary: "₹6.2 LPA",
    openings: "2.4k",
    icon: "📊"
  },
  {
    title: "Business Analyst",
    growth: "+18%",
    avgSalary: "₹5.8 LPA",
    openings: "1.8k",
    icon: "💼"
  },
  {
    title: "Data Scientist",
    growth: "+31%",
    avgSalary: "₹12.5 LPA",
    openings: "1.2k",
    icon: "🔬"
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
  insightsCard: {
    marginBottom: '32px',
    backgroundColor: 'hsl(0, 0%, 100%)',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px 0 hsl(0 0% 0% / 0.1)',
    border: '1px solid hsl(220, 13%, 91%)'
  },
  insightsTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'hsl(222, 47%, 11%)',
    marginBottom: '16px'
  },
  insightsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px'
  },
  insightItem: {
    padding: '16px',
    backgroundColor: 'hsl(220, 13%, 91%, 0.3)',
    borderRadius: '8px'
  },
  insightHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '12px'
  },
  insightIcon: {
    fontSize: '24px'
  },
  insightTitle: {
    fontWeight: '600',
    color: 'hsl(222, 47%, 11%)'
  },
  insightStats: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    fontSize: '14px'
  },
  insightStat: {
    display: 'flex',
    justifyContent: 'space-between'
  },
  insightLabel: {
    color: 'hsl(215, 16%, 47%)'
  },
  insightValue: {
    fontWeight: '600'
  },
  aiBanner: {
    marginBottom: '32px',
    background: 'linear-gradient(135deg, hsl(238, 64%, 59%), hsl(238, 70%, 65%))',
    borderRadius: '12px',
    padding: '24px',
    color: 'white'
  },
  aiBannerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  aiBannerIcon: {
    width: '64px',
    height: '64px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  aiBannerText: {},
  aiBannerTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '8px'
  },
  aiBannerSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: '12px'
  },
  aiBannerButton: {
    backgroundColor: 'white',
    color: 'hsl(238, 64%, 59%)',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  jobsHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px'
  },
  jobsTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'hsl(222, 47%, 11%)'
  },
  viewAllLink: {
    color: 'hsl(238, 64%, 59%)',
    fontWeight: '500',
    textDecoration: 'none',
    cursor: 'pointer'
  },
  jobsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  jobCard: {
    backgroundColor: 'hsl(0, 0%, 100%)',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px 0 hsl(0 0% 0% / 0.1)',
    border: '1px solid hsl(220, 13%, 91%)',
    transition: 'box-shadow 0.2s'
  },
  jobHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: '16px'
  },
  jobLeft: {
    flex: 1
  },
  jobCompanyInfo: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    marginBottom: '12px'
  },
  jobIcon: {
    width: '48px',
    height: '48px',
    backgroundColor: 'hsl(238, 64%, 59%, 0.1)',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  jobDetails: {
    flex: 1
  },
  jobTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'hsl(222, 47%, 11%)',
    marginBottom: '4px'
  },
  jobMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    fontSize: '14px',
    color: 'hsl(215, 16%, 47%)'
  },
  jobMetaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  jobDescription: {
    color: 'hsl(215, 16%, 47%)',
    marginBottom: '16px'
  },
  jobTags: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '16px',
    fontSize: '14px'
  },
  jobTag: {
    padding: '4px 12px',
    borderRadius: '9999px'
  },
  jobRight: {
    textAlign: 'right'
  },
  matchBadge: {
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '12px'
  },
  matchProgress: {
    width: '96px',
    backgroundColor: 'hsl(220, 13%, 91%)',
    borderRadius: '9999px',
    height: '8px'
  },
  matchProgressFill: {
    backgroundColor: 'hsl(238, 64%, 59%)',
    height: '8px',
    borderRadius: '9999px'
  },
  jobFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  skillsSection: {},
  skillsLabel: {
    fontSize: '14px',
    color: 'hsl(215, 16%, 47%)',
    marginBottom: '8px',
    display: 'block'
  },
  skillsList: {
    display: 'flex',
    gap: '8px'
  },
  skillTag: {
    backgroundColor: 'hsl(142, 71%, 45%, 0.1)',
    color: 'hsl(142, 71%, 45%)',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500'
  },
  jobActions: {
    display: 'flex',
    gap: '8px'
  },
  saveButton: {
    backgroundColor: 'hsl(220, 13%, 91%)',
    color: 'hsl(215, 16%, 47%)',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  applyButton: {
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
    gap: '8px'
  },
  resourcesCard: {
    marginTop: '48px',
    backgroundColor: 'hsl(0, 0%, 100%)',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px 0 hsl(0 0% 0% / 0.1)',
    border: '1px solid hsl(220, 13%, 91%)'
  },
  resourcesTitle: {
    fontWeight: '600',
    fontSize: '18px',
    marginBottom: '16px'
  },
  resourcesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '16px'
  },
  resourceItem: {
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid'
  },
  resourceHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '8px'
  },
  resourceTitle: {
    fontWeight: 'bold'
  },
  resourceDescription: {
    fontSize: '14px',
    color: 'hsl(215, 16%, 47%)',
    marginBottom: '12px'
  },
  resourceLink: {
    fontSize: '14px',
    fontWeight: '500',
    textDecoration: 'none',
    cursor: 'pointer'
  }
};

const CareerHub = () => {
  const getMatchColor = (percentage) => {
    if (percentage >= 80) return { color: 'hsl(142, 71%, 45%)', backgroundColor: 'hsl(142, 71%, 45%, 0.1)' };
    if (percentage >= 60) return { color: 'hsl(38, 92%, 50%)', backgroundColor: 'hsl(38, 92%, 50%, 0.1)' };
    return { color: 'hsl(221, 83%, 53%)', backgroundColor: 'hsl(221, 83%, 53%, 0.1)' };
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Career Hub</h1>
        <p style={styles.subtitle}>Discover AI-matched job opportunities and career insights tailored for you</p>
      </div>

      {/* Career Insights */}
      <div style={styles.insightsCard}>
        <h2 style={styles.insightsTitle}>Career Market Insights</h2>
        <div style={styles.insightsGrid}>
          {careerInsights.map((insight, index) => (
            <div key={index} style={styles.insightItem}>
              <div style={styles.insightHeader}>
                <span style={styles.insightIcon}>{insight.icon}</span>
                <h3 style={styles.insightTitle}>{insight.title}</h3>
              </div>
              <div style={styles.insightStats}>
                <div style={styles.insightStat}>
                  <span style={styles.insightLabel}>Job Growth:</span>
                  <span style={{...styles.insightValue, color: 'hsl(142, 71%, 45%)'}}>{insight.growth}</span>
                </div>
                <div style={styles.insightStat}>
                  <span style={styles.insightLabel}>Avg Salary:</span>
                  <span style={styles.insightValue}>{insight.avgSalary}</span>
                </div>
                <div style={styles.insightStat}>
                  <span style={styles.insightLabel}>Open Positions:</span>
                  <span style={styles.insightValue}>{insight.openings}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Match Banner */}
      <div style={styles.aiBanner}>
        <div style={styles.aiBannerContent}>
          <div style={styles.aiBannerIcon}>
            <TrendingUp style={{width: '32px', height: '32px'}} />
          </div>
          <div style={styles.aiBannerText}>
            <h2 style={styles.aiBannerTitle}>AI-Powered Job Matching</h2>
            <p style={styles.aiBannerSubtitle}>Our AI analyzes your skills, learning progress, and career goals to find the perfect opportunities</p>
            <button 
              style={styles.aiBannerButton}
              onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'white'}
            >
              Update Preferences
            </button>
          </div>
        </div>
      </div>

      {/* Job Openings */}
      <div>
        <div style={styles.jobsHeader}>
          <h2 style={styles.jobsTitle}>AI-Matched Job Openings for You</h2>
          <a 
            style={styles.viewAllLink}
            onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
            onMouseOut={(e) => e.target.style.textDecoration = 'none'}
          >
            View All Jobs →
          </a>
        </div>

        <div style={styles.jobsList}>
          {jobOpenings.map((job) => (
            <div 
              key={job.id} 
              style={styles.jobCard}
              onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px hsl(0 0% 0% / 0.1)'}
              onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 1px 3px 0 hsl(0 0% 0% / 0.1)'}
            >
              <div style={styles.jobHeader}>
                <div style={styles.jobLeft}>
                  <div style={styles.jobCompanyInfo}>
                    <div style={styles.jobIcon}>
                      <Briefcase style={{width: '24px', height: '24px', color: 'hsl(238, 64%, 59%)'}} />
                    </div>
                    <div style={styles.jobDetails}>
                      <h3 style={styles.jobTitle}>{job.title}</h3>
                      <div style={styles.jobMeta}>
                        <div style={styles.jobMetaItem}>
                          <Building style={{width: '16px', height: '16px'}} />
                          <span>{job.company}</span>
                        </div>
                        <div style={styles.jobMetaItem}>
                          <MapPin style={{width: '16px', height: '16px'}} />
                          <span>{job.location}</span>
                        </div>
                        <div style={styles.jobMetaItem}>
                          <Calendar style={{width: '16px', height: '16px'}} />
                          <span>{job.postedDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <p style={styles.jobDescription}>{job.description}</p>
                  
                  <div style={styles.jobTags}>
                    <span style={{...styles.jobTag, backgroundColor: 'hsl(220, 13%, 91%)', color: 'hsl(215, 16%, 47%)'}}>
                      {job.type}
                    </span>
                    <span style={{...styles.jobTag, backgroundColor: 'hsl(220, 13%, 91%)', color: 'hsl(215, 16%, 47%)'}}>
                      {job.experience}
                    </span>
                    <span style={{...styles.jobTag, backgroundColor: 'hsl(238, 64%, 59%, 0.1)', color: 'hsl(238, 64%, 59%)', fontWeight: '500'}}>
                      {job.salary}
                    </span>
                  </div>
                </div>

                <div style={styles.jobRight}>
                  <div style={{
                    ...styles.matchBadge,
                    ...getMatchColor(job.matchPercentage)
                  }}>
                    {job.matchPercentage}% Match
                  </div>
                  <div style={styles.matchProgress}>
                    <div 
                      style={{
                        ...styles.matchProgressFill,
                        width: `${job.matchPercentage}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              <div style={styles.jobFooter}>
                <div style={styles.skillsSection}>
                  <span style={styles.skillsLabel}>Key Skills Match:</span>
                  <div style={styles.skillsList}>
                    {job.skillsMatch.map((skill) => (
                      <span key={skill} style={styles.skillTag}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div style={styles.jobActions}>
                  <button 
                    style={styles.saveButton}
                    onMouseOver={(e) => e.target.style.backgroundColor = 'hsl(220, 13%, 91%, 0.8)'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'hsl(220, 13%, 91%)'}
                  >
                    Save Job
                  </button>
                  <button 
                    style={styles.applyButton}
                    onMouseOver={(e) => e.target.style.backgroundColor = 'hsl(238, 64%, 59%, 0.9)'}
                    onMouseOut={(e) => e.target.style.backgroundColor = 'hsl(238, 64%, 59%)'}
                  >
                    Apply Now
                    <ExternalLink style={{width: '16px', height: '16px'}} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Career Resources */}
      <div style={styles.resourcesCard}>
        <h3 style={styles.resourcesTitle}>Career Resources</h3>
        <div style={styles.resourcesGrid}>
          <div style={{
            ...styles.resourceItem,
            backgroundColor: 'hsl(221, 83%, 53%, 0.05)',
            borderColor: 'hsl(221, 83%, 53%, 0.2)'
          }}>
            <div style={styles.resourceHeader}>
              <Users style={{width: '20px', height: '20px', color: 'hsl(221, 83%, 53%)'}} />
              <h4 style={{...styles.resourceTitle, color: 'hsl(221, 83%, 53%)'}}>Resume Builder</h4>
            </div>
            <p style={styles.resourceDescription}>Create a professional resume tailored for data roles</p>
            <a 
              style={{...styles.resourceLink, color: 'hsl(221, 83%, 53%)'}}
              onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
              onMouseOut={(e) => e.target.style.textDecoration = 'none'}
            >
              Build Resume →
            </a>
          </div>
          <div style={{
            ...styles.resourceItem,
            backgroundColor: 'hsl(38, 92%, 50%, 0.05)',
            borderColor: 'hsl(38, 92%, 50%, 0.2)'
          }}>
            <div style={styles.resourceHeader}>
              <TrendingUp style={{width: '20px', height: '20px', color: 'hsl(38, 92%, 50%)'}} />
              <h4 style={{...styles.resourceTitle, color: 'hsl(38, 92%, 50%)'}}>Interview Prep</h4>
            </div>
            <p style={styles.resourceDescription}>Practice common data analyst interview questions</p>
            <a 
              style={{...styles.resourceLink, color: 'hsl(38, 92%, 50%)'}}
              onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
              onMouseOut={(e) => e.target.style.textDecoration = 'none'}
            >
              Start Practice →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerHub;