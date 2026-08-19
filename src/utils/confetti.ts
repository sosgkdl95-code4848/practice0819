import confetti from 'canvas-confetti';

/**
 * 특정 단일 파라미터가 100%에 도달했을 때의 축하 폭죽 효과
 */
export const triggerParameterConfetti = (colorType: 'temperature' | 'oxygen' | 'ocean') => {
  const colorsMap = {
    temperature: ['#E53E3E', '#DD6B20', '#ECC94B', '#FF7849'],
    oxygen: ['#10B981', '#48BB78', '#6EE7B7', '#00B5D8'],
    ocean: ['#00B5D8', '#3182CE', '#63B3ED', '#EBF8FF'],
  };

  const colors = colorsMap[colorType] || ['#E53E3E', '#00B5D8', '#10B981', '#ECC94B'];

  // 1차 폭죽
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors,
    zIndex: 9999,
  });

  // 2차 폭죽 (약간의 딜레이)
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
      zIndex: 9999,
    });
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
      zIndex: 9999,
    });
  }, 250);
};

/**
 * 3개 파라미터가 모두 100% 달성되어 화성이 거주 가능해졌을 때의 그랜드 세레머니 폭죽
 */
export const triggerGrandVictoryConfetti = () => {
  const duration = 5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 99999 };

  const interval: ReturnType<typeof setInterval> = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    // 양쪽에서 쏟아지는 스타 폭죽
    confetti({
      ...defaults,
      particleCount,
      origin: { x: Math.random() * 0.4, y: Math.random() - 0.2 },
      colors: ['#E53E3E', '#DD6B20', '#ECC94B', '#00B5D8', '#10B981', '#805AD5'],
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: 0.6 + Math.random() * 0.4, y: Math.random() - 0.2 },
      colors: ['#E53E3E', '#DD6B20', '#ECC94B', '#00B5D8', '#10B981', '#805AD5'],
    });
  }, 300);
};
