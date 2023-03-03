export class TypeGuardsHelper {
  static isUndefined(value: unknown): value is undefined {
    return typeof value === 'undefined';
  }

  static isNull(value: unknown): value is null {
    return value === null;
  }

  static isEmpty(value: unknown): value is null | undefined {
    return value == null;
  }

  static isBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean';
  }

  static isNumber(value: unknown): value is number {
    return typeof value === 'number';
  }

  static isString(value: unknown): value is string {
    return typeof value === 'string';
  }

  static isObject(value: unknown): value is Object {
    return value !== null && typeof value === 'object';
  }



}
