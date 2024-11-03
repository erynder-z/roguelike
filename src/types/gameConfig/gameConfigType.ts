import { ScanlineStyles } from '../../renderer/scanlinesHandler';

export type GameConfigType = {
  SHOW_MENU: boolean;
  show_scanlines: boolean;
  scanline_style: ScanlineStyles;
  show_images: boolean;
  message_display: 'left' | 'right';
  message_count: number;
  image_display: 'left' | 'right';
  seed: number;
  player: {
    name: string;
    appearance: 'boyish' | 'girlish';
    color: string;
    avatar: string;
  };
};
