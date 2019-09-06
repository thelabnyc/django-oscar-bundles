module.exports = {
    preset: "ts-jest",
    testMatch: null,
    testRegex: "(\\.|\\-)test\\.(j|t)sx?$",
    roots: [
        "<rootDir>/src/"
    ],
    setupFiles: [
        "<rootDir>/test/setup-django-i18n.js"
    ],
    setupFilesAfterEnv: [
        "<rootDir>/test/setup.ts"
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
    snapshotSerializers: [
        "enzyme-to-json/serializer"
    ],
    timers: "fake",
    collectCoverage: true,
    collectCoverageFrom: [
        "src/*.{js,jsx,ts,tsx}",
        "src/**/*.{js,jsx,ts,tsx}"
    ],
    coverageReporters: [
        // "html",
        "text"
    ]
};
