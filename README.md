# Chuckie Egg Game

#### Technologies: TypeScript, React 19, Vite, SCSS

[![CI](https://github.com/adrianeyre/chuckie-egg/actions/workflows/ci.yml/badge.svg)](https://github.com/adrianeyre/chuckie-egg/actions/workflows/ci.yml)

As Hen-House Harry, the player must collect the twelve eggs positioned in each level, before a countdown timer reaches zero. In addition there are piles of seed which may be collected to increase points and stop the countdown timer for a while, but will otherwise be eaten by hens that patrol the level, causing them to pause. If the player touches a hen or falls through a gap in the bottom of the level, he loses a life. Each level is made of solid platforms, ladders and occasionally lift platforms that constantly move upwards but upon leaving the top of the screen will reappear at the bottom. Hitting the top of the screen while on one of these lifts, however, will also cause the player to lose a life.

## Index

- [Installation and Run](#Install)
- [Screen Shots](#Shots)
- [Releases](#Release)
- [Play Chuckie Egg](#Play)

## <a name="Install">Installation and Run</a>

Requires **Node 26 or newer**.

- To clone the repo and run the game

```shell
$ git clone https://github.com/adrianeyre/chuckie-egg
$ cd chuckie-egg
$ npm install
$ npm start
```

- Other useful scripts

```shell
$ npm run build          # typecheck, then produce a static site in dist/
$ npm run preview        # serve the built site
$ npm test               # run the test suite
$ npm run lint           # ESLint
$ npm run typecheck      # tsc --noEmit
$ npm run format:check   # Prettier
```

## <a name="Shots">Screen Shots</a>

[![Screenshot](https://raw.githubusercontent.com/adrianeyre/chuckie-egg/master/src/images/screenshot1.png)](https://raw.githubusercontent.com/adrianeyre/chuckie-egg/master/src/images/screenshot1.png 'Game View')

[![Screenshot](https://raw.githubusercontent.com/adrianeyre/chuckie-egg/master/src/images/screenshot2.png)](https://raw.githubusercontent.com/adrianeyre/chuckie-egg/master/src/images/screenshot2.png 'Game View')

## <a name="Release">Releases</a>

Merging to `master` runs [semantic-release](https://github.com/semantic-release/semantic-release),
which reads the conventional-commit messages since the last tag, works out the next version, writes
`CHANGELOG.md`, tags the commit and publishes a GitHub release. The bumped tree is then built and
deployed to GitHub Pages, so the published site is always the version that was just released.

`conventional-changelog-conventionalcommits` is held at `9.x` on purpose. Its `10.x` templates need
`conventional-changelog-writer@9`, and the newest `@semantic-release/release-notes-generator` and
`@semantic-release/commit-analyzer` still depend on `conventional-changelog-writer@8`, so pairing
the two majors makes the release fail while rendering the notes. Move the preset to `10.x` only
once those plugins ship with writer 9.

## <a name="Play">Play Chuckie Egg</a>

- [Chuckie Egg](https://adrianeyre.github.io/chuckie-egg/)
