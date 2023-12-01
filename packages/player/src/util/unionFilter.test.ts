import { FilteredByType, typeFilter, typeFind } from "@player/util/unionFilter";

describe("unionFilter", () => {
  describe("by type", () => {
    type TestType = { a: string } & ({ type: "type1" } | { type: "type2" } | { type: "type3" });
    const data: TestType[] = [
      { a: "a11", type: "type1" },
      { a: "a21", type: "type2" },
      { a: "a12", type: "type1" },
      { a: "a22", type: "type2" },
    ];

    describe("typeFilter", () => {
      it('should filter 2 items of "type1"', () => {
        const expectedResult: FilteredByType<TestType, "type1">[] = [
          { a: "a11", type: "type1" },
          { a: "a12", type: "type1" },
        ];

        expect(typeFilter(data, "type1")).toEqual(expectedResult);
      });

      it('should filter 4 items of "type1" and "type2"', () => {
        const expectedResult: FilteredByType<TestType, "type1" | "type2">[] = [
          { a: "a11", type: "type1" },
          { a: "a21", type: "type2" },
          { a: "a12", type: "type1" },
          { a: "a22", type: "type2" },
        ];

        expect(typeFilter(data, "type1", "type2")).toEqual(expectedResult);
      });

      it('should filter 0 items of "type3"', () => {
        const expectedResult: FilteredByType<TestType, "type3">[] = [];

        expect(typeFilter(data, "type3")).toEqual(expectedResult);
      });

      it('should throw type error when trying to use inexisting type "type-no"', () => {
        // test type
        // @ts-expect-error
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const expectedResult: FilteredByType<TestType, "type-no"> = data[0];
      });
    });

    describe("typeFind", () => {
      it('should find 1 item of "type1"', () => {
        const expectedResult: FilteredByType<TestType, "type1"> = { a: "a11", type: "type1" };

        expect(typeFind(data, "type1")).toEqual(expectedResult);
      });

      it('should find 0 items of "type3" and return "undefined"', () => {
        expect(typeFind(data, "type3")).toEqual(undefined);
      });
    });
  });
});
