import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    backgroundColor: 'hsl(220, 14%, 96%)'
  },
  sidebar: {
    width: '350px',
    backgroundColor: 'hsl(0, 0%, 100%)',
    borderRight: '1px solid hsl(220, 13%, 91%)',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column'
  },
  sidebarHeader: {
    padding: '20px',
    borderBottom: '1px solid hsl(220, 13%, 91%)',
    backgroundColor: 'hsl(220, 14%, 96%)'
  },
  backButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'none',
    border: 'none',
    color: 'hsl(238, 64%, 59%)',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    marginBottom: '12px',
    padding: '4px 0'
  },
  courseTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'hsl(222, 47%, 11%)',
    margin: 0,
    lineHeight: '1.3'
  },
  lessonsList: {
    flex: 1,
    padding: '0'
  },
  lessonItem: {
    padding: '16px 20px',
    borderBottom: '1px solid hsl(220, 13%, 91%)',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: 'hsl(0, 0%, 100%)'
  },
  lessonItemActive: {
    backgroundColor: 'hsl(238, 64%, 95%)',
    borderLeft: '3px solid hsl(238, 64%, 59%)'
  },
  lessonItemHover: {
    backgroundColor: 'hsl(220, 14%, 96%)'
  },
  lessonTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'hsl(222, 47%, 11%)',
    marginBottom: '6px',
    lineHeight: '1.3'
  },
  lessonObjectives: {
    fontSize: '12px',
    color: 'hsl(215, 16%, 47%)',
    margin: 0,
    lineHeight: '1.4'
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  contentHeader: {
    padding: '20px 24px',
    backgroundColor: 'hsl(0, 0%, 100%)',
    borderBottom: '1px solid hsl(220, 13%, 91%)'
  },
  contentTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'hsl(222, 47%, 11%)',
    margin: '0 0 8px 0'
  },
  contentSubtitle: {
    fontSize: '14px',
    color: 'hsl(215, 16%, 47%)',
    margin: 0
  },
  contentBody: {
    flex: 1,
    padding: '24px',
    overflowY: 'auto',
    backgroundColor: 'hsl(0, 0%, 100%)'
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '200px',
    flexDirection: 'column',
    gap: '16px'
  },
  loadingSpinner: {
    width: '32px',
    height: '32px',
    border: '3px solid hsl(220, 13%, 91%)',
    borderTop: '3px solid hsl(238, 64%, 59%)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  loadingText: {
    color: 'hsl(215, 16%, 47%)',
    fontSize: '14px'
  },
  section: {
    marginBottom: '32px'
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: 'hsl(222, 47%, 11%)',
    marginBottom: '12px'
  },
  sectionContent: {
    fontSize: '14px',
    lineHeight: '1.6',
    color: 'hsl(222, 47%, 11%)',
    marginBottom: '16px'
  },
  examplesList: {
    marginBottom: '16px'
  },
  examplesTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'hsl(222, 47%, 11%)',
    marginBottom: '8px'
  },
  exampleItem: {
    fontSize: '14px',
    color: 'hsl(215, 16%, 47%)',
    marginBottom: '4px',
    paddingLeft: '16px',
    position: 'relative'
  },
  stepsList: {
    marginBottom: '16px'
  },
  stepsTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'hsl(222, 47%, 11%)',
    marginBottom: '8px'
  },
  stepItem: {
    fontSize: '14px',
    color: 'hsl(222, 47%, 11%)',
    marginBottom: '6px',
    paddingLeft: '20px',
    position: 'relative'
  },
  codeBlock: {
    backgroundColor: 'hsl(220, 14%, 96%)',
    border: '1px solid hsl(220, 13%, 91%)',
    borderRadius: '6px',
    padding: '16px',
    fontSize: '13px',
    fontFamily: 'Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
    color: 'hsl(222, 47%, 11%)',
    overflowX: 'auto',
    whiteSpace: 'pre-wrap'
  },
  paginationContainer: {
    padding: '16px 24px',
    backgroundColor: 'hsl(0, 0%, 100%)',
    borderTop: '1px solid hsl(220, 13%, 91%)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  paginationButton: {
    padding: '8px 16px',
    borderRadius: '6px',
    border: '1px solid hsl(220, 13%, 91%)',
    backgroundColor: 'hsl(0, 0%, 100%)',
    color: 'hsl(222, 47%, 11%)',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s ease'
  },
  paginationButtonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed'
  },
  paginationInfo: {
    fontSize: '14px',
    color: 'hsl(215, 16%, 47%)'
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: 'hsl(215, 16%, 47%)'
  }
};

// Add keyframe animation for spinner
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;
  
  if (!document.head.querySelector('#spinner-animation')) {
    styleElement.id = 'spinner-animation';
    document.head.appendChild(styleElement);
  }
}

const GenerateCourse = () => {
  const { courseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [lessonContent, setLessonContent] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Get course data from navigation state
    if (location.state?.course) {
      setCourse(location.state.course);
      // Auto-select first lesson
      if (location.state.course.lessons?.length > 0) {
        setSelectedLesson(location.state.course.lessons[0]);
      }
    }
  }, [location.state]);

  useEffect(() => {
    if (selectedLesson) {
      fetchLessonContent(selectedLesson.lessonTitle);
    }
  }, [selectedLesson]);

  const fetchLessonContent = async (lessonTitle) => {
    setIsLoading(true);
    setLessonContent(null);
    setCurrentPage(0);
    
    try {
      const response = await fetch('http://localhost:5000/lesson-explanation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ lessonTitle }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch lesson content');
      }

      const data = await response.json();
      setLessonContent(data);
    } catch (error) {
      console.error('Error fetching lesson content:', error);
      setLessonContent({ pages: [] });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
  };

  const handleBackClick = () => {
    navigate('/');
  };

  const nextPage = () => {
    if (lessonContent && currentPage < lessonContent.pages.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (!course) {
    return (
      <div style={styles.emptyState}>
        <h2>Course not found</h2>
        <button onClick={handleBackClick} style={styles.backButton}>
          ← Back to Courses
        </button>
      </div>
    );
  }

  const currentPageContent = lessonContent?.pages?.[currentPage];

  return (
    <div style={styles.container}>
      {/* Sidebar with lessons */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <button onClick={handleBackClick} style={styles.backButton}>
            ← Back to Courses
          </button>
          <h1 style={styles.courseTitle}>{course.title}</h1>
        </div>
        
        <div style={styles.lessonsList}>
          {course.lessons?.map((lesson, index) => (
            <div
              key={index}
              style={{
                ...styles.lessonItem,
                ...(selectedLesson === lesson ? styles.lessonItemActive : {})
              }}
              onClick={() => handleLessonClick(lesson)}
              onMouseEnter={(e) => {
                if (selectedLesson !== lesson) {
                  e.target.style.backgroundColor = 'hsl(220, 14%, 96%)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedLesson !== lesson) {
                  e.target.style.backgroundColor = 'hsl(0, 0%, 100%)';
                }
              }}
            >
              <h3 style={styles.lessonTitle}>{lesson.lessonTitle}</h3>
              <p style={styles.lessonObjectives}>
                {lesson.objectives?.slice(0, 2).join(' • ')}
                {lesson.objectives?.length > 2 ? '...' : ''}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Main content area */}
      <div style={styles.content}>
        <div style={styles.contentHeader}>
          <h1 style={styles.contentTitle}>
            {selectedLesson?.lessonTitle || 'Select a lesson'}
          </h1>
          {selectedLesson && (
            <p style={styles.contentSubtitle}>
              Learning objectives: {selectedLesson.objectives?.join(' • ')}
            </p>
          )}
        </div>

        <div style={styles.contentBody}>
          {isLoading ? (
            <div style={styles.loadingContainer}>
              <div style={styles.loadingSpinner}></div>
              <p style={styles.loadingText}>Loading lesson content...</p>
            </div>
          ) : currentPageContent ? (
            <div>
              {currentPageContent.sections?.map((section, index) => (
                <div key={index} style={styles.section}>
                  <h2 style={styles.sectionTitle}>{section.title}</h2>
                  
                  {section.content && (
                    <p style={styles.sectionContent}>{section.content}</p>
                  )}

                  {section.examples && section.examples.length > 0 && (
                    <div style={styles.examplesList}>
                      <h4 style={styles.examplesTitle}>Examples:</h4>
                      {section.examples.map((example, idx) => (
                        <div key={idx} style={styles.exampleItem}>
                          • {example}
                        </div>
                      ))}
                    </div>
                  )}

                  {section.steps && section.steps.length > 0 && (
                    <div style={styles.stepsList}>
                      <h4 style={styles.stepsTitle}>Steps:</h4>
                      {section.steps.map((step, idx) => (
                        <div key={idx} style={styles.stepItem}>
                          {idx + 1}. {step}
                        </div>
                      ))}
                    </div>
                  )}

                  {section.code && (
                    <pre style={styles.codeBlock}>{section.code}</pre>
                  )}
                </div>
              ))}
            </div>
          ) : selectedLesson ? (
            <div style={styles.emptyState}>
              <p>No content available for this lesson.</p>
            </div>
          ) : (
            <div style={styles.emptyState}>
              <h3>Welcome to {course.title}</h3>
              <p>Select a lesson from the sidebar to begin learning.</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {lessonContent && lessonContent.pages && lessonContent.pages.length > 1 && (
          <div style={styles.paginationContainer}>
            <button
              onClick={prevPage}
              disabled={currentPage === 0}
              style={{
                ...styles.paginationButton,
                ...(currentPage === 0 ? styles.paginationButtonDisabled : {})
              }}
            >
              ← Previous
            </button>
            
            <span style={styles.paginationInfo}>
              Page {currentPage + 1} of {lessonContent.pages.length}
            </span>
            
            <button
              onClick={nextPage}
              disabled={currentPage >= lessonContent.pages.length - 1}
              style={{
                ...styles.paginationButton,
                ...(currentPage >= lessonContent.pages.length - 1 ? styles.paginationButtonDisabled : {})
              }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateCourse;