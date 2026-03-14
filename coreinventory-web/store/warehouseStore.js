import { create } from 'zustand';

const useWarehouseStore = create((set) => ({
  warehouses: [],
  setWarehouses: (warehouses) => set({ warehouses }),
  addWarehouse: (warehouse) => set((state) => ({ 
    warehouses: [...state.warehouses, warehouse] 
  })),
  updateWarehouse: (id, updatedData) => set((state) => ({
    warehouses: state.warehouses.map(w => 
      w._id === id || w.id === id ? { ...w, ...updatedData } : w
    )
  })),
  removeWarehouse: (id) => set((state) => ({
    warehouses: state.warehouses.filter(w => w._id !== id && w.id !== id)
  })),
  clearWarehouses: () => set({ warehouses: [] })
}));

export default useWarehouseStore;
