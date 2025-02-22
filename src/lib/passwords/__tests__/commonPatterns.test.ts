//! src/lib/passwords/__tests__/commonPatterns.test.ts

import { isCommonPassword } from "../commonPatterns";

//! Note: We assume that commonPasswordsData (imported in commonPatterns.ts)
//* contains common passwords like "password", "123456", and "qwerty".

describe("isCommonPassword", () => {
  it("returns true for a known common password (exact match)", () => {
    //* Assuming "password" is in common-passwords.json.
    expect(isCommonPassword("password")).toBe(true);
  });

  it("returns false for a common password in a different case", () => {
    //* No case normalization is applied, so "PassWord" will not match "password".
    expect(isCommonPassword("PassWord")).toBe(false);
  });

  it("returns false for a password that is not common", () => {
    expect(isCommonPassword("UniquePass123!")).toBe(false);
  });

  it("returns false for a password with extra whitespace", () => {
    //* Spaces are not trimmed before lookup.
    expect(isCommonPassword("password ")).toBe(false);
    expect(isCommonPassword(" password")).toBe(false);
  });

  it("returns false for an empty string", () => {
    expect(isCommonPassword("")).toBe(false);
  });

  it("returns false for a password that contains only spaces", () => {
    expect(isCommonPassword("   ")).toBe(false);
  });
});
