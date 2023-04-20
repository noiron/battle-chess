import { TERRAIN_TYPE } from "@constants";
import { FigureType } from ".";

export const terrain: TERRAIN_TYPE[][] = [
  [1, 0, 0, 0, 0, 0, 3, 3, 3, 3, 0, 2, 2, 2, 2, 2],
  [0, 0, 0, 2, 0, 0, 3, 3, 3, 3, 0, 0, 2, 2, 0, 0],
  [2, 2, 2, 2, 0, 0, 3, 1, 3, 3, 0, 0, 2, 2, 0, 0],
  [4, 4, 4, 4, 4, 4, 1, 1, 1, 0, 3, 0, 0, 0, 2, 2],
  [4, 4, 4, 4, 4, 4, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 4, 4, 0, 2, 2, 2, 2, 0, 0, 0, 0, 0],
  [3, 3, 3, 0, 4, 4, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2],
  [3, 3, 3, 0, 4, 4, 3, 3, 3, 0, 0, 0, 3, 3, 3, 3],
  [0, 3, 0, 0, 4, 4, 2, 2, 2, 2, 0, 0, 0, 0, 3, 3],
  [0, 3, 0, 0, 4, 4, 2, 2, 2, 2, 0, 0, 0, 0, 3, 3],
];

export const figures: FigureType[] = [
  {
    id: 10,
    x: 2,
    y: 6,
    type: 'cavalry',
    actionable: true,
    side: 'enemy',
    name: '曹操',
    life: 100,
    power: 84,
    intelligence: 90,
  },
  {
    id: 11,
    x: 3,
    y: 5,
    type: 'archer',
    actionable: true,
    side: 'enemy',
    name: '张辽',
    life: 100,
    power: 93,
    intelligence: 82,
  },
  {
    id: 12,
    x: 3,
    y: 6,
    type: 'infantry',
    actionable: true,
    side: 'enemy',
    name: '许褚',
    life: 100,
    power: 96,
    intelligence: 24,
  },
  {
    id: 13,
    x: 2,
    y: 7,
    type: 'cavalry',
    actionable: true,
    side: 'enemy',
    name: '夏侯惇',
    life: 100,
    power: 92,
    intelligence: 60,
  },
  {
    id: 14,
    x: 3,
    y: 7,
    type: 'archer',
    actionable: true,
    side: 'enemy',
    name: '曹洪',
    life: 100,
    power: 80,
    intelligence: 63,
  },
  {
    id: 5,
    x: 7,
    y: 6,
    type: 'cavalry',
    actionable: true,
    side: 'ally',
    name: '刘备',
    life: 100,
    power: 85,
    intelligence: 76,
  },
  {
    id: 1,
    x: 8,
    y: 6,
    type: 'archer',
    actionable: true,
    side: 'ally',
    name: '赵云',
    life: 100,
    power: 98,
    intelligence: 87,
  },
  {
    id: 2,
    x: 6,
    y: 6,
    type: 'cavalry',
    actionable: true,
    side: 'ally',
    name: '张飞',
    life: 100,
    power: 107,
    intelligence: 67,
  },
  {
    id: 3,
    x: 6,
    y: 5,
    type: 'infantry',
    actionable: true,
    side: 'ally',
    name: '关羽',
    life: 100,
    power: 106,
    intelligence: 81,
  },
];