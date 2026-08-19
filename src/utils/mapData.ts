import { HexTile } from '../types';

export const INITIAL_HEX_TILES: HexTile[] = (() => {
  const tiles: HexTile[] = [];
  const size = 23;
  const centerX = 270;
  const centerY = 270;
  const horizontalSpacing = Math.sqrt(3) * size; // ~39.837px
  const verticalSpacing = 1.5 * size; // 34.5px

  let id = 1;

  // 9개 예약된 해수면(Ocean) 지정 구역 (row, colIndex)
  // row: -5 to 5, colIndex: 0 to (11 - |row| - 1)
  const oceanCoordKeys = new Set([
    '-4,5', '-4,6', // 위쪽 북부 평원 해수면
    '-2,7', '-2,8', // 중상부
    '0,9', '0,10',  // 적도 동부
    '2,7', '2,8',   // 헬라스 해
    '4,5'           // 아르기레 해
  ]);

  // 각 줄(Row) 정의: r = -5부터 +5까지 총 11줄
  // 줄별 타일 수: 6, 7, 8, 9, 10, 11 (가운데), 10, 9, 8, 7, 6 -> 총 91칸
  for (let r = -5; r <= 5; r++) {
    const numTilesInRow = 11 - Math.abs(r);
    const y = centerY + r * verticalSpacing;

    for (let col = 0; col < numTilesInRow; col++) {
      // x좌표: 행의 중앙을 centerX에 정렬
      const x = centerX + (col - (numTilesInRow - 1) / 2) * horizontalSpacing;
      const key = `${r},${col}`;
      const isOcean = oceanCoordKeys.has(key);

      let label = `M-${id}`;
      // 주요 지형 명칭 지정
      if (r === -5 && col === 2) label = 'North Pole';
      if (r === -3 && col === 1) label = 'Olympus Mons';
      if (r === -3 && col === 2) label = 'Ascraeus Mons';
      if (r === -2 && col === 1) label = 'Pavonis Mons';
      if (r === -2 && col === 2) label = 'Tharsis Rise';
      if (r === -1 && col === 1) label = 'Arsia Mons';
      if (r === -1 && col === 2) label = 'Noctis City';
      if (r === 0 && col === 0) label = 'Amazonis';
      if (r === 0 && col === 1) label = 'Syria Planum';
      if (r === 0 && col === 2) label = 'Sinai Planum';
      if (r === 0 && col === 3) label = 'Solis Planum';
      if (r === 0 && col === 4) label = 'Valles Marineris';
      if (r === 0 && col === 5) label = 'Eos Chasma';
      if (r === 1 && col === 5) label = 'Hellas Basin';
      if (r === 2 && col === 2) label = 'Argyre Planitia';
      if (r === 5 && col === 3) label = 'South Pole';

      tiles.push({
        id: id++,
        q: col,
        r,
        x,
        y,
        type: isOcean ? 'reserved_ocean' : 'empty',
        label: isOcean ? '해수면' : label,
      });
    }
  }

  return tiles;
})();
