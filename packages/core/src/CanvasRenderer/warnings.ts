import { UniformValue } from "../types/UniformValue";

export function warnUnknownName (name: string) {
  console.warn(`Couldn't set uniform. The uniform ${name} does not exist`);
}

export function warnUnknownType (name: string) {
  console.warn(`Couldn't set uniform. The type for ${name} could not be determined`);
}

export function warnNumeric (name: string, value: UniformValue) {
  console.warn(`Couldn't set uniform. "${value}" is not a valid numeric value for ${name}`);
}

export function warnF32List (name: string, value: UniformValue) {
  console.warn(`Couldn't set uniform. "${value}" is not a valid Float32List for ${name}`);
}

export function warnI32List (name: string, value: UniformValue) {
  console.warn(`Couldn't set uniform. "${value}" is not a valid Int32List for ${name}`);
}