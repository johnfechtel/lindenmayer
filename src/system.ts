export type Rule = {
  input: string;
  output: string;
};

export type Alphabet = {
  variables: string[];
  constants: string[];
};

export enum Operation {
  Forward,
  Turn,
  Push,
  Pop,
}

export type LSymbol = {
  key: string;
  command?: Command;
};

export type SymbolMap = Map<string, LSymbol>;

export type Command = {
  description: string;
  operation: Operation;
  angle?: number;
};

export function contains(a: Alphabet, char: string) {
  return isVariable(a, char) || isConstant(a, char);
}

export function isVariable(a: Alphabet, char: string) {
  return a.variables.find((c) => c === char);
}

export function isConstant(a: Alphabet, char: string) {
  a.constants.find((c) => c === char);
}
