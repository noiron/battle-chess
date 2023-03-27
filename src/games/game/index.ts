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

class Game {
  /** 玩家选择的游戏势力 */
  playerFaction = '';

  factions: {
    [faction: string]: Faction;
  } = {};

  cities: {
    [city: string]: CityInfo;
  } = {};

  constructor() {
    this.init();
  }

  initFaction = (faction: string = '') => {
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
}

export default new Game();
