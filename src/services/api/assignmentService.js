import assignmentsData from "@/services/mockData/assignments.json";

class AssignmentService {
  constructor() {
    this.assignments = [...assignmentsData].map(assignment => ({
      ...assignment,
      dueDate: new Date(assignment.dueDate),
      createdAt: new Date(assignment.createdAt)
    }));
  }

  async delay() {
    await new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.assignments];
  }

  async getById(id) {
    await this.delay();
    const assignment = this.assignments.find(a => a.Id === parseInt(id));
    if (!assignment) throw new Error("Assignment not found");
    return { ...assignment };
  }

  async create(assignmentData) {
    await this.delay();
    const newAssignment = {
      ...assignmentData,
      Id: Math.max(...this.assignments.map(a => a.Id), 0) + 1,
      createdAt: new Date()
    };
    this.assignments.push(newAssignment);
    return { ...newAssignment };
  }

  async update(id, assignmentData) {
    await this.delay();
    const index = this.assignments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) throw new Error("Assignment not found");
    
    this.assignments[index] = {
      ...this.assignments[index],
      ...assignmentData,
      Id: parseInt(id)
    };
    
    return { ...this.assignments[index] };
  }

  async delete(id) {
    await this.delay();
    const index = this.assignments.findIndex(a => a.Id === parseInt(id));
    if (index === -1) throw new Error("Assignment not found");
    
    const deletedAssignment = this.assignments.splice(index, 1)[0];
    return { ...deletedAssignment };
  }
}

export const assignmentService = new AssignmentService();