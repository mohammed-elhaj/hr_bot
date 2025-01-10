// src/hooks/useVacation.ts
import { useContext } from 'react';
import { VacationContext } from '../context/VacationContext';


export const useVacation = () => {
  const context = useContext(VacationContext);
  if (context === undefined) {
    throw new Error('useVacation must be used within a VacationProvider');
  }
  return context;
};