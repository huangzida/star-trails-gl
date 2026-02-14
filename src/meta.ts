import type { EffectMeta } from '@bg-effects/core'
import type { StarTrailsGLConfig, StarTrailsGLColorPreset, StarTrailsGLDrawMode, StarTrailsGLRenderMode } from './types'

const rnd = (min: number, max: number) => min + Math.random() * (max - min)
const rndInt = (min: number, max: number) => Math.floor(rnd(min, max + 1))
const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)]
const pickBool = (p = 0.5) => Math.random() < p

export const meta: EffectMeta<StarTrailsGLConfig> = {
  id: 'star-trails-gl',
  name: {
    en: 'Star Trails GL',
    'zh-CN': '星轨 GL',
  },
  category: 'space',
  version: '1.0.0',
  defaultConfig: {
    speed: 1.0,
    starCount: 200,
    starColor: '#ffffff',
    length: 100,
    renderMode: 'concentric',
    centerX: 0.5,
    centerY: 0.5,
    colorMode: 'multi',
    starBrightness: 1.0,
    thickness: 2.0,
    scale: 1.0,
    taper: 0.5,
    twinkle: 0.5,
    tilt: 0.0,
    drawMode: 'ribbon',
    colorPreset: 'classic',
    color1: '#7aa2f7',
    color2: '#bb9af7',
  },
  randomize: (current, tab) => {
    const partialByTab: Record<string, () => Partial<StarTrailsGLConfig>> = {
      render: () => ({
        renderMode: pick<StarTrailsGLRenderMode>(['concentric', 'radial']),
        speed: rnd(0.5, 2.5),
        length: rndInt(50, 200),
      }),
      geometry: () => ({
        drawMode: pick<StarTrailsGLDrawMode>(['ribbon', 'lines']),
        thickness: rnd(1, 5),
        taper: rnd(0, 1),
        tilt: rnd(-0.8, 0.8),
        scale: rnd(0.5, 2.0),
      }),
      color: () => ({
        colorMode: pickBool(0.7) ? 'multi' : 'single',
        colorPreset: pick<StarTrailsGLColorPreset>(['classic', 'realistic', 'dual']),
        color1: pick(['#7aa2f7', '#00d4ff', '#7c3aed', '#ff00ff', '#00ffff']),
        color2: pick(['#bb9af7', '#ffb86c', '#50fa7b', '#ff5555', '#f1fa8c']),
        starBrightness: rnd(0.5, 1.2),
        starColor: '#ffffff',
      }),
      stars: () => ({
        starCount: rndInt(500, 5000),
        starBrightness: rnd(0.5, 1.2),
        twinkle: rnd(0, 1),
      }),
      center: () => ({
        centerX: rnd(0.2, 0.8),
        centerY: rnd(0.2, 0.8),
      }),
    }

    const applyAll = () => ({
      ...partialByTab.render(),
      ...partialByTab.geometry(),
      ...partialByTab.color(),
      ...partialByTab.stars(),
      ...partialByTab.center(),
    })

    const partial = tab && partialByTab[tab] ? partialByTab[tab]() : applyAll()
    
    return {
      ...current,
      ...partial,
    }
  },
  presets: [
    {
      id: 'classic',
      name: { en: 'Classic', 'zh-CN': '经典' },
      config: {
        renderMode: 'concentric',
        drawMode: 'ribbon',
        speed: 1.0,
        starCount: 200,
        length: 110,
        thickness: 2.0,
        scale: 1.0,
        taper: 0.5,
        tilt: 0.0,
        twinkle: 0.5,
        starBrightness: 1.0,
        colorPreset: 'classic',
        centerX: 0.5,
        centerY: 0.5,
        colorMode: 'multi',
        starColor: '#ffffff',
        color1: '#7aa2f7',
        color2: '#bb9af7',
      },
    },
    {
      id: 'realistic',
      name: { en: 'Realistic', 'zh-CN': '真实星色' },
      config: {
        renderMode: 'concentric',
        drawMode: 'lines',
        speed: 0.9,
        starCount: 300,
        length: 130,
        thickness: 1.0,
        scale: 1.0,
        taper: 0.2,
        tilt: 0.2,
        twinkle: 0.3,
        starBrightness: 1.0,
        colorPreset: 'realistic',
        centerX: 0.5,
        centerY: 0.5,
        colorMode: 'multi',
        starColor: '#ffffff',
        color1: '#7aa2f7',
        color2: '#bb9af7',
      },
    },
    {
      id: 'dual',
      name: { en: 'Dual Tone', 'zh-CN': '双色渐变' },
      config: {
        renderMode: 'radial',
        drawMode: 'ribbon',
        speed: 1.2,
        starCount: 200,
        length: 150,
        thickness: 3.0,
        scale: 1.2,
        taper: 0.7,
        tilt: -0.25,
        twinkle: 0.6,
        starBrightness: 1.0,
        colorPreset: 'dual',
        color1: '#7aa2f7',
        color2: '#bb9af7',
        centerX: 0.5,
        centerY: 0.5,
        colorMode: 'multi',
        starColor: '#ffffff',
      },
    },
  ],
}
