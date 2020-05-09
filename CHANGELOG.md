# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## [v0.7.1] - 2020-05-09

### Added

- scanToCsv script
- make new interfaces; combine with Row interface 870d8f4

### Changes

- rename scanProductsTable to scanTable

### Changelog

https://github.com/thiskevinwang/dynamodb-graphql-server/compare/v0.7.0...v0.7.1

## [v0.7.0] - 2020-05-05

### Changes

This adds new functionality for `Channels` & `Messages`

- `createChannel`
- `queryChannels`
- `createMessage`
- `queryMessagesByChannel`

Adds `getFormattedDate` util

- formats a date as YYYYMMDD-HHMMSS

### Changelog

https://github.com/thiskevinwang/dynamodb-graphql-server/compare/v0.6.2...v0.7.0

## [v0.6.2] - 2020-05-03

### Changes

:art: This re-organizes resolvers, by "domain/entity", rather than by "Query" & "Mutation".

- :alembic: This also co-locates "typeDefs" with their respective resolvers. (experimental-ish)

This introduces **no new functionality**.

### Changelog

- use '/Users/' resolver directory 2621912
- use '/Votes/' resolver directory f0633bd
- use '/Products/' resolver directory e32adce
- use '/Auth/' resolver directory 236f979
- use '/S3/' resolver directory 17a66fb
- use '/Tables/' resolver directory d0d3e08
- Use Apollo Enum naming convention … 4ded3f8
- fix accidental nesting & duplicates f2449ed
- co-locate 'gql' typeDefs 8386baa
- add "Row" GraphQL interface … 2a72289

## [v0.6.1] - 2020-05-03

### Changes

Split up _monolithic_ `typeDefs` in `schema.graphql.ts`

- use multiple `gql` tags, and `extend type Query/Mutation`

### Todo

Co-locate TypeScript interfaces and GraphQL typedefs.

- This will be significantly easier to grok, and update

Rethink `/resolvers` folder structure

- ❌ separating by `/Query` & `/Mutation` no longer makes sense.
- ✅ separate by "Entity" or "Domain" probably makes more sense.

## [v0.6.0] - 2020-05-03

### Changes

Add 'updateUserAvatarUrl' resolver e4e7798

## [v0.5.0] - 2020-05-02

### Changes

Return `email` & `username` in auth resolvers

## [v0.4.0] - 2020-05-02

### Breaking Changes

Completely reworked schema to work with [dynamo-next-graphql](https://github.com/thiskevinwang/dynamo-next-graphql)

Add `AuthDirective` and `/directives` folder

Use S3 URL signing logic from [rds-ts-node-server](https://github.com/thiskevinwang/rds-ts-node-server)

## [v0.3.0] - 2020-04-27

### Changes

Begin Changelog

Added 'snacks' resolvers

- `createSnack`
- `createSnacksTable` (dev)
- `querySnacks`
- `scanSnacksTable` (dev)

Add `seedMoviesTable` (dev) resolver

- ⚠️ do not run in production

Add `upperCamelCase` util

- install `jest` to test

Add `@development` GraphQL Schema directive

- 4bb1f1d3b750850f057d8b17df6b705b291e1a2f
