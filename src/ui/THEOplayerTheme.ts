import type { TextStyle } from 'react-native';

export interface ColorTheme {
  uiBackground: string;
  errorBackground: string;
  icon: string;
  iconSelected: string;
  text: string;
  textSelected: string;
  textSelectedBackground: string;
  seekBarMinimum: string;
  seekBarMaximum: string;
  seekBarDot: string;
}

export interface THEOplayerTheme {
  colors: ColorTheme;
  text: TextStyle;
  fadeAnimationTimoutMs: number;
}

export const DEFAULT_ICON_SIZE = 40;

export const DEFAULT_THEOPLAYER_THEME: THEOplayerTheme = {
  colors: {
    uiBackground: '#00000080',
    errorBackground: '#2C2C2C',
    icon: '#FFFFFF',
    iconSelected: '#FFC50F',
    text: '#FFFFFF',
    textSelected: '#2C2C2C',
    textSelectedBackground: '#FFFFFF',
    seekBarMinimum: '#FFFFFF',
    seekBarMaximum: '#FFFFFF50',
    seekBarDot: '#FFFFFF',
  },
  text: {
    textAlignVertical: 'center',
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 16,
  },
  fadeAnimationTimoutMs: 2500,
};
