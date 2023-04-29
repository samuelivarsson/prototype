import { getTestCasesString } from "./Prompt";

describe("Prompt", () => {
    describe("getTestCasesString", () => {
        it("creates correct string", () => {
            const tests = [
                {
                    ID: "TC_01",
                    desc: "Test Caesar Cipher algorithm (For Encryption)",
                    steps: "1. Select Encrypt Button\n2. Enter Plain text\n3. Enter Numeric Key\n4. Submit",
                },
                {
                    ID: "TC_02",
                    desc: "Test Caesar Cipher algorithm (For Decryption)",
                    steps: "1. Select Decrupt Button\n2. Enter Cipher Text\n3. Enter Numeric Key\n4. Submit",
                },
                {
                    ID: "TC_03",
                    desc: "Test Vignere Cipher",
                    steps: "1. Enter Plain text\n2. Enter Numeric Key\n3. Submit",
                },
                { ID: "TC_04", desc: "Test MD5", steps: "1. Enter Numeric Key\n2. Submit" },
                {
                    ID: "TC_05",
                    desc: "Test Columner Cipher",
                    steps: "1. Enter Plain text\n2. Enter Numeric Key\n3. Submit",
                },
            ];

            expect(getTestCasesString(tests)).toEqual(
                '{"ID":"TC_01","desc":"Test Caesar Cipher algorithm (For Encryption)","steps":"1. Select Encrypt Button\\n2. Enter Plain text\\n3. Enter Numeric Key\\n4. Submit"}\n\n{"ID":"TC_02","desc":"Test Caesar Cipher algorithm (For Decryption)","steps":"1. Select Decrupt Button\\n2. Enter Cipher Text\\n3. Enter Numeric Key\\n4. Submit"}\n\n{"ID":"TC_03","desc":"Test Vignere Cipher","steps":"1. Enter Plain text\\n2. Enter Numeric Key\\n3. Submit"}\n\n{"ID":"TC_04","desc":"Test MD5","steps":"1. Enter Numeric Key\\n2. Submit"}\n\n{"ID":"TC_05","desc":"Test Columner Cipher","steps":"1. Enter Plain text\\n2. Enter Numeric Key\\n3. Submit"}'
            );
        });
    });
});
