import { create } from 'zustand';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  studentId: string;
  careerYear: number;
  technicalCareerId: string;
  isActive: boolean;
}

interface Professor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  employeeId: string;
  specialization: string;
  isActive: boolean;
}

interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
  careerYear: number;
  technicalCareerId: string;
  isActive: boolean;
}

interface TechnicalCareer {
  id: string;
  name: string;
  code: string;
  description: string;
  duration: number;
  isActive: boolean;
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  isActive: boolean;
}

interface AdministrationState {
  // Estados de entidades
  students: Student[];
  professors: Professor[];
  subjects: Subject[];
  technicalCareers: TechnicalCareer[];
  users: User[];
  
  // Estados de carga y errores
  loading: {
    students: boolean;
    professors: boolean;
    subjects: boolean;
    careers: boolean;
    users: boolean;
  };
  
  errors: {
    students: string | null;
    professors: string | null;
    subjects: string | null;
    careers: string | null;
    users: string | null;
  };
  
  // Entidades seleccionadas
  selectedStudent: Student | null;
  selectedProfessor: Professor | null;
  selectedSubject: Subject | null;
  selectedCareer: TechnicalCareer | null;
  selectedUser: User | null;
  
  // Estados de modales/diálogos
  modals: {
    addStudent: boolean;
    editStudent: boolean;
    addProfessor: boolean;
    editProfessor: boolean;
    addSubject: boolean;
    editSubject: boolean;
    addCareer: boolean;
    editCareer: boolean;
    manageUserRoles: boolean;
  };
  
  // Filtros de búsqueda
  filters: {
    studentsSearch: string;
    professorsSearch: string;
    subjectsSearch: string;
    careersSearch: string;
    usersSearch: string;
  };
  
  // Acciones para estudiantes
  setStudents: (students: Student[]) => void;
  addStudent: (student: Student) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  deleteStudent: (id: string) => void;
  setSelectedStudent: (student: Student | null) => void;
  
  // Acciones para profesores
  setProfessors: (professors: Professor[]) => void;
  addProfessor: (professor: Professor) => void;
  updateProfessor: (id: string, updates: Partial<Professor>) => void;
  deleteProfessor: (id: string) => void;
  setSelectedProfessor: (professor: Professor | null) => void;
  
  // Acciones para materias
  setSubjects: (subjects: Subject[]) => void;
  addSubject: (subject: Subject) => void;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;
  setSelectedSubject: (subject: Subject | null) => void;
  
  // Acciones para carreras técnicas
  setTechnicalCareers: (careers: TechnicalCareer[]) => void;
  addTechnicalCareer: (career: TechnicalCareer) => void;
  updateTechnicalCareer: (id: string, updates: Partial<TechnicalCareer>) => void;
  deleteTechnicalCareer: (id: string) => void;
  setSelectedCareer: (career: TechnicalCareer | null) => void;
  
  // Acciones para usuarios
  setUsers: (users: User[]) => void;
  updateUserRoles: (id: string, roles: string[]) => void;
  setSelectedUser: (user: User | null) => void;
  
  // Acciones de carga
  setLoading: (entity: keyof AdministrationState['loading'], isLoading: boolean) => void;
  setError: (entity: keyof AdministrationState['errors'], error: string | null) => void;
  
  // Acciones de modales
  openModal: (modal: keyof AdministrationState['modals']) => void;
  closeModal: (modal: keyof AdministrationState['modals']) => void;
  closeAllModals: () => void;
  
  // Acciones de filtros
  setFilter: (entity: keyof AdministrationState['filters'], value: string) => void;
  clearFilters: () => void;
}

const initialLoading = {
  students: false,
  professors: false,
  subjects: false,
  careers: false,
  users: false,
};

const initialErrors = {
  students: null,
  professors: null,
  subjects: null,
  careers: null,
  users: null,
};

const initialModals = {
  addStudent: false,
  editStudent: false,
  addProfessor: false,
  editProfessor: false,
  addSubject: false,
  editSubject: false,
  addCareer: false,
  editCareer: false,
  manageUserRoles: false,
};

const initialFilters = {
  studentsSearch: '',
  professorsSearch: '',
  subjectsSearch: '',
  careersSearch: '',
  usersSearch: '',
};

export const useAdministrationStore = create<AdministrationState>((set) => ({
  // Estado inicial
  students: [],
  professors: [],
  subjects: [],
  technicalCareers: [],
  users: [],
  loading: initialLoading,
  errors: initialErrors,
  selectedStudent: null,
  selectedProfessor: null,
  selectedSubject: null,
  selectedCareer: null,
  selectedUser: null,
  modals: initialModals,
  filters: initialFilters,

  // Acciones para estudiantes
  setStudents: (students) => set({ students }),
  addStudent: (student) => set((state) => ({ 
    students: [...state.students, student] 
  })),
  updateStudent: (id, updates) => set((state) => ({
    students: state.students.map(student => 
      student.id === id ? { ...student, ...updates } : student
    )
  })),
  deleteStudent: (id) => set((state) => ({
    students: state.students.filter(student => student.id !== id),
    selectedStudent: state.selectedStudent?.id === id ? null : state.selectedStudent
  })),
  setSelectedStudent: (student) => set({ selectedStudent: student }),

  // Acciones para profesores
  setProfessors: (professors) => set({ professors }),
  addProfessor: (professor) => set((state) => ({ 
    professors: [...state.professors, professor] 
  })),
  updateProfessor: (id, updates) => set((state) => ({
    professors: state.professors.map(professor => 
      professor.id === id ? { ...professor, ...updates } : professor
    )
  })),
  deleteProfessor: (id) => set((state) => ({
    professors: state.professors.filter(professor => professor.id !== id),
    selectedProfessor: state.selectedProfessor?.id === id ? null : state.selectedProfessor
  })),
  setSelectedProfessor: (professor) => set({ selectedProfessor: professor }),

  // Acciones para materias
  setSubjects: (subjects) => set({ subjects }),
  addSubject: (subject) => set((state) => ({ 
    subjects: [...state.subjects, subject] 
  })),
  updateSubject: (id, updates) => set((state) => ({
    subjects: state.subjects.map(subject => 
      subject.id === id ? { ...subject, ...updates } : subject
    )
  })),
  deleteSubject: (id) => set((state) => ({
    subjects: state.subjects.filter(subject => subject.id !== id),
    selectedSubject: state.selectedSubject?.id === id ? null : state.selectedSubject
  })),
  setSelectedSubject: (subject) => set({ selectedSubject: subject }),

  // Acciones para carreras técnicas
  setTechnicalCareers: (careers) => set({ technicalCareers: careers }),
  addTechnicalCareer: (career) => set((state) => ({ 
    technicalCareers: [...state.technicalCareers, career] 
  })),
  updateTechnicalCareer: (id, updates) => set((state) => ({
    technicalCareers: state.technicalCareers.map(career => 
      career.id === id ? { ...career, ...updates } : career
    )
  })),
  deleteTechnicalCareer: (id) => set((state) => ({
    technicalCareers: state.technicalCareers.filter(career => career.id !== id),
    selectedCareer: state.selectedCareer?.id === id ? null : state.selectedCareer
  })),
  setSelectedCareer: (career) => set({ selectedCareer: career }),

  // Acciones para usuarios
  setUsers: (users) => set({ users }),
  updateUserRoles: (id, roles) => set((state) => ({
    users: state.users.map(user => 
      user.id === id ? { ...user, roles } : user
    )
  })),
  setSelectedUser: (user) => set({ selectedUser: user }),

  // Acciones de carga y errores
  setLoading: (entity, isLoading) => set((state) => ({
    loading: { ...state.loading, [entity]: isLoading }
  })),
  setError: (entity, error) => set((state) => ({
    errors: { ...state.errors, [entity]: error }
  })),

  // Acciones de modales
  openModal: (modal) => set((state) => ({
    modals: { ...state.modals, [modal]: true }
  })),
  closeModal: (modal) => set((state) => ({
    modals: { ...state.modals, [modal]: false }
  })),
  closeAllModals: () => set({ modals: initialModals }),

  // Acciones de filtros
  setFilter: (entity, value) => set((state) => ({
    filters: { ...state.filters, [entity]: value }
  })),
  clearFilters: () => set({ filters: initialFilters }),
}));