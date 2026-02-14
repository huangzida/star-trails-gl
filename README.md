# @bg-effects/star-trails-gl

A high-performance star trails background effect built with [OGL](https://github.com/oframe/ogl) and Vue 3.

[Live Demo](https://huangzida.github.io/star-trails-gl/)

English | [简体中文](./README.zh-CN.md)

## Features

- 🚀 **High Performance**: Uses WebGL (OGL) for efficient rendering of thousands of stars.
- 🎨 **Highly Customizable**: Adjustable speed, count, colors, length, and more.
- 📐 **Multiple Modes**: Supports concentric and radial render modes.
- 🛠 **Debug Mode**: Built-in debug panel for real-time configuration.
- 🌍 **I18n**: Supports English and Chinese.

## Installation

```bash
pnpm add @bg-effects/star-trails-gl ogl vue
```

## Usage

### Basic Usage

```vue
<script setup>
import { StarTrailsGL } from '@bg-effects/star-trails-gl'
</script>

<template>
  <StarTrailsGL />
</template>
```

### With Custom Configuration

```vue
<template>
  <StarTrailsGL 
    :speed="1.5"
    :star-count="300"
    star-color="#ffffff"
    render-mode="concentric"
  />
</template>
```

### Debug Mode

```vue
<template>
  <StarTrailsGL debug />
</template>
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `speed` | `number` | `1.0` | Animation speed multiplier |
| `starCount` | `number` | `200` | Number of stars/trails |
| `starColor` | `string` | `#ffffff` | Color for single color mode |
| `length` | `number` | `100` | Trail length |
| `renderMode` | `'concentric' \| 'radial'` | `'concentric'` | Rendering mode |
| `centerX` | `number` | `0.5` | Center X (0.0 - 1.0) |
| `centerY` | `number` | `0.5` | Center Y (0.0 - 1.0) |
| `colorMode` | `'single' \| 'multi'` | `'multi'` | Color mode |
| `starBrightness` | `number` | `1.0` | Brightness multiplier |
| `thickness` | `number` | `2.0` | Trail thickness |
| `scale` | `number` | `1.0` | Overall scale |
| `taper` | `number` | `0.5` | Trail taper factor (0.0 - 1.0) |
| `twinkle` | `number` | `0.5` | Twinkle intensity |
| `tilt` | `number` | `0.0` | Tilt angle in radians |
| `drawMode` | `'ribbon' \| 'lines'` | `'ribbon'` | Geometry draw mode |
| `debug` | `boolean` | `false` | Enable debug panel |
| `lang` | `'zh-CN' \| 'en'` | `'zh-CN'` | Language for debug panel |

## License

MIT
