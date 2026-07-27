<p align="center">
  <img src="./public/brand/vivid-layer-lockup.svg" alt="Vivid Layer" width="260" />
</p>

<p align="center">
  Expressive React components and shader effects distributed through the shadcn Registry.
</p>

<p align="center">
  <a href="https://www.vivid-layer.com/docs">Documentation</a>
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

Install a component with the shadcn CLI:

```bash
pnpm dlx shadcn@latest add @vivid-layer/grain-gradient
pnpm dlx shadcn@latest add @vivid-layer/chat-minimap
pnpm dlx shadcn@latest add @vivid-layer/single-day-weather-card
```

## Components

The public Registry currently includes:

- Install Command and Install Command Toolbar
- Chat Minimap
- Line Waveform
- Grid Loader
- Single-day and multi-day Weather Cards
- 26 Paper Shaders adapters with curated presets

Browse the complete catalog and interactive previews in the
[documentation](https://www.vivid-layer.com/docs).

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

Original Vivid Layer work is licensed under the
[Apache License 2.0](LICENSE). Compatible third-party work retains its original
license and attribution; see [Third-Party Notices](THIRD_PARTY_NOTICES.md) and
[Asset Provenance](ASSET_PROVENANCE.md).

The Apache License does not grant permission to use third-party names, logos,
or trademarks except as allowed by their respective owners or applicable law.
