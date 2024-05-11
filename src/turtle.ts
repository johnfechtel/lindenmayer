import { SymbolMap, Operation } from "./system";
import {
  normalizeVector,
  addVector,
  rotateVector,
  Vector,
} from "./util/geometry";

export function turtle(production: string, symbols: SymbolMap) {
  let position: Vector = { x: 0, y: 0 };
  let direction: Vector = { x: 0, y: 1 };

  let segments: { start: Vector; end: Vector }[] = [];
  let description = "";

  let positions: Vector[] = [];
  let directions: Vector[] = [];

  let min: Vector = { x: Infinity, y: Infinity };
  let max: Vector = { x: -Infinity, y: -Infinity };

  production.split("").forEach((c) => {
    let symbol = symbols.get(c);

    if (symbol !== undefined) {
      if (symbol.command)
        if (symbol.command !== undefined) {
          description += symbol.command.description + ", ";
          switch (symbol.command.operation) {
            case Operation.Forward:
              let transformedPosition = addVector(
                position,
                normalizeVector(direction)
              );
              segments.push({
                start: position,
                end: transformedPosition,
              });
              position = transformedPosition;

              min.x = Math.min(min.x, position.x);
              min.y = Math.min(min.y, position.y);

              max.x = Math.max(max.x, position.x);
              max.y = Math.max(max.y, position.y);
              break;
            case Operation.Turn:
              if (symbol.command.angle !== undefined) {
                direction = rotateVector(direction, symbol.command.angle);
              }
              break;
            case Operation.Push:
              positions.push(position);
              directions.push(direction);
              break;
            case Operation.Pop:
              let popPosition = positions.pop();
              let popDirection = directions.pop();

              position = popPosition === undefined ? position : popPosition;
              direction = popDirection === undefined ? position : popDirection;
              break;
          }
        }
    }
  });

  return { segments: segments, description: description, min: min, max: max };
}
