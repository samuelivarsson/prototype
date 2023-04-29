import { mergeObjectsWithSameId, parseStringToObject } from "./ResponseParser";

describe("ResponseParser", () => {
    describe("parseStringToObject", () => {
        it("creates corresponding object", () => {
            const tests = [
                '{"requirementID": "RQ5", "tests": ""}',
                '{"requirementID": "RQ4", "tests": ""}',
                '{"requirementID": "RQ3", "tests": ""}',
                '{"requirementID": "RQ3", "tests": "TC_06"}',
                '{"requirementID": "RQ2", "tests": "TC_02"}',
                '{"requirementID": "RQ2", "tests": "TC_04"}',
                '{"requirementID": "RQ1", "tests": "TC_01, TC_02"}',
            ];

            expect(parseStringToObject(tests[0])).toEqual({
                requirementID: "RQ5",
                tests: "",
            });
            expect(parseStringToObject(tests[1])).toEqual({
                requirementID: "RQ4",
                tests: "",
            });
            expect(parseStringToObject(tests[2])).toEqual({
                requirementID: "RQ3",
                tests: "",
            });
            expect(parseStringToObject(tests[3])).toEqual({
                requirementID: "RQ3",
                tests: "TC_06",
            });
            expect(parseStringToObject(tests[4])).toEqual({
                requirementID: "RQ2",
                tests: "TC_02",
            });
            expect(parseStringToObject(tests[5])).toEqual({
                requirementID: "RQ2",
                tests: "TC_04",
            });
            expect(parseStringToObject(tests[6])).toEqual({
                requirementID: "RQ1",
                tests: "TC_01, TC_02",
            });
        });
    });

    describe("mergeObjectsWithSameId", () => {
        it("should return merged array with no duplicate IDs and no missing test cases", () => {
            const tests = [
                { requirementID: "RQ5", tests: "" },
                { requirementID: "RQ5", tests: "" },
                { requirementID: "RQ4", tests: "" },
                { requirementID: "RQ4", tests: "" },
                { requirementID: "RQ3", tests: "" },
                { requirementID: "RQ3", tests: "TC_06" },
                { requirementID: "RQ2", tests: "TC_02" },
                { requirementID: "RQ2", tests: "TC_04" },
                { requirementID: "RQ1", tests: "TC_01, TC_02" },
                {
                    requirementID: "RQ1",
                    tests: "{'ID': 'TC_04', 'desc': 'Test MD5', 'steps': '1. Enter Numeric Key\\n2. Submit'}, {'ID': 'TC_05', 'desc': 'Test Columner Cipher', 'steps': '1. Enter Plain text\\n2. Enter Numeric Key\\n3. Submit'}",
                },
            ];

            expect(mergeObjectsWithSameId(tests)).toEqual([
                { requirementID: "RQ5", tests: "" },
                { requirementID: "RQ4", tests: "" },
                { requirementID: "RQ3", tests: "TC_06" },
                { requirementID: "RQ2", tests: "TC_02, TC_04" },
                {
                    requirementID: "RQ1",
                    tests: "TC_01, TC_02, {'ID': 'TC_04', 'desc': 'Test MD5', 'steps': '1. Enter Numeric Key\\n2. Submit'}, {'ID': 'TC_05', 'desc': 'Test Columner Cipher', 'steps': '1. Enter Plain text\\n2. Enter Numeric Key\\n3. Submit'}",
                },
            ]);
        });
    });
});
