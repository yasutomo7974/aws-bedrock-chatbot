# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Static personal portfolio site for "SWELL web works" (AWS Solutions Architect / cloud consultant, Japanese-language). No build system, package manager, or test suite — plain HTML/CSS/JS served as-is, plus one Python Lambda function for a chatbot backend.

## Running locally

There is no build step. Open `index.html` directly in a browser, or serve the directory with any static file server, e.g.:

```
python3 -m http.server 8000
```

## Architecture

- `index.html` — the entire one-page site. All sections (`#fv`, `#service`, `#work`, `#skills`, `#about`, `#blog`, `#contact`) live on this single page and are navigated to via in-page anchor links (`nav ul li a href="#..."`).
- `style.css` — single stylesheet for the whole site, organized section-by-section in the same order as `index.html` (hero/`.fv`, `.services`, `.works`, `.skills`, `.about`, `.blog-section`, `.contact`, footer), each with its own `@media` breakpoints (commonly `768px`/`980px`/`420px`) inline near the relevant rules rather than grouped at the end of the file.
- `js/script.js` — vanilla JS, no framework/bundler. Handles:
  - mobile nav menu toggle (`#menu-btn` / `nav` / `body.no-scroll`)
  - chat widget wiring for `#chat-send` / `#chat-input` (same logic duplicated in `chatbot.html`'s inline `<script>` — keep both in sync if changed)
  - `loadBlogPosts()`: fetches latest posts from an external WordPress REST API (`https://yasulog-life.com/wp-json/wp/v2/posts`) and renders them into `#blog-list` client-side
- `chatbot.html` — standalone demo page (linked from the "AI Chatbot" work item in `index.html`) with its own inline CSS/JS duplicating the chat widget from `index.html`/`script.js`.
- `lambda_function.py` — AWS Lambda handler (Python, boto3) behind the API Gateway endpoint the chat widget calls (`https://uhdu8gkjs3.execute-api.us-east-1.amazonaws.com/chat`). Invokes Amazon Bedrock's `converse` API with a Claude model and returns `{ reply }` as JSON with CORS headers (`Access-Control-Allow-Origin: *`). This file is the deployed source for that Lambda but is not wired into any local build/deploy tooling in this repo — deployment is manual/out-of-band.
- `img/` — all site imagery (work-item screenshots, profile photo, favicons).

## Notes

- The contact form in `index.html` posts to Formspree (`action="https://formspree.io/f/xxxxxxxx"`); the placeholder endpoint ID should be treated as intentional unless told otherwise.
- The chat widget's fetch URL is hardcoded in both `js/script.js` and `chatbot.html`. When changing the API Gateway endpoint or Bedrock model, update `lambda_function.py`, `js/script.js`, and `chatbot.html` together.
- Blog content on the page is not static — it's pulled live from an external WordPress site at page-load time, so there's no local blog content to edit.
