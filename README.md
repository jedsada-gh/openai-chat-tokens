# openai-chat-tokens

This repository is a fork of [hmarr/openai-chat-tokens](https://github.com/hmarr/openai-chat-tokens), modified to reduce the bundle size by replacing unused large objects. The result is that bundle size is ~4 MB, reduced to ~1 MB 🎉.

## Purpose

The primary purpose of this fork is to minimize the size of the JavaScript bundle by replacing large, unused objects with empty objects. This helps improve the performance and loading time of applications that use this package.

## Changes Made

The following large objects have been replaced as they were not used in our specific implementation:

- `gpt2_default`
- `r50k_base_default`
- `p50k_base_default`
- `p50k_edit_default`
- `o200k_base_default`

These objects are defined in the original repository and can significantly increase the bundle size. By replacing them with empty objects, we ensure that the bundle remains lightweight.

## Installation

You can install the modified package using npm:

```bash
$ npm install @mootod/openai-chat-tokens
```

## Usage

```js
import { encode, decode } from "@mootod/openai-chat-tokens";

const encoded = encode("Hello, world!");
const decoded = decode(encoded);

console.log("encoded:", encoded);
console.log("decoded:", decoded);
```

## How to Replace the Objects

We used esbuild to replace the large objects with empty objects in the bundle. For more details, refer to the `esbuild.config.js` file in the repository.
