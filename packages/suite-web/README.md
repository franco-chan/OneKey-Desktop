# @onekey/web

Build target for web environment.

## Tests

Notes on testing strategies [here](./test/README.md)

## How to sync into staging

`assetPrefix=/suite yarn workspace @onekey/web build`

and

`./scripts/s3sync.sh stage beta`
