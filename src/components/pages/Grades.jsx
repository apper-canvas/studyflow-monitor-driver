import React, { useEffect, useState } from "react";
import { assignmentService } from "@/services/api/assignmentService";
import { courseService } from "@/services/api/courseService";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import Badge from "@/components/atoms/Badge";
import Card from "@/components/atoms/Card";
import Header from "@/components/organisms/Header";

const Grades = ({ onMenuClick }) => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [assignmentsData, coursesData] = await Promise.all([
        assignmentService.getAll(),
        courseService.getAll()
      ]);
      setAssignments(assignmentsData);
      setCourses(coursesData);
    } catch (err) {
      setError("Failed to load grades");
      console.error("Error loading grades:", err);
    } finally {
      setLoading(false);
    }
  };

const getCourseById = (courseId) => {
    return courses.find(c => c.Id === courseId);
  };

const calculateCourseGrade = (courseId) => {
    const courseAssignments = assignments.filter(a => 
      (a.course_id_c?.Id === courseId || a.course_id_c === courseId) && 
      a.grade_c !== null && a.grade_c !== undefined
    );
    
    if (courseAssignments.length === 0) return null;
    
    const totalPoints = courseAssignments.reduce((sum, a) => sum + (a.grade_c || 0), 0);
    const totalMaxPoints = courseAssignments.reduce((sum, a) => sum + (a.max_points_c || 0), 0);
    
    if (totalMaxPoints === 0) return null;
    
    return (totalPoints / totalMaxPoints) * 100;
  };

const calculateOverallGPA = () => {
    const courseGrades = courses.map(course => ({
      grade: calculateCourseGrade(course.Id),
      credits: course.credits_c || 3
    })).filter(c => c.grade !== null);
    
    if (courseGrades.length === 0) return null;
    
    const totalGradePoints = courseGrades.reduce((sum, c) => sum + (convertToGPA(c.grade) * c.credits), 0);
    const totalCredits = courseGrades.reduce((sum, c) => sum + c.credits, 0);
    
    if (totalCredits === 0) return null;
    
    return totalGradePoints / totalCredits;
  };

  const convertToGPA = (percentage) => {
    if (percentage >= 97) return 4.0;
    if (percentage >= 93) return 3.7;
    if (percentage >= 90) return 3.3;
    if (percentage >= 87) return 3.0;
    if (percentage >= 83) return 2.7;
    if (percentage >= 80) return 2.3;
    if (percentage >= 77) return 2.0;
    if (percentage >= 73) return 1.7;
    if (percentage >= 70) return 1.3;
    if (percentage >= 67) return 1.0;
    if (percentage >= 65) return 0.7;
    return 0.0;
  };

  const getGradeColor = (grade) => {
    if (grade >= 90) return "success";
    if (grade >= 80) return "info";
    if (grade >= 70) return "warning";
    return "error";
  };

  const getLetterGrade = (percentage) => {
    if (percentage >= 97) return "A+";
    if (percentage >= 93) return "A";
    if (percentage >= 90) return "A-";
    if (percentage >= 87) return "B+";
    if (percentage >= 83) return "B";
    if (percentage >= 80) return "B-";
    if (percentage >= 77) return "C+";
    if (percentage >= 73) return "C";
    if (percentage >= 70) return "C-";
    if (percentage >= 67) return "D+";
    if (percentage >= 65) return "D";
    return "F";
};

  const gradedAssignments = assignments.filter(a => a.grade_c !== null && a.grade_c !== undefined);
  const overallGPA = calculateOverallGPA();

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  if (gradedAssignments.length === 0) {
    return (
      <div className="flex-1 overflow-hidden">
        <Header title="Grades" onMenuClick={onMenuClick} />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-5xl mx-auto">
            <Empty
              icon="TrendingUp"
              title="No grades yet"
              description="Complete assignments and add grades to see your academic progress here."
            />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden">
      <Header title="Grades" onMenuClick={onMenuClick} />
      
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Overall GPA */}
          {overallGPA && (
            <Card className="p-6 gradient-bg text-white">
              <div className="text-center">
                <h2 className="text-lg font-semibold mb-2">Overall GPA</h2>
                <div className="text-4xl font-bold mb-2">
                  {overallGPA.toFixed(2)}
                </div>
                <p className="text-white/80">
                  Based on {courses.filter(c => calculateCourseGrade(c.Id) !== null).length} courses
                </p>
              </div>
            </Card>
          )}

          {/* Course Grades */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Grades</h3>
              
              <div className="space-y-4">
{courses.map(course => {
                  const courseGrade = calculateCourseGrade(course.Id);
                  const courseAssignments = assignments.filter(a => 
                    a.course_id_c?.Id === course.Id || a.course_id_c === course.Id
                  );
                  const gradedCount = courseAssignments.filter(a => a.grade_c !== null && a.grade_c !== undefined).length;
                  
                  return (
                    <div key={course.Id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div 
                          className="w-4 h-4 rounded-full mr-3"
                          style={{ backgroundColor: course.color_c || '#6366F1' }}
                        />
                        <div>
                          <h4 className="font-medium text-gray-900">{course.code_c || 'N/A'}</h4>
                          <p className="text-sm text-gray-600">{course.name_c || 'Unknown Course'}</p>
                          <p className="text-xs text-gray-500">{gradedCount} of {courseAssignments.length} graded</p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {courseGrade !== null ? (
                          <>
                            <Badge variant={getGradeColor(courseGrade)}>
                              {getLetterGrade(courseGrade)}
                            </Badge>
                            <p className="text-sm text-gray-600 mt-1">{courseGrade.toFixed(1)}%</p>
                            <p className="text-xs text-gray-500">{convertToGPA(courseGrade).toFixed(1)} GPA</p>
                          </>
                        ) : (
                          <Badge variant="default">No Grade</Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Recent Grades */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Grades</h3>
              
              <div className="space-y-4">
{gradedAssignments
                  .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                  .slice(0, 8)
                  .map(assignment => {
                    const course = getCourseById(assignment.course_id_c?.Id || assignment.course_id_c);
                    const percentage = (assignment.grade_c / assignment.max_points_c) * 100;
                    
                    return (
                      <div key={assignment.Id} className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 truncate">{assignment.title_c}</h4>
                          <p className="text-sm text-gray-600">{course?.code_c}</p>
                        </div>
                        
<div className="flex items-center space-x-3">
                          <div className="text-right">
                            <p className="font-medium text-gray-900">
                              {assignment.grade_c}/{assignment.max_points_c}
                            </p>
                            <Badge variant={getGradeColor(percentage)} className="text-xs">
                              {percentage.toFixed(0)}%
                            </Badge>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </Card>
          </div>

          {/* Grade Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Grade Distribution</h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["A", "B", "C", "D/F"].map((grade, index) => {
let count = 0;
                gradedAssignments.forEach(assignment => {
                  const percentage = (assignment.grade_c / assignment.max_points_c) * 100;
                  const letterGrade = getLetterGrade(percentage);
                  
                  if (grade === "A" && letterGrade.startsWith("A")) count++;
                  else if (grade === "B" && letterGrade.startsWith("B")) count++;
                  else if (grade === "C" && letterGrade.startsWith("C")) count++;
                  else if (grade === "D/F" && (letterGrade.startsWith("D") || letterGrade === "F")) count++;
                });
                
                const percentage = gradedAssignments.length > 0 ? (count / gradedAssignments.length) * 100 : 0;
                
                return (
                  <div key={grade} className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">{count}</div>
                    <div className="text-sm font-medium text-gray-600 mb-2">{grade} Grade{count !== 1 ? "s" : ""}</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{percentage.toFixed(0)}%</div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Grades;