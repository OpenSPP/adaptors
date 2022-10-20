# Adaptors Monorepo

The new home for all @openfn language adaptors.

**N.B.: We hope to migrate our 60+ adaptors here over the coming weeks.**

This repo requires [pnpm](https://pnpm.io/installation) to be installed globally
on your machine.

## Getting Started

A few first time repo steps:

Install tool versions with [asdf](https://github.com/asdf-vm/asdf)

```
asdf install
```

Install pnpm:

```
npm install -g pnpm
```

And run the setup command:

```
pnpm run setup
```

## Running scripts

Every repo provides a common set of npm scripts:

To run them for all scripts in `packages`, call
`pnpm --filter "./packages/** <script>`.

For example:

```
pnpm --filter "./packages/**" build
pnpm --filter "./packages/**" test
```

## Changesets

Any submitted PRs should have an accompanying
[`changeset`](https://github.com/changesets/changesets).

A changeset is a text file with a list of what you've changed and a short
summary. Changesets are stored in a temporary folder until a release, at which
point they are merged into the changelogs of the affected packges.

Adding a changeset is really easy thanks to a very friendly CLI.

To create a changeset, run this from the repo root:

```
pnpm changeset
```

Look in the `.changesets` folder to see your change.

Commit the changeset to the repo when you're ready.

## Releases

To release, run this from the root:

```
pnpm changeset version
```

This will bump all changed packages and update their release notes.

Then install packages and commit changes with:

```
pnpm install
```

Build the adaptors with:

```
pnpm -r run build
```

To publish the release, run:

```
changeset publish
```

And finally, push the tags to Github so that the source code can be browsed for
each new release with:

```
git push --follow-tags
```

## Build tooling

The `build` command accepts a list of build steps as arguments: `ast`, `src`,
`docs` and `dts`. Calling build on an adaptor with no arguments will build
everything.

Each adaptor's build command should simply call `build-adaptor` with the package
name.

You can run `build --help` for more information.

## Migration Guide

Adaptors should be copied/cloned into this repo, with all build, lint and git
artefacts removed and the package.json updated.

This checklist walks you through the process.

First, create a new branch for your work:

```
git checkout -b migrate_<name>
```

Then, copy the adaptor into `packages/<name>` (ignoring the `language-` prefix,
ie, `language-http` -> `http`). You can `cd` into `package` and `git clone`
straight from github if you like.

Next, from the `adaptors` root folder, run the migration script:

```
pnpm migrate <name>
```

For example, `pnpm migrate http`.

Then, from inside your new `packages/<name>`:

- Remove the `.git` directory
- Commit your changes `git commit -am "cloned <name> into monorepo"`
- Delete `package-lock.json`
- Remove `bundledDependencies` from package.json
- Run `pnpm install`
- Remove the `docs` and `lib` dirs
- Remove `.prettierrc`
- Remove any references to `babel` (ie, `.babelrc`) and `esdoc` (ie,
  `esdoc.json`)
- Remove the `.gitignore` file (update the top level ignore if neccessary)
- Remove the `Makefile`
- Remove the `.devcontainer`
- Remove the `.tool-versions`
- Remove the `travis.yml`
- Update the readme (see the `Readme` below)
- Fix unit tests (see `Tests` below)
- run `pnpm changeset` from the repo root to register a changeset (add a minor
  version bump for the package).
- Commit your changes, including the changeset, and open a pull request against
  `main`.

### Readme

The readme probably has a section called "Development".

Replace this section with:

```
## Development

Clone the [adaptors monorepo](https://github.com/OpenFn/adaptors). Follow the `Getting Started` guide inside to get set up.

Run tests using `pnpm run test` or `pnpm run test:watch`

Build the project using `pnpm build`.

To just build the docs run `pnpm build docs`
```

In addition, you may need to replace any references to `npm` with `pnpm`

### Tests

You'll need to update tests and get them passing. There are a few things to be
aware of here.

**Import paths**

Instead of importing test files from `lib`, import directly from `src`.

Ie, replace `import Adaptor from '../lib/Adaptor'` becomes
`import Adaptor from '../src/Adaptor'`

**Importing CJS modules**

Packages in this repo should assume native support for esm modules (ie, `import`
instead of `require`).

Although adaptors use EJS syntax, many used to transpile through babel into CJS
format.

You will probably find that `chai` and `lodash` throw exceptions when you try
and run the tests. To fix this, read closely the error message that is returned.
You probably need to change the import from:

```
import { isEmpty } from 'lodash/fp';
```

to:

```
import _ from 'lodash/fp';
const { isEmpty } = _;
```
