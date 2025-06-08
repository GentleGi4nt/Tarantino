<template>
  <v-container>
    <h1>Filmliste</h1>
    <v-btn color="primary" @click="showAddDialog = true">Neuen Eintrag hinzufügen</v-btn>
    <data-table
      :items="items"
      :headers="tableHeaders"
      @edit="onEdit"
      @delete="onDelete"
    />
    <v-dialog v-model="showAddDialog" max-width="500">
      <v-card>
        <v-card-title>Neuer Eintrag</v-card-title>
        <v-card-text>
          <v-text-field v-model="newItem.title" label="Filmtitel" />
          <v-text-field v-model="newItem.director" label="Regie" />
          <v-text-field v-model="newItem.actors" label="Schauspieler" />
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
          <v-text-field v-model="editItemData.title" label="Filmtitel" />
          <v-text-field v-model="editItemData.director" label="Regie" />
          <v-text-field v-model="editItemData.actors" label="Schauspieler" />
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
import { getAllMovies, addMovie, updateMovie, deleteMovie } from '@/db/indexedDb.js'

const items = ref([])
const showAddDialog = ref(false)
const showEditDialog = ref(false)
const newItem = ref({ title: '', director: '', actors: '' })
const editItemData = ref({ id: null, title: '', director: '', actors: '' })

const tableHeaders = [
  { text: 'Filmtitel', value: 'title' },
  { text: 'Regie', value: 'director' },
  { text: 'Schauspieler', value: 'actors' },
  { text: 'Actions', value: 'actions', sortable: false }
]

async function loadItems() {
  items.value = await getAllMovies()
}

async function addNewItem() {
  if (!newItem.value.title) return
  // Schauspieler als Array speichern!
  const actorsArray = newItem.value.actors
    ? newItem.value.actors.split(',').map(a => a.trim()).filter(Boolean)
    : []
  await addMovie({ ...newItem.value, actors: actorsArray })
  newItem.value = { title: '', director: '', actors: '' }
  showAddDialog.value = false
  await loadItems()
}

function onEdit(item) {
  editItemData.value = { ...item }
  showEditDialog.value = true
}

async function saveEditItem() {
  // Schauspieler als Array speichern!
  const actorsArray = editItemData.value.actors
    ? editItemData.value.actors.split(',').map(a => a.trim()).filter(Boolean)
    : []
  await updateMovie({ ...editItemData.value, actors: actorsArray })
  showEditDialog.value = false
  await loadItems()
}

async function onDelete(id) {
  await deleteMovie(id)
  await loadItems()
}

onMounted(loadItems)
</script>

<style scoped>
h1 {
  margin-bottom: 16px;
}

.v-container {
  margin-top: 32px;
}
</style>