<template>
  <div class="theme-preview">
    <h3>Aperçu des couleurs</h3>
    
    <div class="color-grid">
      <div
        v-for="(value, key) in colors"
        :key="key"
        class="color-item"
      >
        <div class="color-swatch" :style="{ backgroundColor: value }"></div>
        <div class="color-info">
          <label :for="`color-${key}`" class="color-label">{{ key }}</label>
          <input
            :id="`color-${key}`"
            type="color"
            :value="value"
            @input="updateColor(key, $event.target.value)"
            class="color-input"
          />
          <input
            type="text"
            :value="value"
            @input="updateColor(key, $event.target.value)"
            class="color-text"
            placeholder="#000000"
          />
        </div>
      </div>
    </div>
    
    <div class="preview-actions">
      <button @click="$emit('preview')" class="btn btn-secondary">
        👁️ Prévisualiser
      </button>
      <button @click="$emit('reset')" class="btn btn-outline">
        🔄 Réinitialiser
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  colors: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update', 'preview', 'reset'])

const updateColor = (key, value) => {
  emit('update', { ...props.colors, [key]: value })
}
</script>

<style scoped>
.theme-preview {
  background-color: var(--bg-elev);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
}

.theme-preview h3 {
  margin-bottom: var(--spacing-lg);
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-lg);
}

.color-item {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.color-swatch {
  width: 60px;
  height: 60px;
  border-radius: var(--radius-md);
  border: 2px solid var(--border);
  flex-shrink: 0;
}

.color-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.color-label {
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 0;
}

.color-input {
  width: 100%;
  height: 36px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  cursor: pointer;
}

.color-text {
  font-family: monospace;
  font-size: 0.875rem;
}

.preview-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
}
</style>
