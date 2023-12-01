import { isPlainObject, merge } from "@player/util/utils";

describe("utils", () => {
  describe("isPlainObject", () => {
    it("return true for plain objects", () => {
      expect(isPlainObject({})).toBe(true);
      expect(isPlainObject({ prop: 1 })).toBe(true);
      expect(isPlainObject(new Object())).toBe(true);
      expect(isPlainObject(Object.create(null))).toBe(true);
    });
    it("return false for non-plain objects", () => {
      // non-object types
      expect(isPlainObject(1)).toBe(false);
      expect(isPlainObject("string")).toBe(false);
      expect(isPlainObject(false)).toBe(false);
      expect(isPlainObject(undefined)).toBe(false);
      expect(isPlainObject(null)).toBe(false);
      // built-in types
      expect(isPlainObject([])).toBe(false);
      expect(isPlainObject(new Date())).toBe(false);
      expect(isPlainObject(/regex/)).toBe(false);
      expect(isPlainObject(function () {})).toBe(false);
      expect(isPlainObject(Symbol.for("symbol"))).toBe(false);
      // objects with a constructor
      class MyConstructor {}
      expect(isPlainObject(new MyConstructor())).toBe(false);
      // objects with a prototype chain
      expect(isPlainObject(Object.create(Object.create({})))).toBe(false);
    });
  });

  describe("merge", () => {
    it("should merge flat object properties", () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { b: 3, c: 4 };
      const expectedResult = { a: 1, b: 3, c: 4 };
      
      expect(merge(obj1, obj2)).toEqual(expectedResult);
    });

    it("should handle nested object properties", () => {
      const obj1 = { a: { x: 1 }, b: 2 };
      const obj2 = { a: { y: 2 }, c: 3 };
      const expectedResult = { a: { x: 1, y: 2 }, b: 2, c: 3 };

      expect(merge(obj1, obj2)).toEqual(expectedResult);
    });

    it("should overwrite arrays, not merge them", () => {
      const obj1 = { a: [1, 2], b: 2 };
      const obj2 = { a: [3, 4], c: 3 };
      const expectedResult = { a: [3, 4], b: 2, c: 3 };

      expect(merge(obj1, obj2)).toEqual(expectedResult);
    });

    it("should correctly handle undefined and null values", () => {
      const obj1 = { a: undefined, b: null };
      const obj2 = { a: 1, b: 2 };
      const expectedResult = { a: 1, b: 2 };

      expect(merge(obj1, obj2)).toEqual(expectedResult);
    });

    it("should handle empty objects", () => {
      const obj1 = {};
      const obj2 = { a: 1 };
      const expectedResult = { a: 1 };
      expect(merge(obj1, obj2)).toEqual(expectedResult);

      const obj3 = { a: 1 };
      const obj4 = {};

      expect(merge(obj3, obj4)).toEqual({ a: 1 });
    });

    it("should not modify the original objects", () => {
      const obj1 = { a: 1 };
      const obj2 = { b: 2 };

      merge(obj1, obj2);

      expect(obj1).toEqual({ a: 1 });
      expect(obj2).toEqual({ b: 2 });
    });
  });
});
