<template>
  <v-container>
    <v-card class="mt-4">
      <v-card-title>Liste von Einträgen</v-card-title>
      <v-data-table
        :headers="[
          { text: 'Filmtitel', value: 'title' },
          { text: 'Regie', value: 'director' },
          { text: 'Schauspieler', value: 'actors' },
          { text: 'Aktionen', value: 'actions', sortable: false }
        ]"
        :items="items"
        item-value="id"
        class="elevation-2"
        hide-default-footer
      >
        <template #item.title="{ item }">
          {{ item.title || '-' }}
        </template>
        <template #item.director="{ item }">
          {{ item.director || '-' }}
        </template>
        <template #item.actors="{ item }">
          <span v-if="Array.isArray(item.actors) && item.actors.length">
            {{ item.actors.join(', ') }}
          </span>
          <span v-else>-</span>
        </template>
        <template #item.actions="{ item }">
          <ActionButtons
            @edit="editItem(item)"
            @delete="deleteItem(item.id)"
          />
        </template>
        <template #header.title>
          Filmtitel
        </template>
        <template #header.director>
          Regie
        </template>
        <template #header.actors>
          Schauspieler
        </template>
                <template #no-data>
          <div style="text-align:center; padding: 2rem;">Keine Einträge vorhanden</div>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import ActionButtons from './ActionButtons.vue'

export default {
  name: 'DataTable',
  components: { ActionButtons },
  props: {
    items: { type: Array, required: true },
    headers: { type: Array, required: true }
  },
  mounted() {
    console.log('Headers:', this.headers)
  },
  methods: {
    editItem(item) {
      this.$emit('edit', item)
    },
    deleteItem(id) {
      this.$emit('delete', id)
    }
  }
}
</script>

<style scoped>
.v-card {
  margin-top: 24px;
  padding-bottom: 16px;
}
.v-data-table {
  border-radius: 8px;
  overflow: hidden;
}
.custom-table-header {
  display: flex;
  font-weight: bold;
  padding: 12px 16px 4px 16px;
  gap: 16px;
}
.custom-table-header span {
  flex: 1 1 0;
}
::v-deep th {
  display: table-cell !important;
  color: #222 !important;
  background: #f5f5f5 !important;
  font-weight: bold !important;
}
</style>