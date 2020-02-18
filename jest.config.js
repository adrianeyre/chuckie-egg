module.exports = {
	"roots": [
		"<rootDir>/src"
	],
	"moduleNameMapper":{
		"\\.css$": "<rootDir>/__mocks__/styleMock.js",
		"\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js"
	},
	"transform": {
		"^.+\\.tsx?$": "ts-jest"
	},
	"testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
	"moduleFileExtensions": [
		"ts",
		"tsx",
		"js",
		"jsx",
		"json",
		"node",
		"svg",
		"png"
	],
	"snapshotSerializers": ["enzyme-to-json/serializer"],
	"setupTestFrameworkScriptFile": "<rootDir>/src/setupTests.ts"
}
