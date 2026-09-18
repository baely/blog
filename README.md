# Bailey's sites

One Hugo codebase contains two domain-specific sites:

- `blog.baileys.dev/`: blog configuration.
- `baely.au/`: notes configuration.
- `themes/shared/`: shared layouts, styles, scripts and archetypes, based on the baely.au theme.

Both sites use the shared theme. Site-specific titles, navigation, sections and
URLs remain in each domain's `hugo.toml`.

## Content branch

The independent `content` branch holds all writing and associated media under
matching domain directories, plus `.pages.yml` for Pages CMS. Archetypes are
source templates and remain on `main` with the theme.

To edit writing alongside the code:

```sh
git worktree add ../blog-content content
```

Select `content` in Pages CMS. Its configuration uses domain-qualified paths.
