+++
date = '2026-11-10T20:00:00+01:00'
draft = false
title = 'Artcoded'
tags = ["projects"]
+++

[Artcoded](https://github.com/openartcoded) is the application I use to manage the administrative side of my freelance work. I started it at the end of 2021 and I've been using it every day since.

The goal is to automate as much as possible of the boring stuff: invoices, expenses, and the dossier I send to my accountant every quarter.

### What it does

- **Expenses:** listens to an email address where I receive my bills, or I upload them manually. I tag them (e.g. "internet") so the VAT is filled in automatically
- **Invoices:** generated as PDF from a template (Freemarker / html), with my daily rate and default client
- **Dossiers:** expenses and invoices are added to the dossier of the current quarter. At the end, I generate a zip and send it to my accountant
- **Timesheets:** generated per month and exported to PDF
- **CV:** my CV is kept there and generated as PDF. The public part is shown on the website and published to a triplestore
- **Tasks:** scheduled tasks (cron) for things like database dumps and backups, with a notification when they run
- **Documents, gallery, blog, a SPARQL endpoint, and a few tools** (base64, xpath / jsonpath, rdf conversion, shacl validation...)

### How it's built

Everything runs with docker compose on [my own server](/posts/cloud-is-overkill/).

- Backend in Java / Spring Boot, with MongoDB and Artemis for events
- Backoffice in Angular, protected with Keycloak
- Spring Cloud Gateway in front of everything
- A small custom triplestore based on Apache Jena TDB2
- This website, built with Hugo

The setup to run it yourself is in the [app-docker](https://github.com/openartcoded/app-docker) repo, and there is some documentation [here](https://openartcoded.github.io/doc/).

It is made for my own needs, so some parts are probably too specific, but if it can be useful to someone else, feel free to use it.
