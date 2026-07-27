import { describe, it, expect } from 'vitest';
import { generateStudentUid, generateRegistrationNumber } from '../utils/studentIdGenerator';

describe('Student Identification Generator Suite', () => {
  it('generates an immutable Base36 Lifetime Student UID with correct BMI prefix', () => {
    const uid1 = generateStudentUid(101);
    const uid2 = generateStudentUid(102);

    expect(uid1).toMatch(/^BMI/);
    expect(uid2).toMatch(/^BMI/);
    expect(uid1).not.toEqual(uid2);
  });

  it('generates career-scoped Primary Registration Numbers accurately', () => {
    const regNo = generateRegistrationNumber({
      career: 'UG',
      programCode: 'CS',
      year: 2026,
      serial: 1
    });

    expect(regNo).toBe('BMI/UG-CS/226/001');
  });

  it('formats sequential numbers with padded zeros correctly', () => {
    const regNo = generateRegistrationNumber({
      career: 'PG',
      programCode: 'DS',
      year: 2026,
      serial: 42
    });

    expect(regNo).toBe('BMI/PG-DS/226/042');
  });
});
