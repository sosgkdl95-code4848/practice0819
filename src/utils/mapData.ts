import { HexTile } from '../types';

export const INITIAL_HEX_TILES: HexTile[] = (() => {
  const tiles: HexTile[] = [];
  const size = 32; // hex radius size in px
  const centerX = 240;
  const centerY = 240;

  let id = 1;
  const radius = 3;

  // 특정 유명 지형 레이블 지정
  const labelMap: Record<string, { label: string; isOceanSpot?: boolean }> = {
    '0,-3': { label: 'Tempe Terra' },
    '1,-3': { label: 'Vastitas' },
    '2,-3': { label: 'Utopia', isOceanSpot: true },
    '3,-3': { label: 'Arcadia', isOceanSpot: true },

    '-1,-2': { label: 'Olympus Mons' },
    '0,-2': { label: 'Ascraeus Mons' },
    '1,-2': { label: 'Pavonis' },
    '2,-2': { label: 'Lunae Planum', isOceanSpot: true },
    '3,-2': { label: 'Chryse', isOceanSpot: true },

    '-2,-1': { label: 'Tharsis' },
    '-1,-1': { label: 'Noctis City' },
    '0,-1': { label: 'Valles Marineris' },
    '1,-1': { label: 'Ophir' },
    '2,-1': { label: 'Isidis', isOceanSpot: true },
    '3,-1': { label: 'Syrtis', isOceanSpot: true },

    '-3,0': { label: 'Amazonis' },
    '-2,0': { label: 'Syria' },
    '-1,0': { label: 'Sinai' },
    '0,0': { label: 'Solis Planum' },
    '1,0': { label: 'Eos' },
    '2,0': { label: 'Elysium', isOceanSpot: true },
    '3,0': { label: 'Amazonis Pl.', isOceanSpot: true },

    '-3,1': { label: 'Daedalia' },
    '-2,1': { label: 'Claritas' },
    '-1,1': { label: 'Thaumasia' },
    '0,1': { label: 'Aonia Terra' },
    '1,1': { label: 'Hellas Basin', isOceanSpot: true },
    '2,1': { label: 'Hellas Sea', isOceanSpot: true },

    '-3,2': { label: 'Sirenum' },
    '-2,2': { label: 'Cimmeria' },
    '-1,2': { label: 'Argyre', isOceanSpot: true },
    '0,2': { label: 'Argyre Sea', isOceanSpot: true },
    '1,2': { label: 'Malea Planum', isOceanSpot: true },

    '-3,3': { label: 'Promethei' },
    '-2,3': { label: 'Planum Australe' },
    '-1,3': { label: 'South Pole' },
    '0,3': { label: 'Hellas South', isOceanSpot: true },
  };

  for (let r = -radius; r <= radius; r++) {
    const q1 = Math.max(-radius, -r - radius);
    const q2 = Math.min(radius, -r + radius);

    for (let q = q1; q <= q2; q++) {
      const x = centerX + size * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r);
      const y = centerY + size * ((3 / 2) * r);
      const key = `${q},${r}`;
      const info = labelMap[key];

      tiles.push({
        id: id++,
        q,
        r,
        x,
        y,
        type: info?.isOceanSpot ? 'reserved_ocean' : 'empty',
        label: info?.label || `S-${id}`,
      });
    }
  }

  return tiles;
})();
