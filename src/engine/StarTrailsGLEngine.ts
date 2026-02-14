import { Renderer, Camera, Geometry, Program, Mesh } from 'ogl'
import type { StarTrailsGLConfig } from '../types'
import vertex from './shaders/vertex.glsl?raw'
import fragment from './shaders/fragment.glsl?raw'

export class StarTrailsGLEngine {
  private container: HTMLElement
  private renderer: Renderer
  private gl: Renderer['gl']
  private camera: Camera
  private program: Program
  private mesh: Mesh | null = null
  private animationId = 0
  private config: StarTrailsGLConfig
  private resizeObserver: ResizeObserver | null = null
  private width = 0
  private height = 0

  constructor(container: HTMLElement, config: StarTrailsGLConfig) {
    this.container = container
    this.config = { ...config }

    this.renderer = new Renderer({ alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio || 1, 2) })
    this.gl = this.renderer.gl
    this.container.appendChild(this.gl.canvas)

    this.camera = new Camera(this.gl)
    this.camera.position.z = 1000

    this.program = new Program(this.gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uSpeed: { value: this.config.speed },
        uLength: { value: this.config.length },
        uCenter: { value: [0, 0] },
        uAspect: { value: 1 },
        uIsRadial: { value: this.config.renderMode === 'radial' },
        uBrightness: { value: this.config.starBrightness },
        uThickness: { value: this.config.thickness },
        uTaper: { value: this.config.taper },
        uTwinkle: { value: this.config.twinkle },
        uTilt: { value: this.config.tilt },
        uScale: { value: this.config.scale ?? 1.0 },
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
    })

    this.handleResize = this.handleResize.bind(this)
    this.handleVisibility = this.handleVisibility.bind(this)

    this.resizeObserver = new ResizeObserver(() => this.handleResize())
    this.resizeObserver.observe(this.container)
    window.addEventListener('resize', this.handleResize)
    document.addEventListener('visibilitychange', this.handleVisibility)

    this.rebuild()
    this.handleResize()
  }

  public start() {
    if (this.animationId) return
    this.update(0)
  }

  public pause() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
      this.animationId = 0
    }
  }

  public resume() {
    this.start()
  }

  public restart() {
    this.rebuild()
    this.resume()
  }

  public updateConfig(next: StarTrailsGLConfig) {
    const prev = this.config
    
    // Update uniforms
    this.program.uniforms.uSpeed.value = next.speed
    this.program.uniforms.uLength.value = next.length
    this.program.uniforms.uIsRadial.value = next.renderMode === 'radial'
    this.program.uniforms.uBrightness.value = next.starBrightness
    this.program.uniforms.uThickness.value = next.thickness
    this.program.uniforms.uTaper.value = next.taper
    this.program.uniforms.uTwinkle.value = next.twinkle
    this.program.uniforms.uTilt.value = next.tilt
    this.program.uniforms.uScale.value = next.scale ?? 1.0

    // Check if rebuild is needed
    const needsRebuild =
      prev.starCount !== next.starCount ||
      prev.drawMode !== next.drawMode ||
      prev.colorPreset !== next.colorPreset ||
      prev.color1 !== next.color1 ||
      prev.color2 !== next.color2 ||
      prev.colorMode !== next.colorMode ||
      prev.starColor !== next.starColor

    // Update config copy
    this.config = { ...next }

    if (needsRebuild) this.rebuild()
  }

  public destroy() {
    this.pause()
    window.removeEventListener('resize', this.handleResize)
    document.removeEventListener('visibilitychange', this.handleVisibility)
    this.resizeObserver?.disconnect()
    this.resizeObserver = null
    if (this.mesh) {
      // @ts-ignore
      this.mesh.geometry?.dispose?.()
      this.mesh = null
    }
    const canvas = this.gl?.canvas
    if (canvas && canvas.parentElement) {
      canvas.parentElement.removeChild(canvas)
    }
  }

  private update = (t: number) => {
    this.animationId = requestAnimationFrame(this.update)
    if (!this.mesh) return

    this.program.uniforms.uTime.value = t * 0.001
    const centerX = (this.config.centerX - 0.5) * this.width
    const centerY = (0.5 - this.config.centerY) * this.height
    this.program.uniforms.uCenter.value = [centerX, centerY]

    this.renderer.render({ scene: this.mesh, camera: this.camera })
  }

  private handleResize() {
    const width = this.container.clientWidth || window.innerWidth
    const height = this.container.clientHeight || window.innerHeight
    this.width = width
    this.height = height

    this.renderer.setSize(width, height)
    this.camera.orthographic({
      left: -width / 2,
      right: width / 2,
      top: height / 2,
      bottom: -height / 2,
      near: 0.1,
      far: 2000,
    })
  }

  private handleVisibility() {
    if (document.visibilityState === 'hidden') this.pause()
  }

  private hexToRgb(hex: string) {
    const h = hex.replace('#', '')
    const r = parseInt(h.substring(0, 2), 16) / 255
    const g = parseInt(h.substring(2, 4), 16) / 255
    const b = parseInt(h.substring(4, 6), 16) / 255
    return [r, g, b]
  }

  private rebuild() {
    const gl = this.gl as any
    const segmentsPerStar = 50
    const isLines = this.config.drawMode === 'lines'
    const supportsUint32 =
      typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext
        ? true
        : !!gl.getExtension?.('OES_element_index_uint')

    const baseStarCount = this.config.starCount
    const perStarVertices = isLines ? segmentsPerStar : segmentsPerStar * 2
    const maxStarsUint16 = Math.floor(65535 / perStarVertices)
    const starCount = supportsUint32 ? baseStarCount : Math.max(1, Math.min(baseStarCount, maxStarsUint16))

    const totalVertices = starCount * perStarVertices
    const infos = new Float32Array(totalVertices * 2)
    const datas = new Float32Array(totalVertices * 3)
    const colors = new Float32Array(totalVertices * 3)
    const sides = new Float32Array(totalVertices)

    const indexCount = isLines
      ? starCount * (segmentsPerStar - 1) * 2
      : starCount * (segmentsPerStar - 1) * 6

    const indices = supportsUint32 ? new Uint32Array(indexCount) : new Uint16Array(indexCount)

    const c1 = this.hexToRgb(this.config.color1)
    const c2 = this.hexToRgb(this.config.color2)
    const single = this.hexToRgb(this.config.starColor || '#ffffff')

    for (let i = 0; i < starCount; i++) {
      const radius = 100 + Math.random() * 800
      const angle = Math.random() * Math.PI * 2
      const speedMult = 0.5 + Math.random() * 1.5

      let r = 1
      let g = 1
      let b = 1

      if (this.config.colorMode === 'single') {
        r = single[0]
        g = single[1]
        b = single[2]
      } else {
        const preset = this.config.colorPreset
        if (preset === 'realistic') {
          const p = Math.random()
          if (p > 0.9) { r = 0.65; g = 0.8; b = 1.0 }
          else if (p > 0.7) { r = 0.85; g = 0.9; b = 1.0 }
          else if (p > 0.4) { r = 1.0; g = 1.0; b = 1.0 }
          else if (p > 0.2) { r = 1.0; g = 0.95; b = 0.8 }
          else { r = 1.0; g = 0.75; b = 0.6 }
        } else if (preset === 'dual') {
          const p = Math.random()
          r = c1[0] + (c2[0] - c1[0]) * p
          g = c1[1] + (c2[1] - c1[1]) * p
          b = c1[2] + (c2[2] - c1[2]) * p
        } else {
          const p = Math.random()
          if (p > 0.8) { r = 0.1; g = 0.6; b = 1.0 }
          else if (p > 0.6) { r = 1.0; g = 0.4; b = 0.2 }
          else if (p > 0.4) { r = 0.8; g = 0.2; b = 1.0 }
          else if (p > 0.2) { r = 0.2; g = 1.0; b = 0.6 }
          else { r = 1.0; g = 0.9; b = 0.5 }
        }
      }

      for (let j = 0; j < segmentsPerStar; j++) {
        if (isLines) {
          const vIdx = i * segmentsPerStar + j
          infos.set([i, j], vIdx * 2)
          datas.set([radius, angle, speedMult], vIdx * 3)
          colors.set([r, g, b], vIdx * 3)
          sides[vIdx] = 0

          if (j < segmentsPerStar - 1) {
            const iIdx = (i * (segmentsPerStar - 1) + j) * 2
            indices.set([vIdx, vIdx + 1] as any, iIdx)
          }
        } else {
          const vIdx = (i * segmentsPerStar + j) * 2

          infos.set([i, j], vIdx * 2)
          datas.set([radius, angle, speedMult], vIdx * 3)
          colors.set([r, g, b], vIdx * 3)
          sides[vIdx] = -1

          infos.set([i, j], (vIdx + 1) * 2)
          datas.set([radius, angle, speedMult], (vIdx + 1) * 3)
          colors.set([r, g, b], (vIdx + 1) * 3)
          sides[vIdx + 1] = 1

          if (j < segmentsPerStar - 1) {
            const iIdx = (i * (segmentsPerStar - 1) + j) * 6
            const a = vIdx, b1 = vIdx + 1, c = vIdx + 2, d = vIdx + 3
            indices.set([a, b1, c, b1, c, d] as any, iIdx)
          }
        }
      }
    }

    // @ts-ignore
    this.mesh?.geometry?.dispose?.()

    const geometry = new Geometry(this.gl, {
      aInfo: { size: 2, data: infos },
      position: { size: 3, data: datas },
      aColor: { size: 3, data: colors },
      aSide: { size: 1, data: sides },
      index: { data: indices },
    })

    this.mesh = new Mesh(this.gl, {
      mode: isLines ? gl.LINES : gl.TRIANGLES,
      geometry,
      program: this.program,
    })
  }
}
