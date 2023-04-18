import { create } from 'zustand';
import { figures } from './data';
import { FigureType } from '.';

interface BearState {
  days: number;
  addADay: () => void;
  allFigures: FigureType[];
  /** 根据 ID 更新棋子的部分属性 */
  updateFigure: (
    id: number,
    newFigureProps: Partial<FigureType>
  ) => FigureType | null;
  removeFigureById: (id: number) => void;
  enableAllFigures: () => void;
}

export const useBattleStore = create<BearState>((set) => ({
  days: 1,
  addADay: () => set((state) => ({ days: state.days + 1 })),

  allFigures: [...figures],

  updateFigure: (id: number, newFigureProps: Partial<FigureType>) => {
    let newFigure = null;
    set((state) => {
      const allFigures = [...state.allFigures];
      const index = state.allFigures.findIndex((f) => f.id === id);
      if (index === -1) return { allFigures };

      const oldFigure = allFigures[index];
      newFigure = Object.assign({}, oldFigure, newFigureProps);
      allFigures.splice(index, 1, newFigure);
      return { allFigures };
    });
    return newFigure;
  },

  removeFigureById: (id: number) => {
    set((state) => {
      return { allFigures: [...state.allFigures.filter((f) => f.id !== id)] };
    });
  },

  enableAllFigures: () => {
    set((state) => {
      const allFigures = [...state.allFigures];
      allFigures.forEach((f) => (f.actionable = true));
      return { allFigures };
    });
  },
}));
