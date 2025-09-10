import React, { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import CourseCard from "@/components/molecules/CourseCard";
import SearchBar from "@/components/molecules/SearchBar";
import Button from "@/components/atoms/Button";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import CourseModal from "@/components/organisms/CourseModal";
import { courseService } from "@/services/api/courseService";
import { assignmentService } from "@/services/api/assignmentService";
import { toast } from "react-toastify";

const Courses = ({ onMenuClick }) => {
  const [courses, setCourses] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [coursesData, assignmentsData] = await Promise.all([
        courseService.getAll(),
        assignmentService.getAll()
      ]);
      setCourses(coursesData);
      setAssignments(assignmentsData);
    } catch (err) {
      setError("Failed to load courses");
      console.error("Error loading courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCourse = async (courseData) => {
    try {
      if (editingCourse) {
        const updatedCourse = await courseService.update(editingCourse.Id, courseData);
        setCourses(prev => prev.map(c => 
          c.Id === editingCourse.Id ? updatedCourse : c
        ));
        toast.success("Course updated successfully!");
      } else {
        const newCourse = await courseService.create(courseData);
        setCourses(prev => [...prev, newCourse]);
        toast.success("Course created successfully!");
      }
      
      setShowCourseModal(false);
      setEditingCourse(null);
    } catch (err) {
      toast.error(`Failed to ${editingCourse ? "update" : "create"} course`);
      console.error("Error saving course:", err);
    }
  };

  const handleEditCourse = (course) => {
    setEditingCourse(course);
    setShowCourseModal(true);
  };

  const handleDeleteCourse = async (courseId) => {
    const courseAssignments = assignments.filter(a => a.courseId === courseId);
    
    if (courseAssignments.length > 0) {
      toast.error("Cannot delete course with existing assignments");
      return;
    }
    
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    
    try {
      await courseService.delete(courseId);
      setCourses(prev => prev.filter(c => c.Id !== courseId));
      toast.success("Course deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete course");
      console.error("Error deleting course:", err);
    }
  };

  const getCourseStats = (courseId) => {
const courseAssignments = assignments.filter(a => 
      a.course_id_c?.Id === courseId || a.course_id_c === courseId);
const gradedAssignments = courseAssignments.filter(a => a.grade_c !== null && a.grade_c !== undefined);
    
    const assignmentCount = courseAssignments.length;
    const averageGrade = gradedAssignments.length > 0 
      ? gradedAssignments.reduce((sum, a) => sum + (a.grade / a.maxPoints) * 100, 0) / gradedAssignments.length
      : null;
    
    return { assignmentCount, averageGrade };
  };

  const getFilteredCourses = () => {
    if (!searchTerm) return courses;
    
    return courses.filter(course =>
course.name_c.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code_c.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor_c.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredCourses = getFilteredCourses();

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="flex-1 overflow-hidden">
      <Header title="Courses" onMenuClick={onMenuClick} />
      
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">My Courses</h2>
              <p className="text-gray-600">
                {filteredCourses.length} of {courses.length} courses
              </p>
            </div>
            
            <Button 
              onClick={() => {
                setEditingCourse(null);
                setShowCourseModal(true);
              }}
              className="gradient-bg text-white"
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Course
            </Button>
          </div>

          {/* Search */}
          <SearchBar
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search courses..."
          />

          {/* Courses Grid */}
          {filteredCourses.length === 0 ? (
            <Empty
              icon="BookOpen"
              title={courses.length === 0 ? "No courses yet" : "No courses found"}
              description={
                courses.length === 0 
                  ? "Start by adding your first course to begin organizing your academic schedule."
                  : "Try adjusting your search criteria."
              }
              actionLabel="Add Course"
              onAction={() => {
                setEditingCourse(null);
                setShowCourseModal(true);
              }}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map(course => {
                const { assignmentCount, averageGrade } = getCourseStats(course.Id);
                
                return (
                  <CourseCard
                    key={course.Id}
                    course={course}
                    assignmentCount={assignmentCount}
                    averageGrade={averageGrade}
                    onEdit={handleEditCourse}
                    onDelete={handleDeleteCourse}
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>

      <CourseModal
        isOpen={showCourseModal}
        onClose={() => {
          setShowCourseModal(false);
          setEditingCourse(null);
        }}
        onSave={handleSaveCourse}
        course={editingCourse}
      />
    </div>
  );
};

export default Courses;