<template>
  <v-container>
    <h1>Dashboard</h1>
    <v-btn color="primary" @click="showAddDialog = true">Neuen Eintrag hinzufügen</v-btn>
    <data-table
      :items="items"
      @edit="onEdit"
      @delete="onDelete"
    />
    <v-dialog v-model="showAddDialog" max-width="500">
      <v-card>
        <v-card-title>Neuer Eintrag</v-card-title>
        <v-card-text>
          <v-text-field v-model="newItem.name" label="Name" />
          <v-text-field v-model="newItem.description" label="Beschreibung" />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="addNewItem">Speichern</v-btn>
          <v-btn @click="showAddDialog = false">Abbrechen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="showEditDialog" max-width="500">
      <v-card>
        <v-card-title>Eintrag bearbeiten</v-card-title>
        <v-card-text>
          <v-text-field v-model="editItemData.name" label="Name" />
          <v-text-field v-model="editItemData.description" label="Beschreibung" />
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="saveEditItem">Speichern</v-btn>
          <v-btn @click="showEditDialog = false">Abbrechen</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DataTable from '@/components/DataTable.vue'
import { getAllItems, addItem, updateItem, deleteItem } from '@/db/indexedDb.js'

const items = ref([])
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const newItem = ref({ name: '', description: '' })
const editItemData = ref({ id: null, name: '', description: '' })

async function loadItems() {
  items.value = await getAllItems()
}

async function addNewItem() {
  if (!newItem.value.name) return
  await addItem({ ...newItem.value })
  newItem.value = { name: '', description: '' }
  showAddDialog.value = false
  await loadItems()
}

function onEdit(item) {
  editItemData.value = { ...item }
  showEditDialog.value = true
}

async function saveEditItem() {
  await updateItem(editItemData.value)
  showEditDialog.value = false
  await loadItems()
}

async function onDelete(id) {
  await deleteItem(id)
  await loadItems()
}

onMounted(loadItems)
</script>

<style scoped>
h1 {
  margin-bottom: 16px;
}
</style>