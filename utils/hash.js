const crypto = require('crypto');

class HashUtility {
    /**
     * Hashes the given data using the specified algorithm (default: SHA-256).
     * @param {string} data - The data to hash.
     * @param {string} algorithm - The hashing algorithm to use (default: 'sha256').
     * @returns {string} - The hashed output in hexadecimal format.
     */
    static hash(data, algorithm = 'sha256') {
        if (typeof data !== 'string') {
            throw new Error('Data to hash must be a string.');
        }

        return crypto.createHash(algorithm).update(data).digest('hex');
    }

    /**
     * Compares a given string to a hash to verify if they match.
     * @param {string} data - The original data string.
     * @param {string} hash - The hash to compare against.
     * @param {string} algorithm - The hashing algorithm used (default: 'sha256').
     * @returns {boolean} - True if the data matches the hash, false otherwise.
     */
    static verify(data, hash, algorithm = 'sha256') {
        const hashedData = HashUtility.hash(data, algorithm);
        return hashedData === hash;
    }
}

module.exports = HashUtility;
