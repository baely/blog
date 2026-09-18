# Bailey's sites

One Hugo codebase contains two domain-specific sites:

- `blog.baileys.dev/`: blog configuration.
- `baely.au/`: notes configuration.
- `themes/shared/`: shared layouts, styles, scripts and archetypes, based on the baely.au theme.

Both sites use the shared theme. Site-specific titles, navigation, sections and
URLs remain in each domain's `hugo.toml`.

## Branches

The code branch contains the site configuration and shared theme. The `content`
branch contains that same code plus all writing and associated media under the
matching domain directories, and `.pages.yml` for Pages CMS. Merge future code
changes into `content` to keep its theme and configuration up to date.

## Build one site

From the repository root on the `content` branch:

```sh
hugo --source baely.au
```

Output goes to `baely.au/public/`, which is ignored by Git. Replace `baely.au`
with `blog.baileys.dev` to build the blog into `blog.baileys.dev/public/`.

To edit or build content alongside a code checkout:

```sh
git worktree add ../blog-content content
```

Select `content` in Pages CMS. Its configuration uses domain-qualified paths.
