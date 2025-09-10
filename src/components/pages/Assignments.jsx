import React, { useEffect, useState } from "react";
import { assignmentService } from "@/services/api/assignmentService";
import { courseService } from "@/services/api/courseService";
import { isPast } from "date-fns";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";
import SearchBar from "@/components/molecules/SearchBar";
import AssignmentCard from "@/components/molecules/AssignmentCard";
import FilterBar from "@/components/molecules/FilterBar";
import Button from "@/components/atoms/Button";
import Header from "@/components/organisms/Header";
import AssignmentModal from "@/components/organisms/AssignmentModal";

const Assignments = ({ onMenuClick }) => {
  const [assignments, setAssignments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

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
      setError("Failed to load assignments");
      console.error("Error loading assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleComplete = async (assignmentId, completed) => {
    try {
const assignment = assignments.find(a => a.Id === assignmentId);
      if (!assignment) return;

const updatedAssignment = { ...assignment, completed_c: completed };
      await assignmentService.update(assignmentId, updatedAssignment);
      
      setAssignments(prev => prev.map(a => 
a.Id === assignmentId ? { ...a, completed_c: completed } : a
      ));
      
      toast.success(completed ? "Assignment marked as complete!" : "Assignment marked as pending");
    } catch (err) {
      toast.error("Failed to update assignment");
      console.error("Error updating assignment:", err);
    }
  };

  const handleSaveAssignment = async (assignmentData) => {
    try {
      if (editingAssignment) {
        const updatedAssignment = await assignmentService.update(editingAssignment.Id, assignmentData);
        setAssignments(prev => prev.map(a => 
          a.Id === editingAssignment.Id ? updatedAssignment : a
        ));
        toast.success("Assignment updated successfully!");
      } else {
        const newAssignment = await assignmentService.create(assignmentData);
        setAssignments(prev => [...prev, newAssignment]);
        toast.success("Assignment created successfully!");
      }
      
      setShowAssignmentModal(false);
      setEditingAssignment(null);
    } catch (err) {
      toast.error(`Failed to ${editingAssignment ? "update" : "create"} assignment`);
      console.error("Error saving assignment:", err);
    }
  };

  const handleEditAssignment = (assignment) => {
    setEditingAssignment(assignment);
    setShowAssignmentModal(true);
  };

  const handleDeleteAssignment = async (assignmentId) => {
    if (!window.confirm("Are you sure you want to delete this assignment?")) return;
    
    try {
      await assignmentService.delete(assignmentId);
      setAssignments(prev => prev.filter(a => a.Id !== assignmentId));
      toast.success("Assignment deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete assignment");
      console.error("Error deleting assignment:", err);
    }
  };

  const getCourseById = (courseId) => {
    return courses.find(c => c.Id === courseId);
  };

  const getFilteredAssignments = () => {
    let filtered = assignments;

    // Search filter
    if (searchTerm) {
filtered = filtered.filter(assignment =>
        assignment.title_c.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

// Course filter
    if (selectedCourse) {
      filtered = filtered.filter(assignment => 
        assignment.course_id_c?.Id == selectedCourse || assignment.course_id_c == selectedCourse
      );
    }

    // Priority filter
    if (selectedPriority) {
      filtered = filtered.filter(assignment => assignment.priority_c === selectedPriority);
    }

    // Status filter
    if (selectedStatus) {
      switch (selectedStatus) {
        case "pending":
          filtered = filtered.filter(assignment => !assignment.completed_c && !isPast(assignment.dueDate));
          break;
        case "completed":
          filtered = filtered.filter(assignment => assignment.completed_c);
          break;
        case "overdue":
          filtered = filtered.filter(assignment => isPast(assignment.dueDate) && !assignment.completed_c);
          break;
      }
    }

    return filtered.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCourse("");
    setSelectedPriority("");
    setSelectedStatus("");
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (selectedCourse) count++;
    if (selectedPriority) count++;
    if (selectedStatus) count++;
    return count;
  };

  const filteredAssignments = getFilteredAssignments();

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="flex-1 overflow-hidden">
      <Header title="Assignments" onMenuClick={onMenuClick} />
      
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">All Assignments</h2>
              <p className="text-gray-600">
                {filteredAssignments.length} of {assignments.length} assignments
              </p>
            </div>
            
            <Button 
              onClick={() => {
                setEditingAssignment(null);
                setShowAssignmentModal(true);
              }}
              className="gradient-bg text-white"
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Assignment
            </Button>
          </div>

          {/* Search and Filters */}
          <div className="space-y-4">
            <SearchBar
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search assignments..."
            />
            
            <FilterBar
              selectedCourse={selectedCourse}
              onCourseChange={setSelectedCourse}
              selectedPriority={selectedPriority}
              onPriorityChange={setSelectedPriority}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              courses={courses}
              onClearFilters={handleClearFilters}
              activeFiltersCount={getActiveFiltersCount()}
            />
          </div>

          {/* Assignments List */}
          {filteredAssignments.length === 0 ? (
            <Empty
              icon="FileText"
              title={assignments.length === 0 ? "No assignments yet" : "No assignments found"}
              description={
                assignments.length === 0 
                  ? "Start organizing your academic life by adding your first assignment."
                  : "Try adjusting your search or filter criteria."
              }
              actionLabel="Add Assignment"
              onAction={() => {
                setEditingAssignment(null);
                setShowAssignmentModal(true);
              }}
            />
          ) : (
            <div className="space-y-4">
              {filteredAssignments.map(assignment => (
                <AssignmentCard
                  key={assignment.Id}
assignment={assignment}
                  course={getCourseById(assignment.course_id_c?.Id || assignment.course_id_c)}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleEditAssignment}
                  onDelete={handleDeleteAssignment}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <AssignmentModal
        isOpen={showAssignmentModal}
        onClose={() => {
          setShowAssignmentModal(false);
          setEditingAssignment(null);
        }}
        onSave={handleSaveAssignment}
        assignment={editingAssignment}
        courses={courses}
      />
    </div>
  );
};

export default Assignments;