export const type = {
    LOVER: 'lover',
    ACTOR: 'actor',
    FAIRY: 'fairy',
    OTHER: 'other'
}

export var nodes =  [
    { id: "Hermia",       type: type.LOVER, radius: 0, visible: true, selected: false, total: 1286, a1s1: 432, a1s2: 0,   a2s1: 0,   a2s2: 205, a3s1: 0,   a3s2: 633, a4s1: 16,  a4s2: 0,   a5s1: 0 },
    { id: "Moth",         type: type.FAIRY, radius: 0, visible: true, selected: false, total: 3,    a1s1: 0,   a1s2: 0,   a2s1: 0,   a2s2: 0,   a3s1: 7,   a3s2: 0,   a4s1: 0,   a4s2: 0,   a5s1: 0 },
    { id: "Peaseblossom", type: type.FAIRY, radius: 0, visible: true, selected: false, total: 5,    a1s1: 0,   a1s2: 0,   a2s1: 0,   a2s2: 0,   a3s1: 8,   a3s2: 0,   a4s1: 1,   a4s2: 0,   a5s1: 0 },
    { id: "Titania",      type: type.FAIRY, radius: 0, visible: true, selected: false, total: 1082, a1s1: 0,   a1s2: 0,   a2s1: 545, a2s2: 67,  a3s1: 269, a3s2: 0,   a4s1: 176, a4s2: 0,   a5s1: 25 },
    { id: "Demetrius",    type: type.LOVER, radius: 0, visible: true, selected: false, total: 1069, a1s1: 13,  a1s2: 0,   a2s1: 190, a2s2: 18,  a3s1: 0,   a3s2: 485, a4s1: 198, a4s2: 0,   a5s1: 165 },
    { id: "Hippolyta",    type: type.OTHER, radius: 0, visible: true, selected: false, total: 249,  a1s1: 35,  a1s2: 0,   a2s1: 0,   a2s2: 0,   a3s1: 0,   a3s2: 0,   a4s1: 54,  a4s2: 0,   a5s1: 160 },
    { id: "Second fairy", type: type.FAIRY, radius: 0, visible: true, selected: false, total: 10,   a1s1: 0,   a1s2: 0,   a2s1: 0,   a2s2: 10,  a3s1: 0,   a3s2: 0,   a4s1: 0,   a4s2: 0,   a5s1: 0 },
    { id: "Quince",       type: type.ACTOR, radius: 0, visible: true, selected: false, total: 864,  a1s1: 0,   a1s2: 337, a2s1: 0,   a2s2: 0,   a3s1: 272, a3s2: 0,   a4s1: 0,   a4s2: 59,  a5s1: 276 },
    { id: "Lysander",     type: type.LOVER, radius: 0, visible: true, selected: false, total: 1396, a1s1: 406, a1s2: 0,   a2s1: 0,   a2s2: 359, a3s1: 0,   a3s2: 477, a4s1: 75,  a4s2: 0,   a5s1: 79 },
    { id: "Helena",       type: type.LOVER, radius: 0, visible: true, selected: false, total: 1815, a1s1: 350, a1s2: 0,   a2s1: 292, a2s2: 256, a3s1: 0,   a3s2: 899, a4s1: 18,  a4s2: 0,   a5s1: 0 },
    { id: "Puck",         type: type.FAIRY, radius: 0, visible: true, selected: false, total: 1378, a1s1: 0,   a1s2: 0,   a2s1: 273, a2s2: 105, a3s1: 92,  a3s2: 677, a4s1: 22,  a4s2: 0,   a5s1: 209 },
    { id: "First fairy",  type: type.FAIRY, radius: 0, visible: true, selected: false, total: 44,   a1s1: 0,   a1s2: 0,   a2s1: 0,   a2s2: 44,  a3s1: 0,   a3s2: 0,   a4s1: 0,   a4s2: 0,   a5s1: 0 },
    { id: "Theseus",      type: type.OTHER, radius: 0, visible: true, selected: false, total: 1720, a1s1: 467, a1s2: 0,   a2s1: 0,   a2s2: 0,   a3s1: 0,   a3s2: 0,   a4s1: 304, a4s2: 0,   a5s1: 949 },
    { id: "Cobweb",       type: type.FAIRY, radius: 0, visible: true, selected: false, total: 5,    a1s1: 0,   a1s2: 0,   a2s1: 0,   a2s2: 0,   a3s1: 8,   a3s2: 0,   a4s1: 1,   a4s2: 0,   a5s1: 0 },
    { id: "Egeus",        type: type.OTHER, radius: 0, visible: true, selected: false, total: 290,  a1s1: 213, a1s2: 0,   a2s1: 0,   a2s2: 0,   a3s1: 0,   a3s2: 0,   a4s1: 77,  a4s2: 0,   a5s1: 0 },
    { id: "Snout",        type: type.ACTOR, radius: 0, visible: true, selected: false, total: 160,  a1s1: 0,   a1s2: 3,   a2s1: 0,   a2s2: 0,   a3s1: 57,  a3s2: 0,   a4s1: 0,   a4s2: 0,   a5s1: 100 }, 
    { id: "Oberon",       type: type.FAIRY, radius: 0, visible: true, selected: false, total: 1609, a1s1: 0,   a1s2: 0,   a2s1: 605, a2s2: 54,  a3s1: 0,   a3s2: 463, a4s1: 336, a4s2: 0,   a5s1: 152 },
    { id: "Starveling",   type: type.ACTOR, radius: 0, visible: true, selected: false, total: 90,   a1s1: 0,   a1s2: 3,   a2s1: 0,   a2s2: 0,   a3s1: 18,  a3s2: 0,   a4s1: 0,   a4s2: 11,  a5s1: 58 },
    { id: "Flute",        type: type.ACTOR, radius: 0, visible: true, selected: false, total: 356,  a1s1: 0,   a1s2: 21,  a2s1: 0,   a2s2: 0,   a3s1: 57,  a3s2: 0,   a4s1: 0,   a4s2: 91,  a5s1: 187 },
    { id: "Philostrate",  type: type.OTHER, radius: 0, visible: true, selected: false, total: 185,  a1s1: 0,   a1s2: 0,   a2s1: 0,   a2s2: 0,   a3s1: 0,   a3s2: 0,   a4s1: 0,   a4s2: 0,   a5s1: 185 },
    { id: "Mustardseed",  type: type.FAIRY, radius: 0, visible: true, selected: false, total: 8,    a1s1: 0,   a1s2: 0,   a2s1: 0,   a2s2: 0,   a3s1: 8,   a3s2: 0,   a4s1: 4,   a4s2: 0,   a5s1: 0 },
    { id: "Bottom",       type: type.ACTOR, radius: 0, visible: true, selected: false, total: 2035, a1s1: 0,   a1s2: 365, a2s1: 0,   a2s2: 0,   a3s1: 707, a3s2: 0,   a4s1: 395, a4s2: 157, a5s1: 411 }, 
    { id: "Snug",         type: type.ACTOR, radius: 0, visible: true, selected: false, total: 120,  a1s1: 0,   a1s2: 20,  a2s1: 0,   a2s2: 0,   a3s1: 0,   a3s2: 0,   a4s1: 0,   a4s2: 31,  a5s1: 69 },
    { id: "Fairy",        type: type.FAIRY, radius: 0, visible: true, selected: false, total: 187,  a1s1: 0,   a1s2: 0,   a2s1: 187,   a2s2: 0, a3s1: 0,   a3s2: 0,   a4s1: 0,   a4s2: 0,   a5s1: 0 }
  ];
  //a5s1 Quince 86


const characters = {
    HERMIA: nodes[0],
    MOTE: nodes[1],
    PEASEBLOSSOM: nodes[2],
    TITANIA: nodes[3],
    DEMETRIUS: nodes[4],
    HIPPOLYTA: nodes[5],
    SECONDFAIRY: nodes[6],
    QUINCE: nodes[7],
    LYSANDER: nodes[8],
    HELENA: nodes[9],
    PUCK: nodes[10],
    FIRSTFAIRY: nodes[11],
    THESEUS: nodes[12],
    COBWEB: nodes[13],
    EGEUS: nodes[14],
    SNOUT: nodes[15],
    OBERON: nodes[16],
    STARVELING: nodes[17],
    FLUTE: nodes[18],
    PHILOSTRATE: nodes[19],
    MUSTARDSEED: nodes[20],
    BOTTOM: nodes[21],
    SNUG: nodes[22],
    FAIRY: nodes[23]
}

export const links = [
    { source: characters.HERMIA, target: characters.DEMETRIUS, sentiment: -1 },
    { source: characters.HERMIA, target: characters.LYSANDER,  sentiment: 0.5 },
    { source: characters.HERMIA, target: characters.HELENA,    sentiment: 0.5, },
    //{ source: characters.HERMIA, target: characters.THESEUS,  sentiment: 0 },

    //{ source: characters.MOTE, target: characters.TITANIA, total: 1 },
    { source: characters.MOTE, target: characters.BOTTOM,  total: 1 },

    { source: characters.PEASEBLOSSOM, target: characters.TITANIA, sentiment: 0.5},
    { source: characters.PEASEBLOSSOM, target: characters.BOTTOM, sentiment: 1},

    { source: characters.TITANIA, target: characters.OBERON, sentiment: -1},
    // { source: characters.TITANIA, target: characters.FIRSTFAIRY, sentiment: 1, total: 1 },
    // { source: characters.TITANIA, target: characters.SECONDFAIRY, sentiment: -1, total: -1},
    { source: characters.TITANIA, target: characters.BOTTOM, sentiment: 1},
    { source: characters.TITANIA, target: characters.MOTE, sentiment: 1},
    { source: characters.TITANIA, target: characters.PEASEBLOSSOM, sentiment: 0.5},
    { source: characters.TITANIA, target: characters.COBWEB, sentiment: 1},
    { source: characters.TITANIA, target: characters.MUSTARDSEED, sentiment: 1},

    { source: characters.DEMETRIUS, target: characters.HERMIA,   sentiment: -1},
    { source: characters.DEMETRIUS, target: characters.LYSANDER, sentiment: 1},
    { source: characters.DEMETRIUS, target: characters.HELENA,   sentiment: 1},
    { source: characters.DEMETRIUS, target: characters.THESEUS,  sentiment: 1},
    { source: characters.DEMETRIUS, target: characters.SNUG,     sentiment: 1},

    { source: characters.HIPPOLYTA, target: characters.THESEUS,    sentiment: 1},
    { source: characters.HIPPOLYTA, target: characters.STARVELING, sentiment: 1},

    // { source: characters.SECONDFAIRY, target: characters.TITANIA,  sentiment: 0},
    // { source: characters.SECONDFAIRY, target: characters.FIRSTFAIRY, sentiment: 0},

    { source: characters.QUINCE, target: characters.BOTTOM, sentiment: 1},
    { source: characters.QUINCE, target: characters.FLUTE,  sentiment: 1},
    { source: characters.QUINCE, target: characters.STARVELING, sentiment: 1},
    { source: characters.QUINCE, target: characters.SNOUT,  sentiment: 1},
    { source: characters.QUINCE, target: characters.SNUG, sentiment: 1},
    { source: characters.QUINCE, target: characters.THESEUS, sentiment: -1},
    { source: characters.QUINCE, target: characters.HIPPOLYTA, sentiment: -1 },
    { source: characters.QUINCE, target: characters.LYSANDER, sentiment: -1},
    { source: characters.QUINCE, target: characters.HELENA, sentiment: -1},
    { source: characters.QUINCE, target: characters.HERMIA, sentiment: -1},
    { source: characters.QUINCE, target: characters.DEMETRIUS, sentiment: -1},

    { source: characters.LYSANDER, target: characters.DEMETRIUS, sentiment: -1},
    { source: characters.LYSANDER, target: characters.THESEUS,   sentiment: 1},
    { source: characters.LYSANDER, target: characters.HERMIA,    sentiment: 1 },
    { source: characters.LYSANDER, target: characters.HELENA,    sentiment: 1},
    // { source: characters.LYSANDER, target: characters.STARVELING },

    { source: characters.HELENA, target: characters.HERMIA, sentiment: 1},
    { source: characters.HELENA, target: characters.DEMETRIUS, sentiment: -1},
    { source: characters.HELENA, target: characters.LYSANDER, sentiment: -1},

    { source: characters.PUCK, target: characters.OBERON, sentiment: -1},
    { source: characters.PUCK, target: characters.BOTTOM, sentiment: -1},
    { source: characters.PUCK, target: characters.LYSANDER, sentiment: -1},
    { source: characters.PUCK, target: characters.DEMETRIUS, sentiment: -1},
    { source: characters.PUCK, target: characters.FLUTE, sentiment: -1},
    { source: characters.PUCK, target: characters.QUINCE, sentiment: -1},
    { source: characters.PUCK, target: characters.SNOUT, sentiment: -1},
    { source: characters.PUCK, target: characters.SNUG, sentiment: -1},
    { source: characters.PUCK, target: characters.STARVELING, sentiment: -1},
    { source: characters.PUCK, target: characters.FAIRY, sentiment: 1},
    
    { source: characters.THESEUS, target: characters.HIPPOLYTA, sentiment: 1},
    { source: characters.THESEUS, target: characters.PHILOSTRATE, sentiment: 1},
    { source: characters.THESEUS, target: characters.EGEUS, sentiment: 1},
    { source: characters.THESEUS, target: characters.HERMIA, sentiment: 1},
    { source: characters.THESEUS, target: characters.LYSANDER, sentiment: 1},
    { source: characters.THESEUS, target: characters.DEMETRIUS, sentiment: 1},
    { source: characters.THESEUS, target: characters.HELENA, sentiment: 1},
    { source: characters.THESEUS, target: characters.FLUTE, sentiment: 1},
    { source: characters.THESEUS, target: characters.SNUG, sentiment: 1},
    { source: characters.THESEUS, target: characters.BOTTOM, sentiment: 1},

    { source: characters.COBWEB, target: characters.BOTTOM, sentiment: 1 },
    { source: characters.COBWEB, target: characters.TITANIA, sentiment: 1 },

    { source: characters.EGEUS, target: characters.THESEUS, sentiment: 1 },
    { source: characters.EGEUS, target: characters.LYSANDER, sentiment: 1 },
    { source: characters.EGEUS, target: characters.DEMETRIUS, sentiment: 1 },

    { source: characters.SNOUT, target: characters.QUINCE, sentiment: 1 },
    { source: characters.SNOUT, target: characters.BOTTOM, sentiment: 1},

    { source: characters.OBERON, target: characters.TITANIA, sentiment: 1 },
    { source: characters.OBERON, target: characters.PUCK, sentiment: 1 },
    { source: characters.OBERON, target: characters.DEMETRIUS, sentiment: 1 },
    
    { source: characters.STARVELING, target: characters.BOTTOM, sentiment: 1 },
    { source: characters.STARVELING, target: characters.QUINCE, sentiment: 1},

    { source: characters.FLUTE, target: characters.QUINCE, sentiment: 1 },
    { source: characters.FLUTE, target: characters.SNUG, sentiment: 1 },

    { source: characters.PHILOSTRATE, target: characters.THESEUS, sentiment: 1 },

    { source: characters.MUSTARDSEED, target: characters.TITANIA, sentiment: 1 },
    { source: characters.MUSTARDSEED, target: characters.BOTTOM, sentiment: 1 },

    { source: characters.BOTTOM, target: characters.FLUTE, sentiment: 1 },
    { source: characters.BOTTOM, target: characters.QUINCE, sentiment: 1 },
    { source: characters.BOTTOM, target: characters.SNOUT, sentiment: 1 },
    { source: characters.BOTTOM, target: characters.SNUG, sentiment: 1 },
    { source: characters.BOTTOM, target: characters.STARVELING, sentiment: 1 },
    { source: characters.BOTTOM, target: characters.TITANIA, sentiment: 1 },
    { source: characters.BOTTOM, target: characters.COBWEB, sentiment: 1 },
    { source: characters.BOTTOM, target: characters.MOTE, sentiment: 1 },
    { source: characters.BOTTOM, target: characters.MUSTARDSEED, sentiment: 1 },
    { source: characters.BOTTOM, target: characters.PEASEBLOSSOM, sentiment: 1 },
    { source: characters.BOTTOM, target: characters.THESEUS, sentiment: 1 },
    { source: characters.BOTTOM, target: characters.DEMETRIUS, sentiment: 1 },

    { source: characters.SNUG, target: characters.FLUTE, sentiment: 1 },
    { source: characters.SNUG, target: characters.QUINCE, sentiment: 1 },
    { source: characters.SNUG, target: characters.SNOUT, sentiment: 1 },
    { source: characters.SNUG, target: characters.STARVELING, sentiment: 1 },
    
    { source: characters.FAIRY, target: characters.PUCK, sentiment: 1 }
  ];
