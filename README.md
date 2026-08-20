<h1 align="center">Vivid Layer</h1>

<p align="center">
  Expressive React components and shader effects distributed through the shadcn Registry.
</p>

<p align="center">
  <a href="https://www.vivid-layer.com/docs">Documentation</a>
  ·
  <a href="https://www.vivid-layer.com/components">Components</a>
  ·
  <a href="https://www.vivid-layer.com/shaders">Shaders</a>
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

Install a Component or Shader with the shadcn CLI:

```bash
pnpm dlx shadcn@latest add @vivid-layer/grain-gradient
pnpm dlx shadcn@latest add @vivid-layer/chat-minimap
pnpm dlx shadcn@latest add @vivid-layer/draft-email-card
pnpm dlx shadcn@latest add @vivid-layer/streaming
pnpm dlx shadcn@latest add @vivid-layer/stay-card
pnpm dlx shadcn@latest add @vivid-layer/single-day-weather-card
```

## Components

The public Component catalog currently includes:

- Install Command and Install Command Toolbar
- Chat Minimap
- Draft Email Card
- Grid Loader
- Streaming
- Stay Card
- Single-day and multi-day Weather Cards

Browse the complete Component catalog and interactive previews at
[vivid-layer.com/components](https://www.vivid-layer.com/components).

## Shaders

The public Shader catalog includes 26 Paper Shaders adapters with curated
presets. Browse the complete catalog, configurators, and interactive previews
at [vivid-layer.com/shaders](https://www.vivid-layer.com/shaders).

## Repository structure

```text
components/ui/       React UI components
components/effects/  Paper Shaders adapters
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
