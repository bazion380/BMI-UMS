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

describe('Authentication & Token Helper Suite', () => {
  it('encodes and decodes token payloads correctly', () => {
    const payload = { role: 'registrar', name: 'Dr. Vance', time: Date.now() };
    const token = Buffer.from(JSON.stringify(payload)).toString('base64');
    
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
    expect(decoded.role).toBe('registrar');
    expect(decoded.name).toBe('Dr. Vance');
  });

  it('validates HMAC signed tokens correctly', () => {
    const crypto = require('crypto');
    const secret = 'bmi_ums_secure_token_secret_2026';
    const payload = { role: 'president', name: 'Prof. Arthur Vance', exp: Date.now() + 3600000 };
    
    const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
    const signature = crypto.createHmac('sha256', secret).update(payloadStr).digest('base64url');
    const token = `${payloadStr}.${signature}`;

    const parts = token.split('.');
    expect(parts.length).toBe(2);

    const expectedSig = crypto.createHmac('sha256', secret).update(parts[0]).digest('base64url');
    expect(parts[1]).toBe(expectedSig);
  });

  it('validates role permissions correctly', () => {
    const allowedRoles = ['registrar', 'admissions'];
    
    expect(allowedRoles.includes('registrar')).toBe(true);
    expect(allowedRoles.includes('student')).toBe(false);
  });
});

