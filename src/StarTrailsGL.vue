<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed, defineAsyncComponent } from 'vue'
import { defu } from 'defu'
import { DebugShell } from '@bg-effects/debug-ui'
import { meta } from './meta'
import type { StarTrailsGLConfig, StarTrailsGLProps, StarTrailsGLLang } from './types'
import { StarTrailsGLEngine } from './engine'

const props = defineProps<StarTrailsGLProps>()

const ConfigContent = defineAsyncComponent(() => import('./ui/ConfigPanel.vue'))
const configContentRef = ref<any>(null)

const containerRef = ref<HTMLElement | null>(null)
let engine: StarTrailsGLEngine | null = null

const resolveConfig = (input: any) => defu(input, meta.defaultConfig) as StarTrailsGLConfig
const config = ref<StarTrailsGLConfig>(resolveConfig(props))
const internalLang = ref<StarTrailsGLLang>(props.lang || 'zh-CN')

watch(() => props, (newProps) => {
  if (!props.debug) {
    config.value = resolveConfig(newProps)
  }
}, { deep: true })

const engineInterface = computed(() => ({
  pause: () => engine?.pause(),
  resume: () => engine?.resume(),
  restart: () => engine?.restart(),
}))

const handleRandomize = () => {
  if (!meta.randomize) return
  const currentTab = configContentRef.value?.activeTab as any
  const tabValue = typeof currentTab === 'object' && currentTab?.value ? currentTab.value : currentTab
  config.value = meta.randomize(config.value, tabValue)
}

watch(config, (next) => {
  engine?.updateConfig(next)
}, { deep: true })

onMounted(() => {
  if (!containerRef.value) return
  engine = new StarTrailsGLEngine(containerRef.value, config.value)
  engine.start()
})

onUnmounted(() => {
  engine?.destroy()
  engine = null
})
</script>

<template>
  <div class="star-trails-gl">
    <div ref="containerRef" class="absolute inset-0 overflow-hidden" />
    <DebugShell
      v-if="props.debug"
      v-model:config="config"
      v-model:lang="internalLang"
      :meta="meta"
      :engine="engineInterface"
      @randomize="handleRandomize"
    >
      <template #settings>
        <ConfigContent ref="configContentRef" v-model:config="config" :lang="internalLang" />
      </template>
    </DebugShell>
  </div>
</template>

<style scoped>
</style>


