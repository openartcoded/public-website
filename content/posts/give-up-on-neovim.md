+++
date = '2026-04-05T08:49:07+02:00'
draft = false
title = 'I give up on neovim'
tags=["posts","editor", "tech"]
+++

**Note:** 

> English is not my first language. The text below was written by me and corrected by an AI. 
> I then corrected the AI's corrected text, so there are probably still some wording errors

In 2022, I made a New Year’s resolution to switch from Chrome to Firefox, and from VS Code to Neovim. 

My goal was to reduce my dependence on GAFAM tools, and it turned out to be a good decision considering [this](https://www.androidpolice.com/chrome-canary-manifest-v2-extensions-ad-blockers-gone/).

It took some time to adjust, but I am now a happy Firefox user on both desktop and mobile. 

That said, it still has some issues, for example, the tab system on Android. I wish there were an easier way to search through tabs or select multiple tabs to close them, instead of closing everything at once.

However, my experience with Neovim was very different. I can say I really tried to adopt it, as I used it for four years before deciding to abandon it.

The main issue is that I've never been interested in customizing my tools beyond the bare minimum needed to work. All I'm interested in is the code I write. 

I don't want to learn the internals of a tool before I can even starting using it. 

In my opinion, the bare minimum must be there out of the box, and the rest should be opt-in.

### The bare minimum for me

- LSP / autocompletion / formatting  (rust, java, typescript, javascript, python, ruby, node, html)
- Tree-sitter / syntax highlighting  
- Search and replace  
- Git / Git blame  
- Vim bindings  
- Telescope / file explorer  
- Tabs / split window  

That's basically it, I don't even need a debugger, I just want these features to work reliably.

## Issues

I am sure some people manage to get all of this working in Neovim, but that was never the case for me. 

Naturally, I started with a distribution. I began with LazyVim but ran into configuration issues. The default config file
is nice and simple to understand, but far from enough to start working in the next hour.

I then switched to AstroNvim, which broke in so many ways and so often that I cannot even list them all here. 

Still, it was the closest I got to meeting my requirements. 

Here's a non exhaustive list of issues I've encountered (not just related to astronvim):

- Formatting breaking entire files, sometimes literally removing code without warning  
- Neovim crashing if I left the terminal open too long without interaction  
- TypeScript LSP replaced by vtsls, Prettier/ESLint conflicts
- Code becoming unreadable due to an overwhelming number of warnings  
- Plugins being deprecated
- 150 plugin managers
- Distribution updates breaking everything  
- Each time I switched distributions, I have to learn new keybindings or spend time to understand how modifying them


I forced myself to endure this for years, tweaking configurations although I hate it, starting from scratch multiple times, and even trying to learn Lua and nvim internals.

## Back to codium

In January 2026, I finally decided that enough was enough and switched back to VSCodium. 
The tool simply works, I may have installed a few plugins, but it was a matter of few clicks.
And I barely had to configure anything. My colleagues are no longer frustrated with me for breaking formatting.

##  Conclusion

I still love Vim and Vim bindings, and I hope that one day Neovim/a distribution becomes stable enough to provide everything I need with consistent keybindings, or a simple and centralized configuration system where I can change them(for example, in a json, toml, or yaml file).

I shouldn’t fight the tool or feel frustrated with it when I’m only using basic features that every editor provides.

I'm open to discuss it and if someone provides me a working configuration with the basic features I mentioned above,  I'll test it for a month, and if everything works well,
I'll switch back.

