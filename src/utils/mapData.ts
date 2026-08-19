import { HexTile } from '../types';

export const INITIAL_HEX_TILES: HexTile[] = (() => {
  const tiles: HexTile[] = [];
  const size = 23; // 가운데 11개가 화성 구체 안에 조화롭게 들어가도록 최적화된 크기
  const centerX = 270;
  const centerY = 270;

  let id = 1;
  const radius = 5; // 반지름 5 -> 가운데 줄(r=0)이 정확히 11칸 (총 91칸)

  // 9개 주요 해수면(Ocean) 지정 구역 좌표
  const oceanSpots = new Set([
    '2,-4', '3,-4',
    '3,-2', '4,-2',
    '2,0', '3,0',
    '1,2', '2,2',
    '-1,3'
  ]);

  // 주요 유명 화성 지형 레이블 매핑
  const famousLocations: Record<string, string> = {
    '0,-5': 'North Pole',
    '0,-4': 'Tempe Terra',
    '1,-4': 'Utopia Planitia',
    '-1,-3': 'Olympus Mons',
    '0,-3': 'Ascraeus Mons',
    '1,-3': 'Chryse Planitia',
    '-2,-2': 'Pavonis Mons',
    '-1,-2': 'Tharsis Rise',
    '0,-2': 'Lunae Planum',
    '-3,-1': 'Arsia Mons',
    '-2,-1': 'Noctis Labyrinthus',
    '-1,-1': 'Noctis City',
    '0,-1': 'Valles Marineris',
    '1,-1': 'Ophir Chasma',
    '-5,0': 'Amazonis West',
    '-4,0': 'Amazonis Planitia',
    '-3,0': 'Tharsis West',
    '-2,0': 'Syria Planum',
    '-1,0': 'Sinai Planum',
    '0,0': 'Solis Planum',
    '1,0': 'Eos Chasma',
    '2,0': 'Elysium Sea',
    '3,0': 'Isidis Basin',
    '4,0': 'Syrtis Major',
    '5,0': 'Terra Sabaea',
    '-3,1': 'Claritas Fossae',
    '-1,1': 'Thaumasia',
    '0,1': 'Aonia Terra',
    '1,1': 'Hellas Basin',
    '2,1': 'Hellas Sea',
    '-2,2': 'Argyre Planitia',
    '0,2': 'Malea Planum',
    '1,2': 'Hellas Deep',
    '-1,3': 'Argyre Sea',
    '0,3': 'Promethei Terra',
    '0,4': 'Planum Australe',
    '0,5': 'South Pole',
  };

  for (let r = -radius; r <= radius; r++) {
    const q1 = Math.max(-radius, -r - radius);
    const q2 = Math.min(radius, -r + radius);

    for (let q = q1; q <= q2; q++) {
      const x = centerX + size * (Math.sqrt(3) * q + (Math.sqrt(3) / 2) * r);
      const y = centerY + size * ((3 / 2) * r);
      const key = `${q},${r}`;
      const isOcean = oceanSpots.has(key);
      const label = famousLocations[key] || (isOcean ? '해수면 구역' : `섹터 ${id}`);

      tiles.push({
        id: id++,
        q,
        r,
        x,
        y,
        type: isOcean ? 'reserved_ocean' : 'empty',
        label,
      });
    }
  }

  return tiles;
})();
