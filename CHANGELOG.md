# Change Log

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

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
