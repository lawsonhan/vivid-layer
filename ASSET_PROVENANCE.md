# Asset Provenance

This file records the origin of project-owned or project-controlled visual
assets intended for distribution with vivid-layer. Third-party source and
runtime notices are recorded separately in
[THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Vivid Layer Weather Icons

The ten files under `public/weather-assets` are an AI-assisted icon set created
for Vivid Layer using OpenAI image generation. The set uses an independently
developed soft-clay and frosted-glass treatment across ten day, night, and
precipitation conditions.

The visual direction was inspired by the four weather icons shown in OpenAI's
[ChatKit Weather Current](https://widgets.chatkit.studio/gallery/weather_current)
and
[ChatKit Weather Forecast](https://widgets.chatkit.studio/gallery/weather_forecast)
examples. The Vivid Layer set was generated as a separate ten-icon collection;
no original OpenAI asset files are included or redistributed.

OpenAI does not sponsor, endorse, or maintain these assets. “OpenAI” and
“ChatKit” remain trademarks of their respective owner.

Recorded July 27, 2026.
The stars in the two night-condition assets were refined on August 5, 2026,
using the same AI-assisted visual direction.

| Stored asset | SHA-256 |
| --- | --- |
| `clear-day.webp` | `6fc7a2cc18e5cdb61b621c0b10bb84ead1dde93487e927466405a07a9a11f7a7` |
| `partly-cloudy-day.webp` | `ab3a13f00605f14a5c49e53c017efea7378e291fb78003dfc41d4acd30cb084e` |
| `overcast.webp` | `736f90676f3f20a145efb4d5e719602c9b345772910adde94ec85f6d7f951b10` |
| `drizzle.webp` | `2199aa035e0da17b1cf4ad9d5fc196e36c36d1d3a37f06ae43082c8df9f41824` |
| `rain.webp` | `53cfacd80fca1af8f2cb2122b73103eb1cbbf33869af39c475c42da06550cff1` |
| `thunderstorm.webp` | `bedbbc00192cfd1d26b3664ffee34c13f39a0e12dbe77b4db804a0caad7c51d1` |
| `snow.webp` | `1242b2a9f3e3486a0d8d205016a1fe3c9a8c0ade3b3c927ae217b997fe0db357` |
| `wind.webp` | `109cb1a8eb793119cec4b695f931c26f1ca89545a440b6b68080bbeb4d4d586c` |
| `clear-night.webp` | `9ea69d3ba2800acdfa9370e4c5ce6b40dce78ca4f9b08c8140b533c492e65ae8` |
| `partly-cloudy-night.webp` | `84034a72b00ac282f82bcc65bc494996f1447753877c28223f085d8b23a87391` |

## Aurora Display Product Image

`public/component-assets/aurora-display.webp` was generated for the Crop Marks
Spec Sheet example using the built-in OpenAI image generation tool on
September 6, 2026. It depicts a fictional, unbranded silver desktop monitor
with a blue and violet screen in an ice-blue studio setting, inspired by
Apple's restrained product advertising and modern e-commerce photography.
It is not a photograph of an Apple product. No reference image was supplied.

The generated PNG was encoded as a 1536 × 1024 WebP at quality 90.

| Stored asset | SHA-256 |
| --- | --- |
| `aurora-display.webp` | `8df66b5d8eea7883fa432abe75e6b8e8ce19f4d423521bff2c9872f1e088bbab` |

### Generation prompt

```text
Use case: ads-marketing.
Asset type: premium e-commerce product campaign photograph for the left panel of a monitor specification sheet.
Primary request: create a polished, modern promotional image of a premium desktop monitor, with a carefully art-directed studio background. Aim for the quality, restraint and material realism of Apple's product advertising and contemporary high-end industrial-design campaigns.
Subject: a single original unbranded silver aluminum 27-inch widescreen monitor, slim enclosure, uniform narrow black bezel, precision-machined silver stand and a slim rectangular foot. Make it a desirable, physically convincing piece of hardware.
Scene: an elegant seamless pale ice-blue studio cyclorama. A soft pool of daylight falls diagonally across the floor; a broad diffuse blue-lilac glow behind the product gives depth. The monitor stands on the floor plane with a realistic soft directional contact shadow. Subtle gradient atmosphere, beautifully controlled lighting. No transparent background.
Composition: landscape 3:2. Show the whole monitor and stand from a gently elevated three-quarter front angle, about 15 degrees off-axis, so the thin aluminum side and sculptural support are visible. Product occupies about 78 percent of the image width and 80 percent of the height, centered with calm breathing room. The complete foot must be visible with floor below it. Architectural, intentional, clean.
Screen: a sophisticated original abstract wallpaper of translucent flowing lavender and deep cobalt glass-like ribbons, with generous soft light regions and a restrained cyan accent. Elegant and luminous, no neon laser streaks. It should make the display look premium while keeping the hardware as the focal point.
Photographic treatment: refined commercial studio photography, realistic brushed and bead-blasted metal, soft highlight rolloff, crisp glass, subtle optical reflections, immaculate edges, high production value. Natural perspective, sharp product detail.
Constraints: one monitor only, no logo, no Apple branding, no text, no labels, no fake desktop UI, no watermark, no people, no cables, no keyboard or mouse, no extra products, no pedestal, no exploded view, no futuristic sci-fi environment, no flat front-on cutout, no heavy black vignette.
```

## Landing Playground Cloud Background

`public/landing-features/shader-playground-clouds-dither.png` is a 1672 × 941
background prepared on September 6, 2026, from
[Anton Repponen's mountain and clouds photograph on Unsplash](https://unsplash.com/photos/mountain-with-clouds-wxxAx26SXys).
The source photograph was edited with OpenAI image generation, then processed
in [Turbo Dither](https://www.turbodither.com/) to retain its warm gold and
muted green colors with a fine Floyd–Steinberg texture. The approved PNG was
copied into the project without further image editing.

## Landing Playground Forest Background

`public/landing-features/shader-playground-forest-dither.png` is the approved
1672 × 941 forest background prepared on September 6, 2026, from this
[Unsplash photograph](https://images.unsplash.com/photo-1511497584788-876760111969).
The source photograph was edited with OpenAI image generation, then processed
in [Turbo Dither](https://www.turbodither.com/) to retain its muted greens and
warm sky with a fine Floyd–Steinberg texture. The approved PNG was copied into
the project without further image editing.

## Shader Lab Monument Valley example

- Creator: Jeremy Bishop.
- Source: https://unsplash.com/photos/monument-valley-k0g5RBU0OKg
- License: Unsplash License, https://unsplash.com/license
- Stored asset: `public/shader-assets/monument-valley.9a0e22e4434a.jpg`
- SHA-256: `9a0e22e4434ac4db0275549d196c9cb010c43e51a19d8d10671b493d688681b0`
- The original downloaded photo is used without additional color correction. Shader posters are rendered derivatives.
