<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useProducersStore } from '@/stores/producers'
import type { Producer } from '@/types/Producer'
import LoadingCircle from '@/components/LoadingCircle.vue'

const producersStore = useProducersStore()

// State for modal
const showModal = ref(false)
const isEditing = ref(false)
const currentProducer = ref<Partial<Producer>>({
  name: '',
  bornIn: '',
  moviesCount: 0
})

// Fetch data on component mount
onMounted(async () => {
  await producersStore.fetchAllProducers()
})

// Open modal for adding a new producer
const openAddModal = () => {
  isEditing.value = false
  currentProducer.value = {
    name: '',
    bornIn: '',
    moviesCount: 0
  }
  showModal.value = true
}

// Open modal for editing a producer
const openEditModal = (producer: Producer) => {
  isEditing.value = true
  currentProducer.value = { ...producer }
  showModal.value = true
}

// Save producer (add or update)
const saveProducer = async () => {
  if (!currentProducer.value.name || !currentProducer.value.bornIn) {
    alert('Please fill in all required fields')
    return
  }

  try {
    if (isEditing.value && currentProducer.value.id) {
      await producersStore.updateProducer(currentProducer.value.id, currentProducer.value)
    } else {
      await producersStore.addProducer(currentProducer.value as Omit<Producer, 'id'>)
    }
    showModal.value = false
    // Refresh the list
    await producersStore.fetchAllProducers()
  } catch (error) {
    console.error('Error saving producer:', error)
  }
}

// Delete a producer
const deleteProducer = async (id: string, moviesCount: number) => {
  // Find the producer in the list
  const producer = producersStore.producers.find(p => p.id === id);
  if (!producer) return;

  // Check if the producer has movies
  if (moviesCount > 0) {
    // Show a confirmation dialog with information about the movies that will be deleted
    const confirmMessage = `This producer has ${moviesCount} movie(s). Deleting this producer will also delete all associated movies. Are you sure you want to proceed?`;
    if (!confirm(confirmMessage)) {
      return; // User cancelled the deletion
    }
  } else {
    // Regular confirmation for producers without movies
    if (!confirm('Are you sure you want to delete this producer?')) {
      return; // User cancelled the deletion
    }
  }

  try {
    // Proceed with deletion
    await producersStore.deleteProducer(id);
    // Refresh the list
    await producersStore.fetchAllProducers();
  } catch (error: any) {
    console.error('Error deleting producer:', error);
    alert(`Error deleting producer: ${error.message || 'Unknown error'}`);
  }
}
</script>

<template>
  <div class="container mt-4">
    <h1 class="mb-4">Producers</h1>

    <!-- Add Button -->
    <div class="d-flex justify-content-end mb-3">
      <button class="btn btn-primary" @click="openAddModal">
        <i class="bi bi-plus-circle me-2"></i> Add Producer
      </button>
    </div>

    <!-- Loading indicator -->
    <div v-if="producersStore.loading" class="d-flex justify-content-center my-5">
      <LoadingCircle />
    </div>

    <!-- Error message -->
    <div v-else-if="producersStore.error" class="alert alert-danger">
      {{ producersStore.error }}
    </div>

    <!-- Producers table -->
    <div v-else-if="producersStore.producers.length > 0" class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>Name</th>
            <th>Born In</th>
            <th>Movies Count</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="producer in producersStore.producers" :key="producer.id">
            <td>{{ producer.name }}</td>
            <td>{{ producer.bornIn }}</td>
            <td>{{ producer.moviesCount }}</td>
            <td>
              <div class="btn-group">
                <button class="btn btn-sm btn-outline-primary" @click="openEditModal(producer)">
                  <i class="bi bi-pencil"></i> Edit
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="deleteProducer(producer.id, producer.moviesCount)">
                  <i class="bi bi-trash"></i> Delete
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty state -->
    <div v-else class="alert alert-info">
      No producers found. Add a new producer to get started.
    </div>

    <!-- Modal for Add/Edit -->
    <div class="modal fade" :class="{ 'show d-block': showModal }" tabindex="-1"
         :style="{ display: showModal ? 'block' : 'none' }">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? 'Edit Producer' : 'Add New Producer' }}</h5>
            <button type="button" class="btn-close" @click="showModal = false"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveProducer">
              <div class="mb-3">
                <label for="producerName" class="form-label">Producer Name</label>
                <input type="text" class="form-control" id="producerName" v-model="currentProducer.name" required>
              </div>
              <div class="mb-3">
                <label for="bornIn" class="form-label">Born In</label>
                <input type="text" class="form-control" id="bornIn" v-model="currentProducer.bornIn" required>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showModal = false">Cancel</button>
            <button type="button" class="btn btn-primary" @click="saveProducer">Save</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal backdrop -->
    <div class="modal-backdrop fade show" v-if="showModal"></div>
  </div>
</template>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
