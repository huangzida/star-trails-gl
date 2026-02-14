# @bg-effects/star-trails-gl

基于 [OGL](https://github.com/oframe/ogl) 和 Vue 3 开发的高性能星轨背景特效。

[在线演示](https://huangzida.github.io/star-trails-gl/)

[English](./README.md) | 简体中文

## 特性

- 🚀 **高性能**: 使用 WebGL (OGL) 渲染成千上万颗星星，性能卓越。
- 🎨 **高度可定制**: 可调节速度、数量、颜色、长度等多种参数。
- 📐 **多模式支持**: 支持同心圆（Concentric）和径向（Radial）渲染模式。
- 🛠 **调试模式**: 内置调试面板，支持实时配置预览。
- 🌍 **多语言支持**: 支持英文和中文。

## 安装

```bash
pnpm add @bg-effects/star-trails-gl ogl vue
```

## 使用方法

### 基础用法

```vue
<script setup>
import { StarTrailsGL } from '@bg-effects/star-trails-gl'
</script>

<template>
  <StarTrailsGL />
</template>
```

### 自定义配置

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

### 调试模式

```vue
<template>
  <StarTrailsGL debug />
</template>
```

## 配置参数 (Props)

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `speed` | `number` | `1.0` | 动画速度倍数 |
| `starCount` | `number` | `200` | 星星/星轨的数量 |
| `starColor` | `string` | `#ffffff` | 单色模式下的颜色 |
| `length` | `number` | `100` | 星轨长度 |
| `renderMode` | `'concentric' \| 'radial'` | `'concentric'` | 渲染模式 |
| `centerX` | `number` | `0.5` | 中心点 X (0.0 - 1.0) |
| `centerY` | `number` | `0.5` | 中心点 Y (0.0 - 1.0) |
| `colorMode` | `'single' \| 'multi'` | `'multi'` | 颜色模式 |
| `starBrightness` | `number` | `1.0` | 星星亮度倍数 |
| `thickness` | `number` | `2.0` | 星轨粗细 |
| `scale` | `number` | `1.0` | 整体缩放比例 |
| `taper` | `number` | `0.5` | 尾部收缩因子 (0.0 - 1.0) |
| `twinkle` | `number` | `0.5` | 闪烁强度 |
| `tilt` | `number` | `0.0` | 倾斜角度 (弧度) |
| `drawMode` | `'ribbon' \| 'lines'` | `'ribbon'` | 几何体绘制模式 |
| `debug` | `boolean` | `false` | 是否开启调试面板 |
| `lang` | `'zh-CN' \| 'en'` | `'zh-CN'` | 调试面板语言 |

## 开源协议

MIT
