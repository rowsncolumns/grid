export enum KeyCodes {
  Right = 39,
  Left = 37,
  Up = 38,
  Down = 40,
  Escape = 27,
  Tab = 9,
  Meta = 91,
  Delete = 46,
  BackSpace = 8,
  Enter = 13,
  A = 65,
  SPACE = 32,
  ALT = 18,
  C = 67,
  Home = 36,
  End = 35,
  PageDown = 34,
  PageUp = 33,
  Z = 90,
  CapsLock = 20,
  KEY_B = 66,
  KEY_I = 73,
  KEY_U = 85,
  KEY_X = 88,
  KEY_L = 76,
  KEY_E = 69,
  KEY_R = 82,
  BACK_SLASH = 220,
  KEY_Y = 89,
  ScrollLock = 145,
  NumLock = 144,
  Pause = 19,
  Insert = 45,
  F1 = 112,
  F2 = 113,
  F3 = 114,
  F4 = 115,
  F5 = 116,
  F6 = 117,
  F7 = 118,
  F8 = 119,
  F9 = 120,
  F10 = 121,
  F11 = 122,
  F12 = 123,
}

export enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}

export enum MimeType {
  html = "text/html",
  csv = "text/csv",
  plain = "text/plain",
  json = "application/json",
}

export enum MouseButtonCodes {
  "left" = 1,
  "middle" = 2,
  "right" = 3,
}

export type SelectionPolicy = "single" | "range" | "multiple";
