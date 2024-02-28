export type SwipeDirection = 'left' | 'right'

export const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};
