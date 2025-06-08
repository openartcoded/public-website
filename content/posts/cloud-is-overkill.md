+++
date = '2025-06-08T17:08:07+02:00'
draft = false
title = 'Cloud Is Overkill'
tags=["posts","cloud", "tech"]
+++

Last week, I saw a [Reddit post](https://old.reddit.com/r/webdev/comments/1b14bty/netlify_just_sent_me_a_104k_bill_for_a_simple/) in which a user explained how Netlify sent him a bill of over $100K just for hosting a static website.

It seems it ended well for him since Netlify canceled the invoice (maybe because the post went viral).

Days after it went viral, someone created [a website](https://serverlesshorrors.com/) listing all these billing horror stories, which led me to read another article.

This time, it was about a [$72K bill](https://dev-blog.tomilkieway.com/72k-1/) from Google, for a Python script with a recursive bug deployed on Firebase.

This article caught my attention for this:

> To keep it simple, as our experiment was for a very small site, we used Firebase
> for database, as Cloud Run doesn’t have any storage, and deploying on SQL server,
> or any other DB for a test run would have been an over kill.

Why would using a database be considered **overkill**?

Any developer should find it simple to use an SQLite database.
In fact, just a few years ago, it was suggested for simple use cases!

Configuring a simple S3 bucket requires reading a gazillion of AWS tutorials
and legal documents to understand and approve, just to "upload a file".

But maintaining a server is very complicated apparently, right?

For the past four years, I've been maintaining a server (i5 7500, 16GB RAM), with minimal support.

It hosts my [personal ERP](https://github.com/openartcoded/app-docker), a nextcloud instance and other things.

I use few external services, like Cloudflare (free tier), Github / Github Actions to build my docker images (free tier), Google Drive (free tier) and a Hetzner storage box (1TB, €3/month) for my backups.

I am not against services when it makes sense, and when I actually understand them (meaning I can sleep without the fear of waking up with a 100K debt).

This server has been running continuously without an issue I couldn't fix in a few minutes; I've never had a surprise on my electricity bill, never lost a file, and my database backups work (I test them).

I use Docker / Docker Compose to simplify deployments, so deploying a database is as simple as adding that into my docker-compose.yml file:

```yaml
db:
  image: postgres
  environment:
    POSTGRES_PASSWORD: example
```

Even though it's still working perfectly fine, I decided to migrate to a Raspberry Pi 5, mostly because I wanted ~to try~ it ~out~. It only took me a few hours.

The old server didn't cost me anything (it used to be my dev machine), the Raspberry Pi (including cooler and case) cost me around €150.
I refurbished an old ssd to use it as my apps storage.

![2276-1024.jpg](/posts/cloud-is-overkill/2276-1024.jpg)

I expect it to run for years and I have enough CPU power and storage space to deploy even more stuff on it without having to change my pricing plan.

I feel like cloud vendors have managed to convince developers that their solution is simpler, more scalable, etc. when in most cases, it's quiet the opposite.
They don't need to advertise, devs take care of that.

You have to become a lawyer to understand their legal jargon, spend hours reading documentations that will be obsolete in the next two years, or irrelevant for another provider, just to execute a Python script.

If my employer asks me to use cloud technologies, I wouldn't mind, as I'm paid for that. But for simple experiments, or for private usage, having your own server and knowing it's not that complicated to maintain it is something I would strongly recommend.
