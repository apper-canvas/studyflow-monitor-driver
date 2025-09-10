class AssignmentService {
  constructor() {
    this.tableName = 'assignment_c';
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    if (window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getAll() {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "course_id_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "max_points_c"}},
          {"field": {"Name": "created_at_c"}}
        ],
        orderBy: [{"fieldName": "due_date_c", "sorttype": "ASC"}]
      };
      
      const response = await this.apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return (response.data || []).map(assignment => ({
        ...assignment,
        dueDate: assignment.due_date_c ? new Date(assignment.due_date_c) : null,
        createdAt: assignment.created_at_c ? new Date(assignment.created_at_c) : new Date()
      }));
    } catch (error) {
      console.error("Error fetching assignments:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "course_id_c"}, "referenceField": {"field": {"Name": "name_c"}}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "grade_c"}},
          {"field": {"Name": "max_points_c"}},
          {"field": {"Name": "created_at_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        return null;
      }
      
      const assignment = response.data;
      return {
        ...assignment,
        dueDate: assignment.due_date_c ? new Date(assignment.due_date_c) : null,
        createdAt: assignment.created_at_c ? new Date(assignment.created_at_c) : new Date()
      };
    } catch (error) {
      console.error(`Error fetching assignment ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(assignmentData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Format data for database - only updateable fields
      const params = {
        records: [{
          title_c: assignmentData.title || assignmentData.title_c,
          course_id_c: parseInt(assignmentData.courseId || assignmentData.course_id_c?.Id || assignmentData.course_id_c),
          description_c: assignmentData.description || assignmentData.description_c || "",
          due_date_c: assignmentData.dueDate ? 
            (assignmentData.dueDate instanceof Date ? assignmentData.dueDate.toISOString() : new Date(assignmentData.dueDate).toISOString()) :
            (assignmentData.due_date_c instanceof Date ? assignmentData.due_date_c.toISOString() : new Date(assignmentData.due_date_c).toISOString()),
          priority_c: assignmentData.priority || assignmentData.priority_c || "medium",
          completed_c: assignmentData.completed !== undefined ? assignmentData.completed : (assignmentData.completed_c !== undefined ? assignmentData.completed_c : false),
          grade_c: assignmentData.grade !== undefined ? parseFloat(assignmentData.grade) : (assignmentData.grade_c !== undefined ? parseFloat(assignmentData.grade_c) : null),
          max_points_c: parseInt(assignmentData.maxPoints || assignmentData.max_points_c || 100),
          created_at_c: new Date().toISOString()
        }]
      };
      
      const response = await this.apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to create assignment:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const assignment = successful[0].data;
          return {
            ...assignment,
            dueDate: assignment.due_date_c ? new Date(assignment.due_date_c) : null,
            createdAt: assignment.created_at_c ? new Date(assignment.created_at_c) : new Date()
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error creating assignment:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async update(id, assignmentData) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      // Format data for database - only updateable fields
      const updateData = {
        Id: parseInt(id),
        title_c: assignmentData.title || assignmentData.title_c,
        description_c: assignmentData.description || assignmentData.description_c || "",
        priority_c: assignmentData.priority || assignmentData.priority_c || "medium",
        completed_c: assignmentData.completed !== undefined ? assignmentData.completed : (assignmentData.completed_c !== undefined ? assignmentData.completed_c : false)
      };

      // Add optional fields if they exist
      if (assignmentData.courseId || assignmentData.course_id_c) {
        updateData.course_id_c = parseInt(assignmentData.courseId || assignmentData.course_id_c?.Id || assignmentData.course_id_c);
      }
      
      if (assignmentData.dueDate || assignmentData.due_date_c) {
        updateData.due_date_c = assignmentData.dueDate ? 
          (assignmentData.dueDate instanceof Date ? assignmentData.dueDate.toISOString() : new Date(assignmentData.dueDate).toISOString()) :
          (assignmentData.due_date_c instanceof Date ? assignmentData.due_date_c.toISOString() : new Date(assignmentData.due_date_c).toISOString());
      }
      
      if (assignmentData.grade !== undefined || assignmentData.grade_c !== undefined) {
        updateData.grade_c = assignmentData.grade !== undefined ? parseFloat(assignmentData.grade) : parseFloat(assignmentData.grade_c);
      }
      
      if (assignmentData.maxPoints !== undefined || assignmentData.max_points_c !== undefined) {
        updateData.max_points_c = parseInt(assignmentData.maxPoints || assignmentData.max_points_c);
      }

      const params = {
        records: [updateData]
      };
      
      const response = await this.apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to update assignment:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        if (successful.length > 0) {
          const assignment = successful[0].data;
          return {
            ...assignment,
            dueDate: assignment.due_date_c ? new Date(assignment.due_date_c) : null,
            createdAt: assignment.created_at_c ? new Date(assignment.created_at_c) : new Date()
          };
        }
      }
      
      return null;
    } catch (error) {
      console.error("Error updating assignment:", error?.response?.data?.message || error);
      throw error;
    }
  }

  async delete(id) {
    try {
      if (!this.apperClient) this.initializeClient();
      
      const params = { 
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);
        
        if (failed.length > 0) {
          console.error(`Failed to delete assignment:`, failed);
          failed.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successful.length === 1;
      }
      
      return false;
    } catch (error) {
      console.error("Error deleting assignment:", error?.response?.data?.message || error);
      throw error;
    }
}
}

export const assignmentService = new AssignmentService();