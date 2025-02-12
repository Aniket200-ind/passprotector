import { checkForCommonPasswords } from "../commonPatterns";

// Note: We assume that commonPasswordsData (imported in commonPatterns.ts)
// contains common passwords like "password", "123456", and "qwerty".

describe("checkForCommonPasswords", () => {
  it("returns -50 for a known common password (all lowercase)", () => {
    expect(checkForCommonPasswords("password")).toBe(-50);
  });

  it("returns -50 for a known common password (mixed case)", () => {
    // Function should be case-insensitive.
    expect(checkForCommonPasswords("PassWord")).toBe(-50);
  });

  it("returns 0 for a password not in the common list", () => {
    expect(checkForCommonPasswords("UniquePass123!")).toBe(0);
  });

  it("returns 0 for a password that is similar but not identical due to extra whitespace", () => {
    // Spaces are not trimmed; thus 'password ' or ' password' are not exact matches.
    expect(checkForCommonPasswords("password ")).toBe(0);
    expect(checkForCommonPasswords(" password")).toBe(0);
  });

  it("returns 0 for a variant with slight character modifications", () => {
    // e.g. replacing o with 0 (zero) makes it different.
    expect(checkForCommonPasswords("p4ssw0rd")).toBe(0);
  });

  it("returns 0 for an empty string", () => {
    expect(checkForCommonPasswords("")).toBe(0);
  });
});