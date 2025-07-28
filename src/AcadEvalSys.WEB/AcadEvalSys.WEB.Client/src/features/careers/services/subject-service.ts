import { api } from "@/shared/config/axios";
import { SubjectAssignment } from "@/shared/types";
import { Subject } from "@/shared/types";

const SUBJECTS_API_URL = "/technical-careers";

export const subjectService = {
  async getSubjectsByCareer(
    careerId: string,
    year?: string,
    includeEnrolledStudents = false
  ): Promise<Subject[]> {
    try {
      const params = new URLSearchParams();
      if (year) params.append("year", year);
      if (includeEnrolledStudents) {
        params.append("includeEnrolledStudents", "true");
      }

      const url = `${SUBJECTS_API_URL}/${careerId}/subjects?${params}`;
      const { data } = await api.get<Subject[]>(url);
      return data;
    } catch (error) {
      console.error(`❌ Error fetching subjects:`, error);
      throw error;
    }
  },

  async getSubjectById(
    careerId: string,
    subjectId: string,
    includeEnrolledStudents = false
  ): Promise<Subject> {
    try {
      const params = new URLSearchParams();
      if (includeEnrolledStudents) {
        params.append("includeEnrolledStudents", "true");
      }

      const url = `${SUBJECTS_API_URL}/${careerId}/subjects/${subjectId}?${params}`;
      const { data } = await api.get<Subject>(url);
      return data;
    } catch (error) {
      console.error(`❌ Error fetching subject ${subjectId}:`, error);
      throw error;
    }
  },

  async assignProfessor(
    careerId: string,
    subjectId: string,
    professorId: string
  ): Promise<boolean> {
    try {
      const { data } = await api.put(
        `${SUBJECTS_API_URL}/${careerId}/subjects/${subjectId}/assign-professor`,
        { professorId }
      );
      console.log(`✅ Professor assigned successfully`);
      return data;
    } catch (error) {
      console.error(`❌ Error assigning professor:`, error);
      throw error;
    }
  },

  async enrollStudent(
    careerId: string,
    subjectId: string,
    studentId: string
  ): Promise<boolean> {
    console.log(`👨‍🎓 Enrolling student ${studentId} to subject ${subjectId}`);

    try {
      const { data } = await api.post(
        `${SUBJECTS_API_URL}/${careerId}/subjects/${subjectId}/enroll-student`,
        { studentId }
      );
      console.log(`✅ Student enrolled successfully`);
      return data;
    } catch (error) {
      console.error(`❌ Error enrolling student:`, error);
      throw error;
    }
  },

  async unenrollStudent(
    careerId: string,
    subjectId: string,
    studentId: string
  ): Promise<boolean> {
    console.log(
      `🚫 Unenrolling student ${studentId} from subject ${subjectId}`
    );

    try {
      const { data } = await api.delete(
        `${SUBJECTS_API_URL}/${careerId}/subjects/${subjectId}/enroll-student/${studentId}`
      );
      console.log(`✅ Student unenrolled successfully`);
      return data;
    } catch (error) {
      console.error(`❌ Error unenrolling student:`, error);
      throw error;
    }
  },

  async bulkAssign(
    careerId: string,
    assignments: SubjectAssignment[]
  ): Promise<void> {
    console.log(
      `📦 Bulk assigning ${assignments.length} assignments to career ${careerId}`
    );

    try {
      await api.post(
        `${SUBJECTS_API_URL}/${careerId}/subjects/bulk-assign`,
        assignments
      );
      console.log(`✅ Bulk assignments completed successfully`);
    } catch (error) {
      console.error(`❌ Error in bulk assignments:`, error);
      throw error;
    }
  },
};
