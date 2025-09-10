import React, { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import StatCard from "@/components/molecules/StatCard";
import AssignmentCard from "@/components/molecules/AssignmentCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import AssignmentModal from "@/components/organisms/AssignmentModal";
import { assignmentService } from "@/services/api/assignmentService";
import { courseService } from "@/services/api/courseService";
import { isToday, isTomorrow, isPast, isThisWeek } from "date-fns";
import { toast } from "react-toastify";

const Dashboard = ({ onMenuClick }) => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);

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
      setError("Failed to load dashboard data");
      console.error("Error loading dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (assignmentId, completed) => {
    try {
      const assignment = assignments.find(a => a.Id === assignmentId);
      if (!assignment) return;

      const updatedAssignment = { ...assignment, completed };
      await assignmentService.update(assignmentId, updatedAssignment);
      
      setAssignments(prev => prev.map(a => 
        a.Id === assignmentId ? { ...a, completed } : a
      ));
      
      toast.success(completed ? "Assignment marked as complete!" : "Assignment marked as pending");
    } catch (err) {
      toast.error("Failed to update assignment");
      console.error("Error updating assignment:", err);
    }
  };

  const handleSaveAssignment = async (assignmentData) => {
    try {
      const newAssignment = await assignmentService.create(assignmentData);
      setAssignments(prev => [...prev, newAssignment]);
      setShowAssignmentModal(false);
      toast.success("Assignment created successfully!");
    } catch (err) {
      toast.error("Failed to create assignment");
      console.error("Error creating assignment:", err);
    }
  };

  const getCourseById = (courseId) => {
    return courses.find(c => c.Id === courseId);
  };

  // Calculate statistics
  const stats = {
    totalAssignments: assignments.length,
    completedAssignments: assignments.filter(a => a.completed).length,
    overdueAssignments: assignments.filter(a => isPast(a.dueDate) && !a.completed).length,
    upcomingAssignments: assignments.filter(a => !isPast(a.dueDate) && !a.completed).length
  };

  // Get upcoming assignments (next 7 days)
  const upcomingAssignments = assignments
    .filter(a => !a.completed && (isToday(a.dueDate) || isTomorrow(a.dueDate) || isThisWeek(a.dueDate)))
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  // Get overdue assignments
  const overdueAssignments = assignments
    .filter(a => isPast(a.dueDate) && !a.completed)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 3);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="flex-1 overflow-hidden">
      <Header title="Dashboard" onMenuClick={onMenuClick} />
      
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon="FileText"
              title="Total Assignments"
              value={stats.totalAssignments}
              color="primary"
            />
            <StatCard
              icon="CheckCircle"
              title="Completed"
              value={stats.completedAssignments}
              color="success"
            />
            <StatCard
              icon="AlertTriangle"
              title="Overdue"
              value={stats.overdueAssignments}
              color="danger"
            />
            <StatCard
              icon="Clock"
              title="Upcoming"
              value={stats.upcomingAssignments}
              color="warning"
            />
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              onClick={() => setShowAssignmentModal(true)}
              className="gradient-bg text-white"
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Assignment
            </Button>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Upcoming Assignments */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Upcoming Assignments</h2>
                  <ApperIcon name="Calendar" size={20} className="text-gray-400" />
                </div>
                
                {upcomingAssignments.length === 0 ? (
                  <Empty
                    icon="Calendar"
                    title="No upcoming assignments"
                    description="You're all caught up! Great job staying organized."
                    actionLabel="Add Assignment"
                    onAction={() => setShowAssignmentModal(true)}
                  />
                ) : (
                  <div className="space-y-4">
                    {upcomingAssignments.map(assignment => (
                      <AssignmentCard
                        key={assignment.Id}
                        assignment={assignment}
                        course={getCourseById(assignment.courseId)}
                        onToggleComplete={handleToggleComplete}
                      />
                    ))}
                  </div>
                )}
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Overdue Assignments */}
              {overdueAssignments.length > 0 && (
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-red-600">Overdue</h3>
                    <ApperIcon name="AlertTriangle" size={16} className="text-red-500" />
                  </div>
                  
                  <div className="space-y-3">
                    {overdueAssignments.map(assignment => {
                      const course = getCourseById(assignment.courseId);
                      return (
                        <div key={assignment.Id} className="p-3 bg-red-50 rounded-lg border border-red-200">
                          <h4 className="font-medium text-red-900 text-sm">{assignment.title}</h4>
                          <p className="text-red-700 text-xs">{course?.code}</p>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              )}

              {/* Course Summary */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Courses</h3>
                  <ApperIcon name="BookOpen" size={16} className="text-gray-400" />
                </div>
                
                {courses.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No courses added yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    {courses.slice(0, 4).map(course => {
                      const courseAssignments = assignments.filter(a => a.courseId === course.Id);
                      const completed = courseAssignments.filter(a => a.completed).length;
                      
                      return (
                        <div key={course.Id} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div 
                              className="w-3 h-3 rounded-full mr-3"
                              style={{ backgroundColor: course.color }}
                            />
                            <div>
                              <p className="text-sm font-medium text-gray-900">{course.code}</p>
                              <p className="text-xs text-gray-500">{completed}/{courseAssignments.length} complete</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>

              {/* Progress Summary */}
              <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Progress</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Completion Rate</span>
                      <span className="font-medium">
                        {stats.totalAssignments === 0 ? "0%" : Math.round((stats.completedAssignments / stats.totalAssignments) * 100) + "%"}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: stats.totalAssignments === 0 ? "0%" : `${(stats.completedAssignments / stats.totalAssignments) * 100}%` 
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <AssignmentModal
        isOpen={showAssignmentModal}
        onClose={() => setShowAssignmentModal(false)}
        onSave={handleSaveAssignment}
        courses={courses}
      />
    </div>
  );
};

export default Dashboard;