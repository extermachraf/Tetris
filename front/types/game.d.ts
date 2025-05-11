export enum Shape {
  I = "I",
  O = "O",
  T = "T",
  S = "S",
  Z = "Z",
  J = "J",
  L = "L",
}

export interface Movement {
  isMoved: boolean;
  direction: "left" | "right" | "down";
}

export interface Rotation {
  isRotated: boolean;
  degree: 0 | 90 | 180 | 270;
}

export interface Position {
  x: number;
  y: number;
}

export interface Piece {
  piece_shape: Shape;
  position: Position;
  matrix: number[][];
  movement: Movement;
  rotation: Rotation;
}
