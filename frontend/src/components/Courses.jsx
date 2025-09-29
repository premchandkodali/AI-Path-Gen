import React, { useState, useEffect } from "react";
import axios from 'axios';
import TalkingAvatar from "./TalkingAvatar";

const styles = {
  container: {
    padding: '24px',
    animation: 'fadeIn 0.3s ease-out'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '32px'
  },
  headerContent: {
    flex: 1
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
  generateSection: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center'
  },
  inputBox: {
    padding: '10px 16px',
    borderRadius: '8px',
    border: '1px solid hsl(220, 13%, 91%)',
    backgroundColor: 'hsl(0, 0%, 100%)',
    color: 'hsl(222, 47%, 11%)',
    fontSize: '14px',
    width: '300px',
    outline: 'none',
    transition: 'border-color 0.2s ease'
  },
  generateButton: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: 'hsl(238, 64%, 59%)',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  },

  coursesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
    gap: '16px'
  },
  courseCard: {
    backgroundColor: 'hsl(0, 0%, 100%)',
    borderRadius: '8px',
    border: '1px solid hsl(220, 13%, 91%)',
    boxShadow: '0 1px 3px 0 hsl(0 0% 0% / 0.1)',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    height: '180px',
    display: 'flex',
    flexDirection: 'column'
  },
  courseCardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 10px 15px -3px hsl(0 0% 0% / 0.1)'
  },
  courseImage: {
    width: '100%',
    height: '90px',
    objectFit: 'cover',
    backgroundColor: 'hsl(220, 13%, 91%)'
  },
  courseContent: {
    padding: '12px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  courseHeader: {
    marginBottom: '12px'
  },
  courseTitle: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: 'hsl(222, 47%, 11%)',
    marginBottom: '8px',
    lineHeight: '1.2',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical'
  },

  progressSection: {
    marginBottom: '16px'
  },
  progressHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  progressLabel: {
    fontSize: '14px',
    fontWeight: '500',
    color: 'hsl(222, 47%, 11%)'
  },
  progressPercentage: {
    fontSize: '14px',
    fontWeight: '600'
  },
  progressBar: {
    width: '100%',
    backgroundColor: 'hsl(220, 13%, 91%)',
    borderRadius: '4px',
    height: '6px'
  },
  progressFill: {
    height: '6px',
    borderRadius: '4px',
    transition: 'width 0.3s ease'
  },

  // Course View Layout Styles - Modern Premium Design
  courseViewContainer: {
    display: 'flex',
    height: '100vh',
    backgroundColor: 'hsl(220, 16%, 99%)',
    borderRadius: '16px',
    overflow: 'hidden',
    border: '1px solid hsl(220, 13%, 89%)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08)'
  },
  sidebar: {
    width: '320px',
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
  courseViewTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: 'hsl(222, 47%, 11%)',
    margin: 0,
    lineHeight: '1.3'
  },
  lessonsList: {
    flex: 1,
    padding: 0
  },
  lessonItem: {
    padding: '16px 20px',
    margin: '0 0 1px 0',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: 'hsl(0, 0%, 100%)',
    borderBottom: '1px solid hsl(220, 13%, 91%)'
  },
  lessonItemActive: {
    backgroundColor: 'hsl(238, 64%, 95%)',
    borderLeft: '3px solid hsl(238, 64%, 59%)'
  },
  lessonTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: 'hsl(222, 47%, 11%)',
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
    padding: '32px 32px 0 32px',
    background: 'linear-gradient(135deg, hsl(0, 0%, 100%) 0%, hsl(220, 20%, 99%) 100%)'
  },
  contentTitle: {
    fontSize: '28px',
    fontWeight: '800',
    color: 'hsl(222, 47%, 11%)',
    margin: '0 0 12px 0',
    lineHeight: '1.3'
  },
  contentSubtitle: {
    fontSize: '16px',
    color: 'hsl(215, 16%, 47%)',
    margin: '0 0 24px 0',
    fontWeight: '500',
    lineHeight: '1.6'
  },
  contentBody: {
    flex: 1,
    padding: '0 32px 32px 32px',
    overflowY: 'auto',
    backgroundColor: 'hsl(0, 0%, 100%)'
  },
  section: {
    marginBottom: '40px',
    backgroundColor: 'hsl(0, 0%, 100%)',
    borderRadius: '16px',
    padding: '28px',
    border: '1px solid hsl(220, 13%, 93%)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
    transition: 'all 0.3s ease'
  },
  sectionTitle: {
    fontSize: '22px',
    fontWeight: '700',
    color: 'hsl(222, 47%, 11%)',
    marginBottom: '16px',
    position: 'relative',
    paddingBottom: '8px',
    borderBottom: '2px solid hsl(238, 64%, 90%)'
  },
  sectionContent: {
    fontSize: '16px',
    lineHeight: '1.8',
    color: 'hsl(222, 47%, 11%)',
    marginBottom: '20px',
    fontWeight: '400'
  },
  exampleContainer: {
    backgroundColor: 'hsl(220, 20%, 98%)',
    borderLeft: '4px solid hsl(142, 71%, 45%)',
    borderRadius: '0 12px 12px 0',
    padding: '20px',
    marginBottom: '20px'
  },
  exampleTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'hsl(142, 71%, 35%)',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  exampleItem: {
    fontSize: '15px',
    color: 'hsl(222, 47%, 11%)',
    marginBottom: '8px',
    paddingLeft: '20px',
    position: 'relative',
    lineHeight: '1.6'
  },
  stepsContainer: {
    backgroundColor: 'hsl(238, 70%, 98%)',
    borderLeft: '4px solid hsl(238, 64%, 59%)',
    borderRadius: '0 12px 12px 0',
    padding: '20px',
    marginBottom: '20px'
  },
  stepsTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: 'hsl(238, 64%, 49%)',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  stepItem: {
    fontSize: '15px',
    color: 'hsl(222, 47%, 11%)',
    marginBottom: '12px',
    paddingLeft: '32px',
    position: 'relative',
    lineHeight: '1.6',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px'
  },
  stepNumber: {
    backgroundColor: 'hsl(238, 64%, 59%)',
    color: 'white',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '700',
    flexShrink: 0,
    marginTop: '2px'
  },
  codeContainer: {
    backgroundColor: 'hsl(222, 47%, 8%)',
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '20px',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid hsl(220, 13%, 20%)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
  },
  codeHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px'
  },
  codeDots: {
    display: 'flex',
    gap: '6px'
  },
  codeDot: {
    width: '12px',
    height: '12px',
    borderRadius: '50%'
  },
  codeBlock: {
    backgroundColor: 'transparent',
    border: 'none',
    padding: '0',
    fontSize: '14px',
    fontFamily: 'Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',
    color: 'hsl(210, 40%, 85%)',
    overflowX: 'auto',
    whiteSpace: 'pre-wrap',
    lineHeight: '1.6'
  },
  paginationContainer: {
    padding: '24px 32px',
    background: 'linear-gradient(135deg, hsl(220, 20%, 98%) 0%, hsl(0, 0%, 100%) 100%)',
    borderTop: '1px solid hsl(220, 13%, 91%)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  paginationButton: {
    padding: '12px 24px',
    borderRadius: '12px',
    border: '1px solid hsl(238, 64%, 59%)',
    backgroundColor: 'hsl(0, 0%, 100%)',
    color: 'hsl(238, 64%, 59%)',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '600',
    transition: 'all 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '0 2px 8px rgba(99, 102, 241, 0.1)'
  },
  paginationButtonActive: {
    backgroundColor: 'hsl(238, 64%, 59%)',
    color: 'white',
    transform: 'translateY(-1px)',
    boxShadow: '0 4px 16px rgba(99, 102, 241, 0.2)'
  },
  paginationButtonDisabled: {
    opacity: 0.4,
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: 'none'
  },
  paginationInfo: {
    fontSize: '15px',
    color: 'hsl(215, 16%, 47%)',
    fontWeight: '600',
    padding: '8px 16px',
    backgroundColor: 'hsl(220, 20%, 96%)',
    borderRadius: '8px'
  },
  highlightedWord: {
    color: '#3b82f6',
    backgroundColor: 'transparent',
    fontWeight: 'bold'
  }

};

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);

  // Load saved courses from backend
  const loadSavedCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setIsLoadingCourses(false);
        return;
      }

      const response = await axios.get('http://localhost:5002/api/courses', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Transform backend courses to match frontend format
      const transformedCourses = response.data.courses.map(course => ({
        id: course._id,
        title: course.courseTitle,
        thumbnail: course.thumbnail || '/placeholder.svg',
        progress: course.progressPercentage || 0,
        lessons: course.lessons || [],
        originalCourse: course // Keep reference to original course data
      }));

      setCourses(transformedCourses);
    } catch (error) {
      console.error('Error loading saved courses:', error);
      // If unauthorized, just continue without courses
      if (error.response?.status !== 401) {
        alert('Failed to load saved courses');
      }
    } finally {
      setIsLoadingCourses(false);
    }
  };

  useEffect(() => {
    loadSavedCourses();
  }, []);
  
  const getProgressColor = (progress) => {
    if (progress === 0) return 'hsl(215, 16%, 47%)';
    if (progress === 100) return 'hsl(142, 71%, 45%)';
    return 'hsl(238, 64%, 59%)';
  };

  const generateCourse = async () => {
    if (!inputValue.trim()) {
      alert('Please enter a course topic or skill');
      return;
    }

    setIsLoading(true);
    try {
      // Step 1: Generate course structure
      const courseResponse = await fetch('http://localhost:5000/generate-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: inputValue }),
      });

      if (!courseResponse.ok) {
        throw new Error('Failed to generate course');
      }

      const courseData = await courseResponse.json();
      
      // Step 2: Generate content for all lessons automatically
      const lessonsWithContent = [];
      for (let i = 0; i < courseData.lessons.length; i++) {
        const lesson = courseData.lessons[i];
        try {
          const contentResponse = await fetch('http://localhost:5000/lesson-explanation', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ lessonTitle: lesson.lessonTitle }),
          });

          if (contentResponse.ok) {
            const contentData = await contentResponse.json();
            lessonsWithContent.push({
              ...lesson,
              content: contentData.pages || []
            });
          } else {
            lessonsWithContent.push({
              ...lesson,
              content: []
            });
          }
        } catch (error) {
          console.error(`Error generating content for lesson ${lesson.lessonTitle}:`, error);
          lessonsWithContent.push({
            ...lesson,
            content: []
          });
        }
      }

      // Step 3: Save course to database
      const token = localStorage.getItem('token');
      let savedCourse = null;
      
      if (token) {
        try {
          const coursePayload = {
            courseTitle: courseData.courseTitle,
            description: courseData.description || `A comprehensive course about ${inputValue}`,
            topic: inputValue,
            lessons: lessonsWithContent.map((lesson, index) => ({
              lessonTitle: lesson.lessonTitle,
              objectives: lesson.objectives || [],
              content: (lesson.content || []).map((page, pageIndex) => ({
                pageNumber: pageIndex + 1,
                sections: (page.sections || []).map(section => ({
                  title: section.title || 'Section Title',
                  content: section.content || '',
                  examples: section.examples || [],
                  steps: section.steps || [],
                  code: section.code || '',
                  order: 0
                }))
              })),
              order: index + 1
            })),
            difficulty: courseData.difficulty || 'beginner',
            tags: [inputValue]
          };

          const saveResponse = await axios.post('http://localhost:5002/api/courses', coursePayload, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          savedCourse = saveResponse.data;
          console.log('Course saved successfully:', savedCourse);
        } catch (saveError) {
          console.error('Error saving course to database:', saveError);
          alert('Course generated but failed to save. You can still view it now.');
        }
      }

      // Step 4: Create the complete course object for immediate display
      const newCourse = {
        id: savedCourse?._id || Date.now(),
        title: courseData.courseTitle,
        thumbnail: '/placeholder.svg',
        progress: 0,
        lessons: lessonsWithContent,
        originalCourse: savedCourse
      };

      // Step 5: Update courses list and display immediately
      if (savedCourse) {
        setCourses(prev => [newCourse, ...prev]);
      }
      
      setSelectedCourse(newCourse);
      setSelectedLesson(lessonsWithContent[0] || null);
      setCurrentPage(0);
      setInputValue('');
      
    } catch (error) {
      console.error('Error generating course:', error);
      alert('Failed to generate course. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCourseClick = async (course) => {
    try {
      // If course has originalCourse data and is saved in database, fetch fresh data
      if (course.originalCourse && course.originalCourse._id) {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get(`http://localhost:5002/api/courses/${course.originalCourse._id}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          // Transform the fetched course data
          const fetchedCourse = {
            id: response.data._id,
            title: response.data.courseTitle,
            thumbnail: response.data.thumbnail || '/placeholder.svg',
            progress: response.data.progressPercentage || 0,
            lessons: response.data.lessons || [],
            originalCourse: response.data
          };
          
          setSelectedCourse(fetchedCourse);
          setSelectedLesson(fetchedCourse.lessons[0] || null);
          setCurrentPage(0);
          return;
        }
      }
    } catch (error) {
      console.error('Error fetching course from database:', error);
      // Fall back to using the course data we have
    }
    
    // Fallback: use the course data we already have
    setSelectedCourse(course);
    setSelectedLesson(course.lessons[0] || null);
    setCurrentPage(0);
  };

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
    setCurrentPage(0);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setSelectedLesson(null);
    setCurrentPage(0);
  };

  const nextPage = () => {
    if (selectedLesson && selectedLesson.content && currentPage < selectedLesson.content.length - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };



  // Helper function to render text with highlighted words for speech
  const renderTextWithHighlights = (text) => {
    if (!text) return '';
    
    // Split by spaces but keep spaces
    const parts = text.split(/(\s+)/);
    let wordIndex = 0;
    
    return parts.map((part, index) => {
      // If it's not whitespace, it's a word
      const isWord = !part.match(/^\s+$/) && part.trim().length > 0;
      const isHighlighted = isWord && wordIndex === currentWordIndex;
      
      if (isWord) {
        wordIndex++;
      }
      
      return (
        <span
          key={index}
          style={isHighlighted ? styles.highlightedWord : {}}
        >
          {part}
        </span>
      );
    });
  };

  // Get current lesson content as text for speech (content only, matching what's displayed)
  const getCurrentLessonText = () => {
    if (!selectedLesson || !selectedLesson.content || !selectedLesson.content[currentPage]) return '';
    
    const pageContent = selectedLesson.content[currentPage];
    let text = '';
    
    pageContent.sections?.forEach(section => {
      // Only include content text, not titles, to match what's highlighted
      if (section.content) text += section.content + ' ';
      if (section.examples) text += section.examples.join(' ') + ' ';
      if (section.steps) text += section.steps.join(' ') + ' ';
    });
    
    return text.trim();
  };

  // If a course is selected, show the course view
  if (selectedCourse) {
    const currentPageContent = selectedLesson && selectedLesson.content ? selectedLesson.content[currentPage] : null;
    const currentLessonText = getCurrentLessonText();

    return (
      <div style={styles.container}>
        <div style={styles.courseViewContainer}>
          {/* Left Sidebar - Lessons */}
          <div style={styles.sidebar}>
            <div style={styles.sidebarHeader}>
              <button 
                onClick={handleBackToCourses} 
                style={styles.backButton}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                }}
              >
                ← Back to Courses
              </button>
              <h1 style={styles.courseViewTitle}>{selectedCourse.title}</h1>
            </div>
            
            {/* Talking Avatar */}
            <div style={{ padding: '16px' }}>
              <TalkingAvatar 
                text={currentLessonText}
                setCurrentWordIndex={setCurrentWordIndex}
              />
            </div>
            
            <div style={styles.lessonsList}>
              {selectedCourse.lessons?.map((lesson, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.lessonItem,
                    ...(selectedLesson === lesson ? styles.lessonItemActive : {})
                  }}
                  onClick={() => handleLessonClick(lesson)}
                  onMouseEnter={(e) => {
                    if (selectedLesson !== lesson) {
                      e.currentTarget.style.backgroundColor = 'hsl(220, 14%, 96%)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedLesson !== lesson) {
                      e.currentTarget.style.backgroundColor = 'hsl(0, 0%, 100%)';
                    }
                  }}
                >
                  <h3 style={styles.lessonTitle}>
                    {lesson.lessonTitle}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content Area */}
          <div style={styles.content}>
            <div style={styles.contentHeader}>
              <h1 style={styles.contentTitle}>
                {selectedLesson?.lessonTitle || 'Select a lesson to begin'}
              </h1>
              {selectedLesson && (
                <div style={styles.contentSubtitle}>
                  <strong>🎯 Learning Objectives:</strong> {selectedLesson.objectives?.join(' • ')}
                </div>
              )}
            </div>

            <div style={styles.contentBody}>
              {currentPageContent ? (
                <div>
                  {currentPageContent.sections?.map((section, index) => (
                    <div key={index} style={styles.section}>
                      <h2 style={styles.sectionTitle}>
                        ✨ {section.title}
                      </h2>
                      
                      {section.content && (
                        <div style={styles.sectionContent}>
                          {renderTextWithHighlights(section.content)}
                        </div>
                      )}

                      {section.examples && section.examples.length > 0 && (
                        <div style={styles.exampleContainer}>
                          <h4 style={styles.exampleTitle}>
                            💡 Examples
                          </h4>
                          {section.examples.map((example, idx) => (
                            <div key={idx} style={styles.exampleItem}>
                              <span style={{
                                position: 'absolute',
                                left: '0',
                                color: 'hsl(142, 71%, 45%)',
                                fontWeight: '700'
                              }}>
                                •
                              </span>
                              {renderTextWithHighlights(example)}
                            </div>
                          ))}
                        </div>
                      )}

                      {section.steps && section.steps.length > 0 && (
                        <div style={styles.stepsContainer}>
                          <h4 style={styles.stepsTitle}>
                            📋 Step-by-Step Guide
                          </h4>
                          {section.steps.map((step, idx) => (
                            <div key={idx} style={styles.stepItem}>
                              <div style={styles.stepNumber}>
                                {idx + 1}
                              </div>
                              <div>
                                {renderTextWithHighlights(step)}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {section.code && (
                        <div style={styles.codeContainer}>
                          <div style={styles.codeHeader}>
                            <div style={styles.codeDots}>
                              <div style={{...styles.codeDot, backgroundColor: '#ff5f56'}}></div>
                              <div style={{...styles.codeDot, backgroundColor: '#ffbd2e'}}></div>
                              <div style={{...styles.codeDot, backgroundColor: '#27ca3f'}}></div>
                            </div>
                            <span style={{ 
                              color: 'hsl(210, 40%, 85%)', 
                              fontSize: '13px',
                              fontWeight: '600',
                              marginLeft: '12px'
                            }}>
                              💻 Code Example
                            </span>
                          </div>
                          <pre style={styles.codeBlock}>
                            {section.code}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : selectedLesson ? (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '60px 20px', 
                  color: 'hsl(215, 16%, 47%)',
                  backgroundColor: 'hsl(220, 20%, 98%)',
                  borderRadius: '16px',
                  border: '1px solid hsl(220, 13%, 91%)'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📚</div>
                  <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px', color: 'hsl(222, 47%, 11%)' }}>
                    Content Loading
                  </h3>
                  <p>No content available for this lesson yet.</p>
                </div>
              ) : (
                <div style={{ 
                  textAlign: 'center', 
                  padding: '60px 20px', 
                  color: 'hsl(215, 16%, 47%)',
                  backgroundColor: 'hsl(220, 20%, 98%)',
                  borderRadius: '16px',
                  border: '1px solid hsl(220, 13%, 91%)'
                }}>
                  <div style={{ fontSize: '64px', marginBottom: '20px' }}>🎓</div>
                  <h3 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px', color: 'hsl(222, 47%, 11%)' }}>
                    Welcome to {selectedCourse.title}
                  </h3>
                  <p style={{ fontSize: '16px', lineHeight: '1.6' }}>
                    Select a lesson from the sidebar to begin your learning journey.
                  </p>
                </div>
              )}
            </div>

            {/* Enhanced Pagination */}
            {selectedLesson && selectedLesson.content && selectedLesson.content.length > 1 && (
              <div style={styles.paginationContainer}>
                <button
                  onClick={prevPage}
                  disabled={currentPage === 0}
                  style={{
                    ...styles.paginationButton,
                    ...(currentPage === 0 ? styles.paginationButtonDisabled : {}),
                    ...(currentPage > 0 ? styles.paginationButtonActive : {})
                  }}
                  onMouseOver={(e) => {
                    if (currentPage > 0) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.3)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (currentPage > 0) {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 16px rgba(99, 102, 241, 0.2)';
                    }
                  }}
                >
                  ⬅️ Previous
                </button>
                
                <div style={styles.paginationInfo}>
                  📄 Page {currentPage + 1} of {selectedLesson.content.length}
                </div>
                
                <button
                  onClick={nextPage}
                  disabled={currentPage >= selectedLesson.content.length - 1}
                  style={{
                    ...styles.paginationButton,
                    ...(currentPage >= selectedLesson.content.length - 1 ? styles.paginationButtonDisabled : {}),
                    ...(currentPage < selectedLesson.content.length - 1 ? styles.paginationButtonActive : {})
                  }}
                  onMouseOver={(e) => {
                    if (currentPage < selectedLesson.content.length - 1) {
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 6px 20px rgba(99, 102, 241, 0.3)';
                    }
                  }}
                  onMouseOut={(e) => {
                    if (currentPage < selectedLesson.content.length - 1) {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 16px rgba(99, 102, 241, 0.2)';
                    }
                  }}
                >
                  Next ➡️
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default courses list view
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Generated Courses</h1>
          <p style={styles.subtitle}>
            AI-generated courses tailored to your learning path and career goals.
          </p>
        </div>
        <div style={styles.generateSection}>
          <input
            type="text"
            placeholder="Enter course topic or skill..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && generateCourse()}
            style={styles.inputBox}
            onFocus={(e) => e.target.style.borderColor = 'hsl(238, 64%, 59%)'}
            onBlur={(e) => e.target.style.borderColor = 'hsl(220, 13%, 91%)'}
          />
          <button
            style={{
              ...styles.generateButton,
              opacity: isLoading ? 0.7 : 1,
              cursor: isLoading ? 'not-allowed' : 'pointer'
            }}
            onMouseOver={(e) => !isLoading && (e.target.style.backgroundColor = 'hsl(238, 70%, 65%)')}
            onMouseOut={(e) => !isLoading && (e.target.style.backgroundColor = 'hsl(238, 64%, 59%)')}
            onClick={generateCourse}
            disabled={isLoading}
          >
            {isLoading ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </div>

      <div style={styles.coursesGrid}>
        {isLoading ? (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '60px 20px',
            color: 'hsl(215, 16%, 47%)'
          }}>
            <p style={{ fontSize: '16px', marginBottom: '8px' }}>Generating your course...</p>
            <p style={{ fontSize: '14px' }}>This may take a moment as we create all lesson content</p>
          </div>
        ) : isLoadingCourses ? (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '60px 20px',
            color: 'hsl(215, 16%, 47%)'
          }}>
            <p style={{ fontSize: '16px', marginBottom: '8px' }}>Loading your courses...</p>
            <p style={{ fontSize: '14px' }}>Please wait while we fetch your saved courses</p>
          </div>
        ) : courses.length === 0 ? (
          <div style={{
            gridColumn: '1 / -1',
            textAlign: 'center',
            padding: '60px 20px',
            color: 'hsl(215, 16%, 47%)'
          }}>
            <p style={{ fontSize: '16px', marginBottom: '8px' }}>No courses generated yet</p>
            <p style={{ fontSize: '14px' }}>Enter a topic or skill above and click Generate to create AI-powered courses</p>
          </div>
        ) : (
          courses.map((course) => (
            <div
              key={course.id}
              style={styles.courseCard}
              onClick={() => handleCourseClick(course)}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px hsl(0 0% 0% / 0.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px 0 hsl(0 0% 0% / 0.1)';
              }}
            >
              <img
                src={course.thumbnail}
                alt={course.title}
                style={styles.courseImage}
                onError={(e) => {
                  e.target.style.backgroundColor = 'hsl(220, 13%, 91%)';
                  e.target.style.display = 'flex';
                  e.target.style.alignItems = 'center';
                  e.target.style.justifyContent = 'center';
                  e.target.innerHTML = '<div style="color: hsl(215, 16%, 47%); font-size: 14px;">Course Image</div>';
                }}
              />
              
              <div style={styles.courseContent}>
                <div>
                  <h3 style={styles.courseTitle}>{course.title}</h3>
                </div>

                <div style={styles.progressSection}>
                  <div style={styles.progressHeader}>
                    <span style={styles.progressLabel}>Progress</span>
                    <span style={{ ...styles.progressPercentage, color: getProgressColor(course.progress) }}>
                      {course.progress}%
                    </span>
                  </div>
                  <div style={styles.progressBar}>
                    <div
                      style={{
                        ...styles.progressFill,
                        width: `${course.progress}%`,
                        backgroundColor: getProgressColor(course.progress)
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Courses;