<template>
  <div class="toggle-list">
    <div class="list-header">
      <h4>{{ title }}</h4>
      <button @click="addItem" class="btn btn-sm">+ Ajouter</button>
    </div>
    
    <div class="list-items">
      <div
        v-for="(item, index) in items"
        :key="item.id"
        class="list-item"
      >
        <div class="item-controls">
          <button @click="moveUp(index)" :disabled="index === 0" class="btn-icon">↑</button>
          <button @click="moveDown(index)" :disabled="index === items.length - 1" class="btn-icon">↓</button>
        </div>
        
        <div class="item-visible">
          <input
            type="checkbox"
            :id="`visible-${item.id}`"
            :checked="item.visible"
            @change="updateItem(index, { ...item, visible: $event.target.checked })"
          />
          <label :for="`visible-${item.id}`">Visible</label>
        </div>
        
        <div class="item-field">
          <label>ID</label>
          <input
            type="text"
            :value="item.id"
            @input="updateItem(index, { ...item, id: $event.target.value })"
            placeholder="id-unique"
          />
        </div>
        
        <div class="item-field">
          <label>Label Key (i18n)</label>
          <input
            type="text"
            :value="item.labelKey"
            @input="updateItem(index, { ...item, labelKey: $event.target.value })"
            placeholder="nav.home"
          />
        </div>
        
        <div class="item-field">
          <label>Path</label>
          <input
            type="text"
            :value="item.path"
            @input="updateItem(index, { ...item, path: $event.target.value })"
            placeholder="/home"
          />
        </div>
        
        <button @click="removeItem(index)" class="btn btn-sm btn-danger">
          🗑️ Supprimer
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  title: {
    type: String,
    default: 'Items'
  }
})

const emit = defineEmits(['update'])

const updateItem = (index, updatedItem) => {
  const newItems = [...props.items]
  newItems[index] = updatedItem
  emit('update', newItems)
}

const moveUp = (index) => {
  if (index === 0) return
  const newItems = [...props.items]
  const temp = newItems[index]
  newItems[index] = newItems[index - 1]
  newItems[index - 1] = temp
  // Update order
  newItems.forEach((item, idx) => {
    item.order = idx
  })
  emit('update', newItems)
}

const moveDown = (index) => {
  if (index === props.items.length - 1) return
  const newItems = [...props.items]
  const temp = newItems[index]
  newItems[index] = newItems[index + 1]
  newItems[index + 1] = temp
  // Update order
  newItems.forEach((item, idx) => {
    item.order = idx
  })
  emit('update', newItems)
}

const addItem = () => {
  const newItems = [...props.items]
  const newId = `item-${Date.now()}`
  newItems.push({
    id: newId,
    visible: true,
    order: newItems.length,
    labelKey: 'nav.new',
    path: '/new'
  })
  emit('update', newItems)
}

const removeItem = (index) => {
  const newItems = [...props.items]
  newItems.splice(index, 1)
  // Update order
  newItems.forEach((item, idx) => {
    item.order = idx
  })
  emit('update', newItems)
}
</script>

<style scoped>
.toggle-list {
  background-color: var(--bg-elev);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.list-header h4 {
  margin: 0;
}

.list-items {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.list-item {
  display: grid;
  grid-template-columns: auto auto 1fr 2fr 1.5fr auto;
  gap: var(--spacing-md);
  align-items: center;
  padding: var(--spacing-md);
  background-color: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}

.item-controls {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.btn-icon {
  width: 32px;
  height: 32px;
  padding: 0;
  border: 1px solid var(--border);
  background-color: var(--bg);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-icon:hover:not(:disabled) {
  background-color: var(--bg-elev);
  border-color: var(--primary);
}

.btn-icon:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.item-visible {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.item-visible input[type="checkbox"] {
  width: auto;
  margin: 0;
}

.item-visible label {
  margin: 0;
  font-size: 0.875rem;
}

.item-field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.item-field label {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--muted);
  margin: 0;
}

.item-field input {
  font-size: 0.875rem;
  padding: var(--spacing-xs) var(--spacing-sm);
}

@media (max-width: 1024px) {
  .list-item {
    grid-template-columns: 1fr;
  }
  
  .item-controls {
    flex-direction: row;
  }
}
</style>
