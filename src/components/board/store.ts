import { create } from 'zustand';
import { figures } from './data';
import { FigureType } from '.';

// 棋子分为以下的几种状态：
// 1. 未选中状态 [normal]
// 2. 选中状态，展示可移动的位置 [move]
// 3. 执行了移动操作，展示可选择操作菜单 [action]
// 4.1 选择了攻击操作，展示可攻击的位置 [attack]
// 5.1 取消了攻击，则回到状态2
// 5.2 执行了攻击，则回到状态1
type FigureStatus = 'normal' | 'move' | 'action' | 'attack';

interface FigureState {
  status: FigureStatus;
  showMenu: boolean;
  selectedFigure: FigureType | null;
}

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
  figureState: FigureState;
  setFigureNormal: () => void;
  /** 选中棋子 */
  setFigureMove: (figure: FigureType) => void;
  /** 移动后，展示操作菜单；如果位置未改变，则保持选中的棋子信息 */
  setFigureAction: (figure: FigureType | null, showMenu: boolean) => void;
  setFigureShowMenu: () => void;
  setFigureAttack: () => void;
}

export const useBattleStore = create<BearState>((set, get) => ({
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

  figureState: {
    status: 'normal',
    showMenu: false,
    selectedFigure: null,
  },
  setFigureNormal: () => {
    set({
      figureState: {
        status: 'normal',
        showMenu: false,
        selectedFigure: null,
      },
    });
  },
  setFigureMove: (figure) => {
    set({
      figureState: {
        status: 'move',
        selectedFigure: figure,
        showMenu: false,
      },
    });
  },
  setFigureAction: (figure, showMenu) => {
    set({
      figureState: {
        status: 'action',
        selectedFigure: figure || get().figureState.selectedFigure,
        showMenu,
      },
    });
  },
  setFigureShowMenu: () => {
    set({
      figureState: {
        ...get().figureState,
        showMenu: true,
      },
    });
  },
  setFigureAttack: () => {
    set({
      figureState: {
        status: 'attack',
        selectedFigure: get().figureState.selectedFigure,
        showMenu: false,
      },
    });
  },
}));
