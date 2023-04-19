interface Faction {
  name: string;
  cities: string[];
  ruler: string;
  characters: string[];
}

export interface CityInfo {
  name: string;
  faction: string;
  population: number;
  money: number;
}

export interface Character {
  name: string;
  faction: string;
  city: string;
  power: number;
  intelligence: number;
  isBusy: boolean;
}

class Game {
  /** 玩家选择的游戏势力 */
  playerFaction = '';

  factions: {
    [faction: string]: Faction;
  } = {};

  cities: {
    [city: string]: CityInfo;
  } = {};

  characters: Character[] = [];

  year = 200;
  month = 1;

  constructor() {
    this.init();
  }

  initFaction = (faction = '') => {
    this.playerFaction = faction;
  };

  /** 根据选择的势力对游戏进行初始化 */
  init() {
    this.factions = {
      魏: {
        name: '魏',
        cities: ['洛阳'],
        ruler: '曹操',
        characters: ['曹操', '许褚', '郭嘉'],
      },
      蜀: {
        name: '蜀',
        cities: ['成都'],
        ruler: '刘备',
        characters: ['刘备', '关羽', '张飞'],
      },
      吴: {
        name: '吴',
        cities: ['建邺'],
        ruler: '孙权',
        characters: ['孙权', '周瑜', '吕蒙'],
      },
    };
    this.cities = {
      洛阳: {
        name: '洛阳',
        faction: '魏',
        population: 50000,
        money: 5000,
      },
      成都: {
        name: '成都',
        faction: '蜀',
        population: 20000,
        money: 2000,
      },
      建邺: {
        name: '建邺',
        faction: '吴',
        population: 30000,
        money: 3000,
      },
    };
    this.characters = [
      {
        name: '曹操',
        faction: '魏',
        city: '洛阳',
        power: 100,
        intelligence: 100,
        isBusy: false,
      },
      {
        name: '许褚',
        faction: '魏',
        city: '洛阳',
        power: 100,
        intelligence: 100,
        isBusy: false,
      },
      {
        name: '郭嘉',
        faction: '魏',
        city: '洛阳',
        power: 100,
        intelligence: 100,
        isBusy: false,
      },
      {
        name: '刘备',
        faction: '蜀',
        city: '成都',
        power: 100,
        intelligence: 100,
        isBusy: false,
      },
      {
        name: '关羽',
        faction: '蜀',
        city: '成都',
        power: 100,
        intelligence: 100,
        isBusy: false,
      },
      {
        name: '张飞',
        faction: '蜀',
        city: '成都',
        power: 100,
        intelligence: 100,
        isBusy: false,
      },
      {
        name: '孙权',
        faction: '吴',
        city: '建邺',
        power: 100,
        intelligence: 100,
        isBusy: false,
      },
      {
        name: '周瑜',
        faction: '吴',
        city: '建邺',
        power: 100,
        intelligence: 100,
        isBusy: false,
      },
      {
        name: '吕蒙',
        faction: '吴',
        city: '建邺',
        power: 100,
        intelligence: 100,
        isBusy: false,
      },
    ];
  }

  saveData() {
    localStorage.setItem(
      'game',
      JSON.stringify({
        playerFaction: this.playerFaction,
        data: this.factions,
      })
    );
  }

  loadData() {
    const data = JSON.parse(localStorage.getItem('game') || '{}');
    this.playerFaction = data.playerFaction;
    this.factions = data.factions;
  }

  nextTurn() {
    this.month++;
    if (this.month > 12) {
      this.month = 1;
      this.year++;
    }
    // 将所有角色的忙碌状态重置
    this.characters.forEach((character) => {
      character.isBusy = false;
    });
  }
}

export default new Game();
