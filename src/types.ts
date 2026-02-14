export type StarTrailsGLRenderMode = 'concentric' | 'radial'
export type StarTrailsGLDrawMode = 'ribbon' | 'lines'
export type StarTrailsGLColorMode = 'single' | 'multi'
export type StarTrailsGLColorPreset = 'classic' | 'realistic' | 'dual'

export interface StarTrailsGLConfig {
  speed: number
  starCount: number
  starColor: string
  length: number
  renderMode: StarTrailsGLRenderMode
  centerX: number
  centerY: number
  colorMode: StarTrailsGLColorMode
  starBrightness: number
  thickness: number
  scale: number
  taper: number
  twinkle: number
  tilt: number
  drawMode: StarTrailsGLDrawMode
  colorPreset: StarTrailsGLColorPreset
  color1: string
  color2: string
}

export type StarTrailsGLLang = 'zh-CN' | 'en'

export type StarTrailsGLProps = Partial<StarTrailsGLConfig> & {
  debug?: boolean
  lang?: StarTrailsGLLang
}

