export class Filter {
  selectedScenes: string[];
  selectedCharacterTypes: string[];

  sceneList: Scene[];
  characterTypeList: CharacterType[];


  hoveredCharacter: any;
  hoveredRelationship: any;
}

export class Scene {
  id: string;
  displayName: string;
  selected: boolean = true;

  sentiment: number;

  constructor(id: string, displayName: string) {
    this.id = id;
    this.displayName = displayName;
  }
}

export class CharacterType {
  id: string;
  displayName: string;
  selected: boolean = true;

  constructor(id: string, displayName: string) {
    this.id = id;
    this.displayName = displayName;
  }
}

export const allCharacters = [
  { id: "Hermia",       type: 'lover', total: 1286, a1s1: 432, a1s2: 0,   a2s1: 0,   a2s2: 205, a3s1: 0,   a3s2: 633, a4s1: 16,  a4s2: 0,   a5s1: 0   },
  { id: "Moth",         type: 'fairy', total: 3,    a1s1: 0,   a1s2: 0,   a2s1: 0,   a2s2: 0,   a3s1: 7,   a3s2: 0,   a4s1: 0,   a4s2: 0,   a5s1: 0   },
  { id: "Peaseblossom", type: 'fairy', total: 5,    a1s1: 0,   a1s2: 0,   a2s1: 0,   a2s2: 0,   a3s1: 8,   a3s2: 0,   a4s1: 1,   a4s2: 0,   a5s1: 0   },
  { id: "Titania",      type: 'fairy', total: 1082, a1s1: 0,   a1s2: 0,   a2s1: 545, a2s2: 67,  a3s1: 269, a3s2: 0,   a4s1: 176, a4s2: 0,   a5s1: 25  },
  { id: "Demetrius",    type: 'lover', total: 1069, a1s1: 13,  a1s2: 0,   a2s1: 190, a2s2: 18,  a3s1: 0,   a3s2: 485, a4s1: 198, a4s2: 0,   a5s1: 165 },
  { id: "Hippolyta",    type: 'other', total: 249,  a1s1: 35,  a1s2: 0,   a2s1: 0,   a2s2: 0,   a3s1: 0,   a3s2: 0,   a4s1: 54,  a4s2: 0,   a5s1: 160 },
  { id: "Second Fairy", type: 'fairy', total: 10,   a1s1: 0,   a1s2: 0,   a2s1: 0,   a2s2: 10,  a3s1: 0,   a3s2: 0,   a4s1: 0,   a4s2: 0,   a5s1: 0   },
  { id: "Quince",       type: 'actor', total: 864,  a1s1: 0,   a1s2: 337, a2s1: 0,   a2s2: 0,   a3s1: 272, a3s2: 0,   a4s1: 0,   a4s2: 59,  a5s1: 196 },
  { id: "Lysander",     type: 'lover', total: 1396, a1s1: 406, a1s2: 0,   a2s1: 0,   a2s2: 359, a3s1: 0,   a3s2: 477, a4s1: 75,  a4s2: 0,   a5s1: 79  },
  { id: "Helena",       type: 'lover', total: 1815, a1s1: 350, a1s2: 0,   a2s1: 292, a2s2: 256, a3s1: 0,   a3s2: 899, a4s1: 18,  a4s2: 0,   a5s1: 0   },
  { id: "Robin",        type: 'fairy', total: 1378, a1s1: 0,   a1s2: 0,   a2s1: 273, a2s2: 105, a3s1: 92,  a3s2: 677, a4s1: 22,  a4s2: 0,   a5s1: 209 },
  { id: "First Fairy",  type: 'fairy', total: 44,   a1s1: 0,   a1s2: 0,   a2s1: 0,   a2s2: 44,  a3s1: 0,   a3s2: 0,   a4s1: 0,   a4s2: 0,   a5s1: 0   },
  { id: "Theseus",      type: 'other', total: 1720, a1s1: 467, a1s2: 0,   a2s1: 0,   a2s2: 0,   a3s1: 0,   a3s2: 0,   a4s1: 304, a4s2: 0,   a5s1: 949 },
  { id: "Cobweb",       type: 'fairy', total: 5,    a1s1: 0,   a1s2: 0,   a2s1: 0,   a2s2: 0,   a3s1: 8,   a3s2: 0,   a4s1: 1,   a4s2: 0,   a5s1: 0   },
  { id: "Egeus",        type: 'other', total: 290,  a1s1: 213, a1s2: 0,   a2s1: 0,   a2s2: 0,   a3s1: 0,   a3s2: 0,   a4s1: 77,  a4s2: 0,   a5s1: 0   },
  { id: "Snout",        type: 'actor', total: 160,  a1s1: 0,   a1s2: 3,   a2s1: 0,   a2s2: 0,   a3s1: 57,  a3s2: 0,   a4s1: 0,   a4s2: 0,   a5s1: 100 },
  { id: "Oberon",       type: 'fairy', total: 1609, a1s1: 0,   a1s2: 0,   a2s1: 605, a2s2: 54,  a3s1: 0,   a3s2: 463, a4s1: 336, a4s2: 0,   a5s1: 152 },
  { id: "Starveling",   type: 'actor', total: 90,   a1s1: 0,   a1s2: 3,   a2s1: 0,   a2s2: 0,   a3s1: 18,  a3s2: 0,   a4s1: 0,   a4s2: 11,  a5s1: 58  },
  { id: "Flute",        type: 'actor', total: 356,  a1s1: 0,   a1s2: 21,  a2s1: 0,   a2s2: 0,   a3s1: 57,  a3s2: 0,   a4s1: 0,   a4s2: 91,  a5s1: 187 },
  { id: "Philostrate",  type: 'other', total: 185,  a1s1: 0,   a1s2: 0,   a2s1: 0,   a2s2: 0,   a3s1: 0,   a3s2: 0,   a4s1: 0,   a4s2: 0,   a5s1: 185 },
  { id: "Mustardseed",  type: 'fairy', total: 8,    a1s1: 0,   a1s2: 0,   a2s1: 0,   a2s2: 0,   a3s1: 8,   a3s2: 0,   a4s1: 4,   a4s2: 0,   a5s1: 0   },
  { id: "Bottom",       type: 'actor', total: 2035, a1s1: 0,   a1s2: 365, a2s1: 0,   a2s2: 0,   a3s1: 707, a3s2: 0,   a4s1: 395, a4s2: 157, a5s1: 411 },
  { id: "Snug",         type: 'actor', total: 120,  a1s1: 0,   a1s2: 20,  a2s1: 0,   a2s2: 0,   a3s1: 0,   a3s2: 0,   a4s1: 0,   a4s2: 31,  a5s1: 69  },
  { id: "Fairy",        type: 'fairy', total: 187,  a1s1: 0,   a1s2: 0,   a2s1: 187, a2s2: 0,   a3s1: 0,   a3s2: 0,   a4s1: 0,   a4s2: 0,   a5s1: 0   }
];
