<h1 align="center">Vivid Layer</h1>

<p align="center">
  Source-available React components, WebGL shader effects, and page sections distributed through the shadcn Registry.
</p>

<p align="center">
  <a href="https://www.vivid-layer.com/docs">Documentation</a>
  ·
  <a href="https://www.vivid-layer.com/components">Components</a>
  ·
  <a href="https://www.vivid-layer.com/shaders">Shaders</a>
  ·
  <a href="https://www.vivid-layer.com/blocks">Blocks</a>
  ·
  <a href="https://www.vivid-layer.com">Website</a>
  ·
  <a href="https://github.com/lawsonhan/vivid-layer/issues">Issues</a>
</p>

## Install

Add the Vivid Layer Registry to `components.json`:

```json
{
  "registries": {
    "@vivid-layer": "https://www.vivid-layer.com/r/{name}.json"
  }
}
```

Install a Component, Shader, or Block with the shadcn CLI:

```bash
pnpm dlx shadcn@latest add @vivid-layer/grain-gradient
pnpm dlx shadcn@latest add @vivid-layer/chat-minimap
pnpm dlx shadcn@latest add @vivid-layer/draft-email-card
pnpm dlx shadcn@latest add @vivid-layer/streaming
pnpm dlx shadcn@latest add @vivid-layer/stay-card
pnpm dlx shadcn@latest add @vivid-layer/single-day-weather-card
pnpm dlx shadcn@latest add @vivid-layer/stats-01
```

## Components

The public Component catalog currently includes:

- Install Command
- Install Command Toolbar
- Crop Marks
- Plan Composer
- Voice Composer
- Draft Email Card
- Chat Minimap
- Grid Loader
- Streaming
- Playful Streaming
- Stay Card
- Mosaic Stay Card
- Single-day Weather
- Multi-day Weather

Browse the complete Component catalog and interactive previews at
[vivid-layer.com/components](https://www.vivid-layer.com/components).

## Shaders

The public Shader catalog includes 26 Paper Shaders adapters with curated
presets. Browse the complete catalog, configurators, and interactive previews
at [vivid-layer.com/shaders](https://www.vivid-layer.com/shaders).

## Blocks

Blocks are complete page sections built on the Crop Marks component. They are
documented one page per category, with every variant of a category on that
page, at [vivid-layer.com/blocks](https://www.vivid-layer.com/blocks). The
public Block catalog currently includes:

- Features 01
- Stats 01
- Testimonials 01
- Gallery 01
- Product Card 01
- Footer 01

## Repository structure

```text
components/ui/       React UI components
components/effects/  Shader components and adapters
components/blocks/   Page sections, one folder per Block
registry/examples/   Installable examples and presets
hooks/               Shared public hooks
lib/                 Public Registry utilities
public/              Distributable assets and previews
registry.json        shadcn Registry source
```

This repository is generated from an explicit public allowlist. The website,
commerce implementation, paid components, and private design assets are not
part of this repository or its history.

## Development

Requirements:

- Node.js 22 or newer
- pnpm 11.10.0

```bash
pnpm install
pnpm registry:check
pnpm registry:build
```

## License

Except for identified third-party materials, original Vivid Layer work is
source-available under the [Vivid Layer Community License 1.0](LICENSE). This
is not an open-source license.

You may use and modify Vivid Layer Material in personal and commercial end
products, including websites, applications, SaaS products, and client
projects. You may not redistribute it as source code or use it to offer
component libraries, templates, starters, themes, design systems, page
builders, code generators, or similar reusable products, whether free or
paid. The terms in [LICENSE](LICENSE) control.

Third-party portions retain their original licenses and redistribution rights;
the Vivid Layer license applies only to Vivid Layer Material, including our
original additions and modifications. See [Third-Party
Notices](THIRD_PARTY_NOTICES.md) and [Asset
Provenance](ASSET_PROVENANCE.md).
