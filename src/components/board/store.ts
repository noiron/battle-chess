import { create } from 'zustand';
import { figures } from './data';
import { FigureType } from '.';
import { Pos } from '../../types';

// 棋子分为以下的几种状态：
// 1. 未选中状态 [normal]
// 2. 选中状态，展示可移动的位置 [waitMove]
// 3. 执行了移动操作，展示可选择操作菜单 [waitAction]
//  -- 4.1 选择了攻击操作，展示可攻击的位置 [waitAttack]
//  -- -- 5.1 取消了攻击，则回到状态2
//  -- -- 5.2 执行了攻击，则回到状态1
//  -- 4.2 选择了待机，则回到状态1
//  -- 4.3 选择了取消，则回到状态2，并回到原来的位置
export type FigureStatus = 'normal' | 'waitMove' | 'waitAction' | 'waitAttack';

interface FigureState {
  status: FigureStatus;
  showMenu: boolean;
  selectedFigure: FigureType | null;
  oldPos?: Pos;
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
  setFigureWaitMove: (figure: FigureType) => void;
  /** 移动后，展示操作菜单；如果位置未改变，则保持选中的棋子信息 */
  setFigureWaitAction: (
    figure: FigureType,
    showMenu: boolean,
    oldPos?: Pos
  ) => void;
  setFigureShowMenu: () => void;
  setFigureHideMenu: () => void;
  setFigureWaitAttack: () => void;
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
  setFigureWaitMove: (figure) => {
    set({
      figureState: {
        status: 'waitMove',
        selectedFigure: figure,
        showMenu: false,
        oldPos: undefined,
      },
    });
  },
  setFigureWaitAction: (figure, showMenu, oldPos) => {
    set({
      figureState: {
        status: 'waitAction',
        selectedFigure: figure,
        showMenu,
        oldPos: oldPos || get().figureState.oldPos,
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
  setFigureHideMenu: () => {
    set({
      figureState: {
        ...get().figureState,
        showMenu: false,
      },
    });
  },
  setFigureWaitAttack: () => {
    set({
      figureState: {
        ...get().figureState,
        status: 'waitAttack',
        showMenu: false,
      },
    });
  },
}));
