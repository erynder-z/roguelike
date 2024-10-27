export type GameConfigType = {
  SHOW_MENU: boolean;
  show_scanlines: boolean;
  show_images: boolean;
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
