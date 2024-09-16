export type FlashDecoratorDataEntry = {
  id: string;
  name: string;
  fgCol: string;
  bgCol?: string;
  char: string;
  hasSolidBg: boolean;
  description: string;
  help?: {
    show: boolean;
    about: string;
  };
  isOpaque?: boolean;
  isBlockingMovement?: boolean;
  isBlockingProjectiles?: boolean;
  isDiggable?: boolean;
  isCausingSlow?: boolean;
  isCausingBurn?: boolean;
  isMagnetic?: boolean;
  isCausingBleed?: boolean;
  isGlowing?: boolean;
  isCausingPoison?: boolean;
  isCausingConfusion?: boolean;
};
