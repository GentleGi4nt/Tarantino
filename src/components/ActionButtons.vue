<template>
  <div>
    <v-btn color="primary" @click="$emit('edit')">Edit</v-btn>
    <v-btn color="red" @click="$emit('delete')">Delete</v-btn>
  </div>
</template>

<script>
export default {
  name: 'ActionButtons'
}
</script>

<style scoped>
.v-btn {
  margin-right: 8px;
}
</style>