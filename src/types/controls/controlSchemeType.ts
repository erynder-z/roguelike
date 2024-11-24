import controls from '../../controls/control_schemes.json';
export type ControlSchemeName = keyof typeof controls;

export type ControlSchemeType = {
  [action: string]: string[];
};
