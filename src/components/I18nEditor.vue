<template>
  <div class="i18n-editor">
    <div class="editor-header">
      <div class="header-controls">
        <select v-model="selectedLocale" class="locale-select">
          <option v-for="loc in locales" :key="loc" :value="loc">
            {{ loc.toUpperCase() }}
          </option>
        </select>
        
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Rechercher une clé..."
          class="search-input"
        />
      </div>
      
      <div class="header-actions">
        <button @click="showAddKey = true" class="btn btn-sm">+ Ajouter</button>
        <button @click="exportJSON" class="btn btn-sm btn-outline">📥 Export</button>
        <button @click="importJSON" class="btn btn-sm btn-outline">📤 Import</button>
      </div>
    </div>
    
    <!-- Add key modal -->
    <div v-if="showAddKey" class="modal-overlay" @click.self="showAddKey = false">
      <div class="modal-content">
        <h3>Ajouter une clé</h3>
        <div class="form-group">
          <label>Clé (format dot-case)</label>
          <input v-model="newKey" type="text" placeholder="nav.home" />
          <span v-if="keyError" class="form-error">{{ keyError }}</span>
        </div>
        <div class="form-group">
          <label>Valeur</label>
          <textarea v-model="newValue" rows="3" placeholder="Accueil"></textarea>
        </div>
        <div class="modal-actions">
          <button @click="addKey" class="btn">Ajouter</button>
          <button @click="showAddKey = false" class="btn btn-outline">Annuler</button>
        </div>
      </div>
    </div>
    
    <!-- Keys table -->
    <div class="keys-table">
      <div class="table-header">
        <div class="col-key">Clé</div>
        <div class="col-value">Valeur</div>
        <div class="col-actions">Actions</div>
      </div>
      
      <div class="table-body">
        <div
          v-for="[key, value] in filteredEntries"
          :key="key"
          class="table-row"
        >
          <div class="col-key">
            <code>{{ key }}</code>
          </div>
          <div class="col-value">
            <input
              type="text"
              :value="value"
              @input="updateKey(key, $event.target.value)"
              class="value-input"
            />
          </div>
          <div class="col-actions">
            <button @click="deleteKey(key)" class="btn-icon btn-danger" title="Supprimer">
              🗑️
            </button>
          </div>
        </div>
        
        <div v-if="filteredEntries.length === 0" class="empty-state">
          Aucune clé trouvée
        </div>
      </div>
    </div>
    
    <div class="editor-footer">
      <p class="text-muted">{{ filteredEntries.length }} clé(s)</p>
    </div>
    
    <!-- Hidden file input for import -->
    <input
      ref="fileInput"
      type="file"
      accept=".json"
      style="display: none"
      @change="handleFileImport"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { isValidI18nKey } from '../helpers/cms-validators'

const props = defineProps({
  messages: {
    type: Object,
    required: true
  },
  locales: {
    type: Array,
    default: () => ['fr', 'en']
  }
})

const emit = defineEmits(['update', 'delete'])

const selectedLocale = ref(props.locales[0])
const searchQuery = ref('')
const showAddKey = ref(false)
const newKey = ref('')
const newValue = ref('')
const keyError = ref('')
const fileInput = ref(null)

// Get messages for selected locale
const currentMessages = computed(() => {
  return props.messages[selectedLocale.value] || {}
})

// Filter entries based on search
const filteredEntries = computed(() => {
  const entries = Object.entries(currentMessages.value)
  if (!searchQuery.value) return entries
  
  const query = searchQuery.value.toLowerCase()
  return entries.filter(([key, value]) => {
    return key.toLowerCase().includes(query) || 
           value.toLowerCase().includes(query)
  })
})

// Methods
const updateKey = (key, value) => {
  emit('update', selectedLocale.value, key, value)
}

const deleteKey = (key) => {
  if (confirm(`Supprimer la clé "${key}" ?`)) {
    emit('delete', selectedLocale.value, key)
  }
}

const addKey = () => {
  keyError.value = ''
  
  // Validate key
  if (!isValidI18nKey(newKey.value)) {
    keyError.value = 'Format invalide (utilisez dot-case: ex. nav.home)'
    return
  }
  
  if (currentMessages.value[newKey.value]) {
    keyError.value = 'Cette clé existe déjà'
    return
  }
  
  if (!newValue.value) {
    keyError.value = 'La valeur est requise'
    return
  }
  
  // Add key
  emit('update', selectedLocale.value, newKey.value, newValue.value)
  
  // Reset form
  newKey.value = ''
  newValue.value = ''
  showAddKey.value = false
}

const exportJSON = () => {
  const data = currentMessages.value
  const json = JSON.stringify(data, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `i18n-${selectedLocale.value}-${Date.now()}.json`
  a.click()
  URL.revokeObjectURL(url)
}

const importJSON = () => {
  fileInput.value?.click()
}

const handleFileImport = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  
  try {
    const text = await file.text()
    const data = JSON.parse(text)
    
    // Flatten if nested
    const flatData = flattenObject(data)
    
    // Import all keys
    Object.entries(flatData).forEach(([key, value]) => {
      if (isValidI18nKey(key)) {
        emit('update', selectedLocale.value, key, value)
      }
    })
    
    alert(`Import réussi: ${Object.keys(flatData).length} clé(s)`)
  } catch (error) {
    alert('Erreur lors de l\'import: ' + error.message)
  }
  
  // Reset input
  event.target.value = ''
}

// Flatten nested object to dot-notation
const flattenObject = (obj, prefix = '') => {
  return Object.keys(obj).reduce((acc, key) => {
    const pre = prefix.length ? `${prefix}.` : ''
    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
      Object.assign(acc, flattenObject(obj[key], pre + key))
    } else {
      acc[pre + key] = obj[key]
    }
    return acc
  }, {})
}
</script>

<style scoped>
.i18n-editor {
  background-color: var(--bg-elev);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
}

.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  gap: var(--spacing-md);
}

.header-controls {
  display: flex;
  gap: var(--spacing-md);
  flex: 1;
}

.locale-select {
  width: 100px;
}

.search-input {
  flex: 1;
  max-width: 300px;
}

.header-actions {
  display: flex;
  gap: var(--spacing-sm);
}

.keys-table {
  background-color: var(--bg);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 3fr auto;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: var(--bg-elev);
  font-weight: 600;
  border-bottom: 1px solid var(--border);
}

.table-body {
  max-height: 600px;
  overflow-y: auto;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 3fr auto;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--border);
  align-items: center;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background-color: var(--bg-elev);
}

.col-key code {
  font-size: 0.875rem;
  color: var(--primary);
}

.value-input {
  width: 100%;
  font-size: 0.875rem;
  padding: var(--spacing-xs) var(--spacing-sm);
}

.col-actions {
  display: flex;
  gap: var(--spacing-xs);
}

.btn-icon {
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid var(--border);
  background-color: var(--bg);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-icon:hover {
  background-color: var(--bg-elev);
}

.btn-icon.btn-danger:hover {
  background-color: var(--danger);
  border-color: var(--danger);
  color: white;
}

.empty-state {
  padding: var(--spacing-xl);
  text-align: center;
  color: var(--muted);
}

.editor-footer {
  margin-top: var(--spacing-md);
  text-align: right;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.modal-content {
  background-color: var(--bg);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl);
  max-width: 500px;
  width: 90%;
  box-shadow: var(--shadow-lg);
}

.modal-content h3 {
  margin-bottom: var(--spacing-lg);
}

.modal-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  margin-top: var(--spacing-lg);
}

@media (max-width: 768px) {
  .editor-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .header-controls {
    flex-direction: column;
  }
  
  .search-input {
    max-width: none;
  }
  
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
  }
}
</style>
