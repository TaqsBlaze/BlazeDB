const HashUtility = require('../utils/hash');

describe('HashUtility', () => {
    const sampleData = 'securepassword123';
    const invalidData = 'wrongpassword';

    test('hash should return a valid hash string', () => {
        const hash = HashUtility.hash(sampleData);

        expect(typeof hash).toBe('string');
        expect(hash.length).toBeGreaterThan(0); // SHA-256 hash should have a non-zero length
    });

    test('hash should produce consistent results for the same input', () => {
        const hash1 = HashUtility.hash(sampleData);
        const hash2 = HashUtility.hash(sampleData);

        expect(hash1).toBe(hash2); // Hashes should match for the same input
    });

    test('hash should produce different results for different inputs', () => {
        const hash1 = HashUtility.hash(sampleData);
        const hash2 = HashUtility.hash(invalidData);

        expect(hash1).not.toBe(hash2); // Hashes should differ for different inputs
    });

    test('verify should return true for matching data and hash', () => {
        const hash = HashUtility.hash(sampleData);
        const isMatch = HashUtility.verify(sampleData, hash);

        expect(isMatch).toBe(true);
    });

    test('verify should return false for non-matching data and hash', () => {
        const hash = HashUtility.hash(sampleData);
        const isMatch = HashUtility.verify(invalidData, hash);

        expect(isMatch).toBe(false);
    });

    test('hash should throw an error if data is not a string', () => {
        expect(() => HashUtility.hash(12345)).toThrow('Data to hash must be a string.');
    });

    test('verify should handle different algorithms correctly', () => {
        const hashSha256 = HashUtility.hash(sampleData, 'sha256');
        const hashSha512 = HashUtility.hash(sampleData, 'sha512');

        expect(HashUtility.verify(sampleData, hashSha256, 'sha256')).toBe(true);
        expect(HashUtility.verify(sampleData, hashSha512, 'sha512')).toBe(true);

        // Ensure mismatched algorithms return false
        expect(HashUtility.verify(sampleData, hashSha256, 'sha512')).toBe(false);
    });

    test('verify should return false for empty strings', () => {
        const emptyHash = HashUtility.hash('');
        const isMatch = HashUtility.verify('', emptyHash);

        expect(isMatch).toBe(true);

        const isMismatch = HashUtility.verify(sampleData, emptyHash);
        expect(isMismatch).toBe(false);
    });
});
