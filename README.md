# Bailey's sites

One Hugo codebase serves two domains:

- `blog.baileys.dev/`: blog configuration.
- `baely.au/`: notes configuration.
- `themes/shared/`: the shared theme, scripts, styles and archetypes, based on the baely.au theme.

Hugo 0.158.0 or later is required. Both sites use the same templates and styling;
site-specific titles, navigation, sections and URLs remain in each `hugo.toml`.

## Content branch

The independent `content` branch contains the Markdown writing and associated
media under the same domain directories, plus `.pages.yml` for Pages CMS.
Archetypes are templates and stay with the code. Existing history is unchanged;
old commits can still contain writing. The original baelyau repository is untouched.

Build both domains from the local `content` branch:

```sh
./scripts/build.sh
# Or build one domain:
./scripts/build.sh baely.au
```

Output is written to `public/<domain>/`. The build stages content in a temporary
directory and does not change either branch. It fails if the content source is
missing. `CONTENT_REF` can select a different local Git ref.

To edit writing alongside the code:

```sh
git worktree add ../blog-content content
# Edit and commit files in ../blog-content.
CONTENT_DIR=../blog-content ./scripts/build.sh
```

`CONTENT_DIR` uses the files in that directory, including uncommitted edits.
To preview a generated site locally (rebuild after editing):

```sh
python3 -m http.server 8000 --directory public/baely.au
# Open http://localhost:8000; use public/blog.baileys.dev for the blog.
```

Select the `content` branch in Pages CMS. Its configuration uses domain-qualified
paths; site/theme settings are managed on the code branch.

## Container and deployment

The shared image serves both sites using Nginx's Host header routing. Route each
domain to the container's port 80; unknown hosts default to blog.baileys.dev.

Before a local Docker build, export the content branch into the ignored `.content`
directory (start with an absent/empty directory to avoid stale files):

```sh
mkdir .content
git archive content | tar -x -C .content
docker build -t blog:local .
```

GitHub Actions checks out code and content separately and rebuilds the shared
`registry.baileys.dev/blog:latest` image on changes to either `main` or `content`.
Code is read from `main` when a content change triggers the workflow. The content
branch also carries the workflow so its pushes can trigger a rebuild. Local
branches must be published deliberately before this can run remotely.
