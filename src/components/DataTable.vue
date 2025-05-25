<template>
  <v-container>
    <v-card>
      <v-card-title>Data Table</v-card-title>
      <v-data-table
        :headers="headers"
        :items="items"
        item-value="id"
        class="elevation-1"
      >
        <template #item.actions="{ item }">
          <action-buttons @edit="editItem(item)" @delete="deleteItem(item.id)" />
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import ActionButtons from './ActionButtons.vue'

export default {
  name: 'DataTable',
  components: {
    ActionButtons
  },
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      headers: [
        { text: 'ID', value: 'id' },
        { text: 'Name', value: 'name' },
        { text: 'Description', value: 'description' },
        { text: 'Actions', value: 'actions', sortable: false }
      ]
    }
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
/* Add any specific styles for the DataTable component here */
</style>