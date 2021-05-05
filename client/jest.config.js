module.exports = {
    preset: "ts-jest",
    testMatch: null,
    testRegex: "(\\.|\\-)test\\.(j|t)sx?$",
    testEnvironment: "jsdom",
    roots: [
        "<rootDir>/src/"
    ],
    setupFiles: [
        "<rootDir>/test/setup-django-i18n.js"
    ],
    testPathIgnorePatterns: [
        ".*responses.ts"
    ],
    moduleFileExtensions: [
        "js",
        "jsx",
        "json",
        "ts",
        "tsx"
    ],
    timers: "fake",
    collectCoverage: true,
    collectCoverageFrom: [
        "src/*.{js,jsx,ts,tsx}",
        "src/**/*.{js,jsx,ts,tsx}"
    ],
    coverageReporters: [
        "text"
    ]
};
