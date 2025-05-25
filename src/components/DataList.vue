<template>
  <v-container>
    <v-card>
      <v-card-title>Data List</v-card-title>
      <v-list>
        <v-list-item-group>
          <v-list-item
            v-for="item in items"
            :key="item.id"
          >
            <v-list-item-content>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
              <v-list-item-subtitle>{{ item.description }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <ActionButtons @edit="editItem(item)" @delete="deleteItem(item.id)" />
            </v-list-item-action>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
  </v-container>
</template>

<script>
import ActionButtons from './ActionButtons.vue'

export default {
  name: 'DataList',
  components: {
    ActionButtons
  },
  props: {
    items: {
      type: Array,
      required: true
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
/* Add any specific styles for DataList component here */
</style>