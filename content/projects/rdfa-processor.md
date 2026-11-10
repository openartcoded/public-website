+++
date = '2026-11-10T20:00:00+01:00'
draft = false
title = 'RDFa processor'
tags = ["projects"]
+++

[graph-rdfa-processor](https://github.com/nbittich/graph-rdfa-processor) is a library to extract RDF statements (as N-Triples) from an html page, based on its [RDFa](https://en.wikipedia.org/wiki/RDFa) annotations.

[Try it out!](https://nbittich.github.io/graph-rdfa-processor/)

It's the `extract` step of [Swarm](/projects/swarm): local administrations in Flanders publish their decisions as RDFa annotated html, and this library turns them into triples.

### Usage

In Rust:

```rust
use graph_rdfa_processor::RdfaGraph;

let triples = RdfaGraph::parse_str(html, "http://example.com", None, None)?;
```

In Node, through WebAssembly:

```sh
npm i @nbittich/rdfa-wasm
```

```js
const { html_to_rdfa } = require("@nbittich/rdfa-wasm");

console.log(html_to_rdfa(html, "http://example.com", ""));
```

It's still a work in progress and doesn't cover the whole spec, so expect some edge cases to fail.
