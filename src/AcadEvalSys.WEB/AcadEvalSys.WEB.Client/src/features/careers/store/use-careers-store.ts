import { create } from 'zustand';

interface TechnicalCareer {
  id: string;
  name: string;
  code: string;
  description: string;
  duration: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface CareerFormData {
  name: string;
  code: string;
  description: string;
  duration: number;
}

interface CareersState {
  // Estado de carreras
  careers: TechnicalCareer[];
  selectedCareer: TechnicalCareer | null;
  isLoading: boolean;
  error: string | null;
  
  // Estado de formularios
  isCreating: boolean;
  isEditing: boolean;
  formData: CareerFormData | null;
  formErrors: Record<string, string>;
  
  // Filtros y búsqueda
  searchTerm: string;
  statusFilter: 'all' | 'active' | 'inactive';
  
  // Paginación
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  
  // Modales
  showCreateModal: boolean;
  showEditModal: boolean;
  showDeleteConfirm: boolean;
  
  // Acciones principales
  setCareers: (careers: TechnicalCareer[]) => void;
  addCareer: (career: TechnicalCareer) => void;
  updateCareer: (id: string, updates: Partial<TechnicalCareer>) => void;
  deleteCareer: (id: string) => void;
  setSelectedCareer: (career: TechnicalCareer | null) => void;
  
  // Acciones de estado
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Acciones de formulario
  setFormData: (data: CareerFormData | null) => void;
  setFormErrors: (errors: Record<string, string>) => void;
  clearFormErrors: () => void;
  setCreating: (isCreating: boolean) => void;
  setEditing: (isEditing: boolean) => void;
  
  // Acciones de filtros
  setSearchTerm: (term: string) => void;
  setStatusFilter: (filter: 'all' | 'active' | 'inactive') => void;
  clearFilters: () => void;
  
  // Acciones de paginación
  setCurrentPage: (page: number) => void;
  setItemsPerPage: (items: number) => void;
  setTotalItems: (total: number) => void;
  
  // Acciones de modales
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (career: TechnicalCareer) => void;
  closeEditModal: () => void;
  openDeleteConfirm: (career: TechnicalCareer) => void;
  closeDeleteConfirm: () => void;
  closeAllModals: () => void;
  
  // Funciones de utilidad
  getFilteredCareers: () => TechnicalCareer[];
  getPaginatedCareers: () => TechnicalCareer[];
}

const initialFormData: CareerFormData = {
  name: '',
  code: '',
  description: '',
  duration: 1,
};

export const useCareersStore = create<CareersState>((set, get) => ({
  // Estado inicial
  careers: [],
  selectedCareer: null,
  isLoading: false,
  error: null,
  isCreating: false,
  isEditing: false,
  formData: null,
  formErrors: {},
  searchTerm: '',
  statusFilter: 'all',
  currentPage: 1,
  itemsPerPage: 10,
  totalItems: 0,
  showCreateModal: false,
  showEditModal: false,
  showDeleteConfirm: false,

  // Acciones principales
  setCareers: (careers) => set({ careers, totalItems: careers.length }),
  
  addCareer: (career) => set((state) => {
    const newCareers = [...state.careers, career];
    return { 
      careers: newCareers, 
      totalItems: newCareers.length 
    };
  }),
  
  updateCareer: (id, updates) => set((state) => {
    const updatedCareers = state.careers.map(career => 
      career.id === id ? { ...career, ...updates } : career
    );
    return {
      careers: updatedCareers,
      selectedCareer: state.selectedCareer?.id === id 
        ? { ...state.selectedCareer, ...updates }
        : state.selectedCareer
    };
  }),
  
  deleteCareer: (id) => set((state) => {
    const filteredCareers = state.careers.filter(career => career.id !== id);
    return {
      careers: filteredCareers,
      totalItems: filteredCareers.length,
      selectedCareer: state.selectedCareer?.id === id ? null : state.selectedCareer
    };
  }),
  
  setSelectedCareer: (career) => set({ selectedCareer: career }),

  // Acciones de estado
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),

  // Acciones de formulario
  setFormData: (data) => set({ formData: data }),
  setFormErrors: (errors) => set({ formErrors: errors }),
  clearFormErrors: () => set({ formErrors: {} }),
  setCreating: (isCreating) => set({ isCreating }),
  setEditing: (isEditing) => set({ isEditing }),

  // Acciones de filtros
  setSearchTerm: (term) => set({ searchTerm: term, currentPage: 1 }),
  setStatusFilter: (filter) => set({ statusFilter: filter, currentPage: 1 }),
  clearFilters: () => set({ 
    searchTerm: '', 
    statusFilter: 'all', 
    currentPage: 1 
  }),

  // Acciones de paginación
  setCurrentPage: (page) => set({ currentPage: page }),
  setItemsPerPage: (items) => set({ itemsPerPage: items, currentPage: 1 }),
  setTotalItems: (total) => set({ totalItems: total }),

  // Acciones de modales
  openCreateModal: () => set({ 
    showCreateModal: true, 
    formData: { ...initialFormData },
    formErrors: {} 
  }),
  
  closeCreateModal: () => set({ 
    showCreateModal: false, 
    formData: null,
    formErrors: {},
    isCreating: false 
  }),
  
  openEditModal: (career) => set({ 
    showEditModal: true,
    selectedCareer: career,
    formData: {
      name: career.name,
      code: career.code,
      description: career.description,
      duration: career.duration,
    },
    formErrors: {} 
  }),
  
  closeEditModal: () => set({ 
    showEditModal: false, 
    formData: null,
    formErrors: {},
    isEditing: false 
  }),
  
  openDeleteConfirm: (career) => set({ 
    showDeleteConfirm: true, 
    selectedCareer: career 
  }),
  
  closeDeleteConfirm: () => set({ 
    showDeleteConfirm: false, 
    selectedCareer: null 
  }),
  
  closeAllModals: () => set({
    showCreateModal: false,
    showEditModal: false,
    showDeleteConfirm: false,
    formData: null,
    formErrors: {},
    isCreating: false,
    isEditing: false,
  }),

  // Funciones de utilidad
  getFilteredCareers: () => {
    const { careers, searchTerm, statusFilter } = get();
    
    return careers.filter(career => {
      const matchesSearch = searchTerm === '' || 
        career.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        career.code.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && career.isActive) ||
        (statusFilter === 'inactive' && !career.isActive);
      
      return matchesSearch && matchesStatus;
    });
  },
  
  getPaginatedCareers: () => {
    const { currentPage, itemsPerPage } = get();
    const filteredCareers = get().getFilteredCareers();
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return filteredCareers.slice(startIndex, endIndex);
  },
}));