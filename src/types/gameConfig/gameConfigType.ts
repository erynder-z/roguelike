export type GameConfigType = {
  SHOW_MENU: boolean;
  scanlines: boolean;
  message_display: 'left' | 'right';
  image_display: 'left' | 'right';
  seed: number;
  player: {
    name: string;
    appearance: 'boyish' | 'girlish';
    color: string;
    avatar: string;
  };
};
