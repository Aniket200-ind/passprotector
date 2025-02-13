import { calculateEntropy } from "@/lib/passwords/entropyCheck";

describe("calculateEntropy", () => {
  it("returns 0 for an empty password", () => {
    expect(calculateEntropy("")).toBe(0);
  });

  it("returns 10 for a password with only lowercase letters", () => {
    // Only lowercase letters should contribute a single bonus of 10.
    expect(calculateEntropy("abc")).toBe(10);
  });

  it("returns 10 for a password with only uppercase letters", () => {
    // Only uppercase letters should contribute a single bonus of 10.
    expect(calculateEntropy("XYZ")).toBe(10);
  });

  it("returns 20 for a password with only digits", () => {
    // Only digits should contribute 20.
    expect(calculateEntropy("123")).toBe(20);
  });

  it("returns 20 for a password with only special characters (excluding spaces)", () => {
    // Only special characters (that are not spaces) contribute 20.
    expect(calculateEntropy("!@#$")).toBe(20);
  });

  it("returns 0 for a password containing only whitespace", () => {
    // Spaces are not counted by any condition.
    expect(calculateEntropy("   ")).toBe(0);
  });

  it("returns cumulative score for a password with mixed character types", () => {
    // "aA" should score 10 (lowercase) + 10 (uppercase) = 20.
    expect(calculateEntropy("aA")).toBe(20);

    // "aA1" should score 10 (lowercase) + 10 (uppercase) + 20 (digit) = 40.
    expect(calculateEntropy("aA1")).toBe(40);

    // "aA1!" should score 10 + 10 + 20 + 20 (special) = 60.
    expect(calculateEntropy("aA1!")).toBe(60);
  });

  it("ignores spaces when calculating entropy", () => {
    // Spaces should not contribute to any bonus.
    // "a !" should still score 10 (for lowercase) + 20 (special for '!') = 30.
    expect(calculateEntropy("a !")).toBe(30);
  });

  it("returns the expected score for a realistic complex password", () => {
    // For "Pass123!" we expect:
    // Lowercase present: 10, Uppercase present: 10, Digits present: 20, Special present: 20.
    // Total score: 10 + 10 + 20 + 20 = 60.
    expect(calculateEntropy("Pass123!")).toBe(60);
  });

  it("does not add extra score for repeating characters in the same category", () => {
    // Repeating lowercase letters still count only once.
    expect(calculateEntropy("aaaaaaaaaa")).toBe(10);
  });
});
