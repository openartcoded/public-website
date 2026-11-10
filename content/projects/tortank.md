+++
date = '2026-11-10T20:00:00+01:00'
draft = false
title = 'Tortank'
tags = ["projects"]
+++

[Tortank](https://github.com/nbittich/tortank) is a Turtle / N-Triples parser and in-memory RDF store written in Rust.

[Try it out!](https://nbittich.github.io/tortank)

I wrote it for [Swarm](/projects/swarm), where I needed to parse and compare a lot of triples (e.g. to calculate the difference between two jobs).

### Features

- Covers (roughly) the [Turtle spec](https://www.w3.org/TR/turtle/): prefixes, collections, blank nodes, etc.
- Blank nodes are skolemized
- Set operations (difference, intersection), pattern matching and turtle serialization
- Only the default graph is supported (no named graphs)

### Usage

In Rust:

```sh
cargo add tortank
```

```rust
use tortank::turtle::turtle_doc::TurtleDoc;

let doc = TurtleDoc::try_from((input, None, None))?;
println!("{}", doc.as_turtle()?);
```

It can also be used from JavaScript / TypeScript through WebAssembly: `@nbittich/tortank-wasm` for Node, `@nbittich/web-tortank` for the browser.

More examples in the [README](https://github.com/nbittich/tortank).

Like the other components of Swarm, it's experimental, so I wouldn't use it in production.
