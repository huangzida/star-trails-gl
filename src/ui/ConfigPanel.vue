<script setup lang="ts">
import { Panel, SubTabs, Slider, Select, ColorPicker, useI18n } from '@bg-effects/shared'
import { computed, ref } from 'vue'
import type { StarTrailsGLConfig, StarTrailsGLLang } from '../types'
import zhCN from '../locales/zh-CN.json'
import en from '../locales/en.json'

const config = defineModel<StarTrailsGLConfig>('config', { required: true })

const props = defineProps<{
  lang?: StarTrailsGLLang
}>()

const activeTab = ref<'render' | 'geometry' | 'color' | 'center' | 'stars'>('render')

const { t } = useI18n({
  messages: {
    'zh-CN': zhCN,
    'en': en,
  },
  locale: computed(() => props.lang || 'zh-CN'),
})

const tabs = computed(() => [
  { id: 'render', label: t('tabs.render') },
  { id: 'geometry', label: t('tabs.geometry') },
  { id: 'color', label: t('tabs.color') },
  { id: 'stars', label: t('tabs.stars') },
  { id: 'center', label: t('tabs.center') },
])

const renderModeOptions = computed(() => [
  { label: t('options.concentric'), value: 'concentric' },
  { label: t('options.radial'), value: 'radial' },
])

const drawModeOptions = computed(() => [
  { label: t('options.ribbon'), value: 'ribbon' },
  { label: t('options.lines'), value: 'lines' },
])

const colorModeOptions = computed(() => [
  { label: t('options.single'), value: 'single' },
  { label: t('options.multi'), value: 'multi' },
])

const colorPresetOptions = computed(() => [
  { label: t('options.classic'), value: 'classic' },
  { label: t('options.realistic'), value: 'realistic' },
  { label: t('options.dual'), value: 'dual' },
])

defineExpose({
  activeTab,
})
</script>

<template>
  <Panel>
    <SubTabs v-model="activeTab" :tabs="tabs" :rows="2" />

    <div class="flex flex-col gap-6 mt-4 p-1 pointer-events-auto overflow-y-auto max-h-[400px] custom-scrollbar pr-2">
      <div v-if="activeTab === 'render'" class="flex flex-col gap-6">
        <Select v-model="config.renderMode" :options="renderModeOptions" :label="t('config.render_mode')" />
        <Slider v-model="config.speed" :min="0.1" :max="5" :step="0.1" :label="t('config.speed')" />
        <Slider v-model="config.length" :min="1" :max="200" :step="1" :label="t('config.length')" />
      </div>

      <div v-else-if="activeTab === 'geometry'" class="flex flex-col gap-6">
        <Select v-model="config.drawMode" :options="drawModeOptions" :label="t('config.draw_mode')" />
        <Slider v-if="config.drawMode === 'ribbon'" v-model="config.thickness" :min="1" :max="5" :step="0.1" :label="t('config.thickness')" />
        <Slider v-model="config.scale" :min="0.1" :max="3" :step="0.1" :label="t('config.scale')" />
        <Slider v-if="config.drawMode === 'ribbon'" v-model="config.taper" :min="0" :max="1" :step="0.1" :label="t('config.taper')" />
        <Slider v-model="config.tilt" :min="-1" :max="1" :step="0.1" :label="t('config.tilt')" />
      </div>

      <div v-else-if="activeTab === 'color'" class="flex flex-col gap-6">
        <Select v-model="config.colorMode" :options="colorModeOptions" :label="t('config.color_mode')" />
        <ColorPicker v-if="config.colorMode === 'single'" v-model="config.starColor" :label="t('config.star_color')" />
        <Select v-if="config.colorMode !== 'single'" v-model="config.colorPreset" :options="colorPresetOptions" :label="t('config.color_preset')" />
        <div v-if="config.colorPreset === 'dual'" class="grid grid-cols-2 gap-3">
          <ColorPicker v-model="config.color1" :label="t('config.color1')" />
          <ColorPicker v-model="config.color2" :label="t('config.color2')" />
        </div>
      </div>

      <div v-else-if="activeTab === 'stars'" class="flex flex-col gap-6">
        <Slider v-model="config.starCount" :min="100" :max="10000" :step="100" :label="t('config.star_count')" />
        <Slider v-model="config.starBrightness" :min="0" :max="2" :step="0.1" :label="t('config.brightness')" />
        <Slider v-model="config.twinkle" :min="0" :max="1" :step="0.1" :label="t('config.twinkle')" />
      </div>

      <div v-else-if="activeTab === 'center'" class="flex flex-col gap-6">
        <Slider v-model="config.centerX" :min="0" :max="1" :step="0.1" :label="t('config.center_x')" />
        <Slider v-model="config.centerY" :min="0" :max="1" :step="0.1" :label="t('config.center_y')" />
      </div>
    </div>
  </Panel>
</template>