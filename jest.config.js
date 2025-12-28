module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    roots: ['<rootDir>/test'],
    testMatch: ['**/__tests__/**/*.test.(ts|tsx)', '**/?(*.)+(spec|test).(ts|tsx)'],
    setupFilesAfterEnv: ['<rootDir>/test/test-setup.ts'],
    collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
    coverageProvider: 'babel',
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    transform: {
        '^.+\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: {
                    sourceMap: true,
                    inlineSources: true,
                },
            },
        ],
    },
    transformIgnorePatterns: ['node_modules/(?!(your-library-if-needed)/)'],
};
