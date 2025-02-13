import { checkLength } from "@/lib/passwords/lengthCheck";

describe("checkLength", () => {
  it("returns 0 for an empty string", () => {
    expect(checkLength("")).toBe(0);
  });

  it("returns 0 when password length is less than 6", () => {
    expect(checkLength("123")).toBe(0);
    expect(checkLength("12345")).toBe(0);
  });

  it("returns 10 for a password with length exactly 6", () => {
    expect(checkLength("123456")).toBe(10);
  });

  it("returns 10 for a password with length 7", () => {
    expect(checkLength("1234567")).toBe(10);
  });

  it("returns 20 for a password with length exactly 8", () => {
    expect(checkLength("12345678")).toBe(20);
  });

  it("returns 20 for a password with length between 8 and 11", () => {
    expect(checkLength("123456789")).toBe(20);
    expect(checkLength("12345678901")).toBe(20);
  });

  it("returns 30 for a password with length exactly 12", () => {
    expect(checkLength("123456789012")).toBe(30);
  });

  it("returns 30 for a password with length greater than 12", () => {
    expect(checkLength("123456789012345")).toBe(30);
  });

  it("treats whitespace as characters", () => {
    // A string of 6 spaces should score 10 (since length is 6)
    expect(checkLength("      ")).toBe(10);
  });

  it("returns 0 when an error occurs (e.g., non-string input)", () => {
    // Force a type error by casting a non-string value.
    const faultyInput: unknown = null;
    expect(checkLength(faultyInput as string)).toBe(0);
  });
});
