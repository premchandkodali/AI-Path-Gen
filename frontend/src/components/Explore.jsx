import { Search, Star, Clock, Users, Filter } from "lucide-react";

const courses = [
  {
    id: 1,
    title: "Advanced Excel for Business",
    provider: "NCVET Certified Training",
    nsqfLevel: "NSQF Level 5",
    rating: 4.8,
    duration: "6 weeks",
    students: 1234,
    tags: ["Data Analytics", "Finance", "Business Intelligence"],
    price: "₹2,999",
    image: "📊"
  },
  {
    id: 2,
    title: "Digital Marketing Fundamentals",
    provider: "Skill India Initiative",
    nsqfLevel: "NSQF Level 4",
    rating: 4.6,
    duration: "4 weeks",
    students: 892,
    tags: ["Marketing", "SEO", "Social Media"],
    price: "₹1,999",
    image: "📱"
  },
  {
    id: 3,
    title: "Web Development Bootcamp",
    provider: "Tech Skills Academy",
    nsqfLevel: "NSQF Level 6",
    rating: 4.9,
    duration: "12 weeks",
    students: 2156,
    tags: ["Programming", "HTML", "CSS", "JavaScript"],
    price: "₹4,999",
    image: "💻"
  },
  {
    id: 4,
    title: "Financial Planning & Analysis",
    provider: "Finance Institute",
    nsqfLevel: "NSQF Level 7",
    rating: 4.7,
    duration: "8 weeks",
    students: 756,
    tags: ["Finance", "Analysis", "Planning"],
    price: "₹3,499",
    image: "💰"
  },
  {
    id: 5,
    title: "Machine Learning Basics",
    provider: "AI Learning Hub",
    nsqfLevel: "NSQF Level 6",
    rating: 4.8,
    duration: "10 weeks",
    students: 1543,
    tags: ["AI", "Python", "Data Science"],
    price: "₹5,999",
    image: "🤖"
  },
  {
    id: 6,
    title: "Graphic Design Essentials",
    provider: "Creative Academy",
    nsqfLevel: "NSQF Level 4",
    rating: 4.5,
    duration: "6 weeks",
    students: 987,
    tags: ["Design", "Photoshop", "Illustrator"],
    price: "₹2,499",
    image: "🎨"
  }
];

const categories = [
  "All Courses",
  "Data Science",
  "Programming",
  "Business",
  "Design",
  "Marketing",
  "Finance"
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
  searchSection: {
    marginBottom: '32px'
  },
  searchContainer: {
    display: 'flex',
    gap: '16px',
    marginBottom: '24px'
  },
  searchInputContainer: {
    flex: 1,
    position: 'relative'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: 'hsl(215, 16%, 47%)',
    width: '20px',
    height: '20px'
  },
  searchInput: {
    width: '100%',
    paddingLeft: '40px',
    paddingRight: '16px',
    paddingTop: '12px',
    paddingBottom: '12px',
    backgroundColor: 'hsl(0, 0%, 100%)',
    border: '1px solid hsl(220, 13%, 91%)',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s, box-shadow 0.2s'
  },
  filterButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '12px 16px',
    backgroundColor: 'hsl(0, 0%, 100%)',
    border: '1px solid hsl(220, 13%, 91%)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  categoryContainer: {
    display: 'flex',
    gap: '8px',
    overflowX: 'auto',
    paddingBottom: '8px'
  },
  categoryButton: {
    padding: '8px 16px',
    borderRadius: '9999px',
    fontSize: '14px',
    fontWeight: '500',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s',
    border: 'none',
    cursor: 'pointer'
  },
  categoryButtonActive: {
    backgroundColor: 'hsl(238, 64%, 59%)',
    color: 'white'
  },
  categoryButtonInactive: {
    backgroundColor: 'hsl(220, 13%, 91%)',
    color: 'hsl(215, 16%, 47%)'
  },
  courseGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px'
  },
  courseCard: {
    backgroundColor: 'hsl(0, 0%, 100%)',
    borderRadius: '12px',
    boxShadow: '0 1px 3px 0 hsl(0 0% 0% / 0.1)',
    border: '1px solid hsl(220, 13%, 91%)',
    overflow: 'hidden',
    transition: 'box-shadow 0.2s'
  },
  courseImage: {
    height: '192px',
    background: 'linear-gradient(135deg, hsl(238, 64%, 59%), hsl(238, 70%, 65%))',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px'
  },
  courseContent: {
    padding: '24px'
  },
  courseHeader: {
    marginBottom: '16px'
  },
  courseTitle: {
    fontWeight: 'bold',
    fontSize: '18px',
    marginBottom: '8px',
    color: 'hsl(222, 47%, 11%)'
  },
  courseProvider: {
    fontSize: '14px',
    color: 'hsl(215, 16%, 47%)',
    marginBottom: '4px'
  },
  courseLevel: {
    fontSize: '14px',
    fontWeight: '500',
    color: 'hsl(238, 64%, 59%)'
  },
  courseStats: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginBottom: '16px',
    fontSize: '14px',
    color: 'hsl(215, 16%, 47%)'
  },
  courseStat: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  courseTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginBottom: '16px'
  },
  courseTag: {
    padding: '4px 8px',
    backgroundColor: 'hsl(220, 13%, 91%)',
    color: 'hsl(215, 16%, 47%)',
    fontSize: '12px',
    borderRadius: '9999px'
  },
  courseFooter: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  coursePrice: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'hsl(238, 64%, 59%)'
  },
  enrollButton: {
    backgroundColor: 'hsl(238, 64%, 59%)',
    color: 'white',
    padding: '8px 16px',
    borderRadius: '8px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  loadMoreContainer: {
    textAlign: 'center',
    marginTop: '32px'
  },
  loadMoreButton: {
    backgroundColor: 'hsl(220, 13%, 91%)',
    color: 'hsl(215, 16%, 47%)',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  careerSection: {
    marginTop: '48px',
    backgroundColor: 'hsl(0, 0%, 100%)',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 1px 3px 0 hsl(0 0% 0% / 0.1)',
    border: '1px solid hsl(220, 13%, 91%)'
  },
  careerTitle: {
    fontWeight: '600',
    fontSize: '18px',
    marginBottom: '16px'
  },
  careerGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px'
  },
  careerCard: {
    padding: '16px',
    borderRadius: '8px',
    border: '1px solid'
  },
  careerCardTitle: {
    fontWeight: 'bold',
    marginBottom: '8px'
  },
  careerCardSalary: {
    fontSize: '14px',
    color: 'hsl(215, 16%, 47%)',
    marginBottom: '12px'
  },
  careerCardLink: {
    fontSize: '14px',
    fontWeight: '500',
    textDecoration: 'none',
    cursor: 'pointer'
  }
};

const Explore = () => {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Explore Courses & Careers</h1>
        <p style={styles.subtitle}>Discover new skills and advance your career with expert-led courses</p>
      </div>

      {/* Search and Filters */}
      <div style={styles.searchSection}>
        <div style={styles.searchContainer}>
          <div style={styles.searchInputContainer}>
            <Search style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search for skills, courses, or jobs..."
              style={styles.searchInput}
              onFocus={(e) => {
                e.target.style.borderColor = 'hsl(238, 64%, 59%)';
                e.target.style.boxShadow = '0 0 0 2px hsl(238, 64%, 59%, 0.2)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'hsl(220, 13%, 91%)';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          <button 
            style={styles.filterButton}
            onMouseOver={(e) => e.target.style.backgroundColor = 'hsl(220, 13%, 91%, 0.5)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'hsl(0, 0%, 100%)'}
          >
            <Filter style={{width: '20px', height: '20px'}} />
            <span>Filters</span>
          </button>
        </div>

        {/* Category Pills */}
        <div style={styles.categoryContainer}>
          {categories.map((category) => (
            <button
              key={category}
              style={{
                ...styles.categoryButton,
                ...(category === "All Courses" ? styles.categoryButtonActive : styles.categoryButtonInactive)
              }}
              onMouseOver={(e) => {
                if (category !== "All Courses") {
                  e.target.style.backgroundColor = 'hsl(220, 13%, 91%, 0.8)';
                }
              }}
              onMouseOut={(e) => {
                if (category !== "All Courses") {
                  e.target.style.backgroundColor = 'hsl(220, 13%, 91%)';
                }
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      <div style={styles.courseGrid}>
        {courses.map((course) => (
          <div 
            key={course.id} 
            style={styles.courseCard}
            onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 10px 15px -3px hsl(0 0% 0% / 0.1)'}
            onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 1px 3px 0 hsl(0 0% 0% / 0.1)'}
          >
            {/* Course Image/Icon */}
            <div style={styles.courseImage}>
              {course.image}
            </div>

            <div style={styles.courseContent}>
              {/* Course Header */}
              <div style={styles.courseHeader}>
                <h3 style={styles.courseTitle}>{course.title}</h3>
                <p style={styles.courseProvider}>{course.provider}</p>
                <p style={styles.courseLevel}>{course.nsqfLevel}</p>
              </div>

              {/* Course Stats */}
              <div style={styles.courseStats}>
                <div style={styles.courseStat}>
                  <Star style={{width: '16px', height: '16px', fill: 'hsl(38, 92%, 50%)', color: 'hsl(38, 92%, 50%)'}} />
                  <span>{course.rating}</span>
                </div>
                <div style={styles.courseStat}>
                  <Clock style={{width: '16px', height: '16px'}} />
                  <span>{course.duration}</span>
                </div>
                <div style={styles.courseStat}>
                  <Users style={{width: '16px', height: '16px'}} />
                  <span>{course.students}</span>
                </div>
              </div>

              {/* Tags */}
              <div style={styles.courseTags}>
                {course.tags.slice(0, 3).map((tag) => (
                  <span key={tag} style={styles.courseTag}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Price and Action */}
              <div style={styles.courseFooter}>
                <span style={styles.coursePrice}>{course.price}</span>
                <button 
                  style={styles.enrollButton}
                  onMouseOver={(e) => e.target.style.backgroundColor = 'hsl(238, 64%, 59%, 0.9)'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'hsl(238, 64%, 59%)'}
                >
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Load More */}
      <div style={styles.loadMoreContainer}>
        <button 
          style={styles.loadMoreButton}
          onMouseOver={(e) => e.target.style.backgroundColor = 'hsl(220, 13%, 91%, 0.8)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'hsl(220, 13%, 91%)'}
        >
          Load More Courses
        </button>
      </div>

      {/* Career Recommendations */}
      <div style={styles.careerSection}>
        <h3 style={styles.careerTitle}>Recommended Career Paths</h3>
        <div style={styles.careerGrid}>
          <div style={{
            ...styles.careerCard,
            backgroundColor: 'hsl(238, 64%, 59%, 0.05)',
            borderColor: 'hsl(238, 64%, 59%, 0.2)'
          }}>
            <h4 style={{...styles.careerCardTitle, color: 'hsl(238, 64%, 59%)'}}>Data Analyst</h4>
            <p style={styles.careerCardSalary}>Average Salary: ₹6-12 LPA</p>
            <a style={{...styles.careerCardLink, color: 'hsl(238, 64%, 59%)'}}>
              View Learning Path →
            </a>
          </div>
          <div style={{
            ...styles.careerCard,
            backgroundColor: 'hsl(142, 71%, 45%, 0.05)',
            borderColor: 'hsl(142, 71%, 45%, 0.2)'
          }}>
            <h4 style={{...styles.careerCardTitle, color: 'hsl(142, 71%, 45%)'}}>Full Stack Developer</h4>
            <p style={styles.careerCardSalary}>Average Salary: ₹8-18 LPA</p>
            <a style={{...styles.careerCardLink, color: 'hsl(142, 71%, 45%)'}}>
              View Learning Path →
            </a>
          </div>
          <div style={{
            ...styles.careerCard,
            backgroundColor: 'hsl(38, 92%, 50%, 0.05)',
            borderColor: 'hsl(38, 92%, 50%, 0.2)'
          }}>
            <h4 style={{...styles.careerCardTitle, color: 'hsl(38, 92%, 50%)'}}>Digital Marketer</h4>
            <p style={styles.careerCardSalary}>Average Salary: ₹4-10 LPA</p>
            <a style={{...styles.careerCardLink, color: 'hsl(38, 92%, 50%)'}}>
              View Learning Path →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;