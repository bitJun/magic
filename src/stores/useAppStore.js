import { create } from 'zustand';

export const useAppStore = create((set) => ({
  currentPage: null,
  selectedProject: '护肤品A系列',
  searchMode: 'text',
  modalOpen: false,
  setCurrentPage: (page) => set({ currentPage: page }),
  setSelectedProject: (selectedProject) => set({ selectedProject }),
  setSearchMode: (searchMode) => set({ searchMode }),
  setModalOpen: (modalOpen) => set({ modalOpen }),
}));
