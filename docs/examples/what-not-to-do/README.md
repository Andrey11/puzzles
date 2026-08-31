# What not to do: rewrite a finished Inkscape board as `<use>` symbols

This folder is a cautionary example. Do not treat these files as assets.

## What happened

The original board (`~/Downloads/puzzles.svg`) is an Inkscape file: 25 unique tiles, cloned filters, clip paths, and lighting that only looks right on those authored rects. The user already had a WebP export for production.

The question was whether `<use>` could *optimize* that file without changing the look. The first render was already wrong (washed greys / limes). Instead of stopping, later attempts got worse (brushed metal, then cheap gem overlays). None of them were shippable.

## The rule

If the first visual comparison fails, stop. Do not “optimize” a look-dependent SVG by inventing simpler symbols. Rasterize (WebP/PNG) or keep the original.

## Files

- [puzzles-board-failed.svg](puzzles-board-failed.svg) — last failed rewrite (gem gradients). Not for public use.
