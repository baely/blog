#!/bin/sh
# Build one domain, or both, using code here and writing from the content branch.
set -eu
root=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
site=${1:-all}
case "$site" in
  all) sites='blog.baileys.dev baely.au' ;;
  blog.baileys.dev|baely.au) sites=$site ;;
  *) echo "Usage: $0 [all|blog.baileys.dev|baely.au]" >&2; exit 2 ;;
esac
stage=$(mktemp -d)
trap 'rm -rf "$stage"' EXIT HUP INT TERM
if [ -n "${CONTENT_DIR:-}" ]; then
  content=$(CDPATH= cd -- "$CONTENT_DIR" && pwd)
else
  mkdir "$stage/content"
  git -C "$root" archive "${CONTENT_REF:-content}" > "$stage/content.tar"
  tar -xf "$stage/content.tar" -C "$stage/content"
  content=$stage/content
fi
for domain in $sites; do
  if [ ! -d "$content/$domain/content" ]; then
    echo "Missing $domain/content in content source: $content" >&2
    exit 1
  fi
  mkdir "$stage/$domain"
  cp -R "$root/$domain/." "$stage/$domain/"
  cp -R "$content/$domain/." "$stage/$domain/"
  hugo --source "$stage/$domain" --themesDir "$root/themes" \
    --destination "$root/public/$domain" --cleanDestinationDir --panicOnWarning
 done
