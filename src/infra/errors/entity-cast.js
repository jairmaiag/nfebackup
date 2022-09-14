export class EntityCastError extends Error {
  constructor(field, actual, expected) {
    super(`Expected ${field} should be an instance of ${expected}. But it is ${actual}`);
  }
}