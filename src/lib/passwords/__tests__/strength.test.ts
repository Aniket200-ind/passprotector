import { evaluatePasswordStrength } from "@/lib/passwords/strength";
import { StrengthRating } from "@/lib/passwords/strengthCriteria";

// Note: The evaluatePasswordStrength function combines scores from:
// - checkLength (for password length)
// - calculateEntropy (for character diversity)
// and then applies a common password check that overrides the score.
// Expected values here assume that:
// • checkLength("Abcdefgh") returns 20 (for an 8‑character password)
// • calculateEntropy("Abcdefgh") returns 20 (10 for lowercase, 10 for uppercase)
//   giving a total of 40 → Weak (since 40 is >=30 but <60)
// • checkLength("Abcdef123$") returns 20 (for a 10‑character password)
// • calculateEntropy("Abcdef123$") returns 60 (10 for lowercase, 10 for uppercase, 20 for digit, 20 for special)
//   giving a total of 80 → Strong (since 80 is >=80)
// • For a common password (like "password") the function returns Vulnerable with score 0.

describe("evaluatePasswordStrength", () => {
  it("returns Vulnerable for a very weak common password", () => {
    const result = evaluatePasswordStrength("password");
    // Since "password" is common, regardless of its score, we return Vulnerable with score 0.
    expect(result.score).toBe(0);
    expect(result.rating).toBe(StrengthRating.VULNERABLE);
  });

  it("returns Weak for a minimum-length, low-entropy password", () => {
    // Example: "Abcdefgh" (8 characters)
    // Expected: checkLength returns 20 and calculateEntropy returns 20, so total 40.
    // 40 falls in Weak range (>=30 but <60).
    const result = evaluatePasswordStrength("Abcdefgh");
    expect(result.score).toBe(40);
    expect(result.rating).toBe(StrengthRating.WEAK);
  });

  it("returns Strong for a password with high complexity", () => {
    // Example: "Abcdef123$" (10 characters)
    // Expected: checkLength returns 20;
    // calculateEntropy: lowercase (10) + uppercase (10) + digit (20) + special (20) = 60.
    // Total: 20 + 60 = 80, which meets the STRONG threshold.
    const result = evaluatePasswordStrength("Abcdef123$");
    expect(result.score).toBe(80);
    expect(result.rating).toBe(StrengthRating.STRONG);
  });

  it("returns Strong for a password with spaces that are ignored in entropy", () => {
    // Example: "Abc def1&" (9 characters)
    // Expected: checkLength returns 20 (since length is in the 8-11 range).
    // calculateEntropy ignores spaces. The remaining characters yield:
    //   Lowercase: 10, Uppercase: 10, Digit: 20, Special: 20 => total 60.
    // Combined score: 20 + 60 = 80 → Strong.
    const result = evaluatePasswordStrength("Abc def1&");
    expect(result.score).toBe(80);
    expect(result.rating).toBe(StrengthRating.STRONG);
  });

  it("returns Vulnerable for an input that is empty or only whitespace", () => {
    const resultEmpty = evaluatePasswordStrength("");
    expect(resultEmpty.score).toBe(0);
    expect(resultEmpty.rating).toBe(StrengthRating.VULNERABLE);

    const resultSpaces = evaluatePasswordStrength("    ");
    expect(resultSpaces.score).toBe(0);
    expect(resultSpaces.rating).toBe(StrengthRating.VULNERABLE);
  });

  it("returns Vulnerable for non-string input", () => {
    // Simulate a non-string input (casting a number or null to string)
    // The function should detect this and return Vulnerable with score 0.
    const result = evaluatePasswordStrength(12345 as unknown as string);
    expect(result.score).toBe(0);
    expect(result.rating).toBe(StrengthRating.VULNERABLE);
  });
});
