<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useMoviesStore } from '@/stores/movies'
import { useProducersStore } from '@/stores/producers'
import type { Movie } from '@/types/Movie'
import type { Producer } from '@/types/Producer'
import LoadingCircle from '@/components/LoadingCircle.vue'

const moviesStore = useMoviesStore()
const producersStore = useProducersStore()

// State for modal
const showModal = ref(false)
const isEditing = ref(false)
const currentMovie = ref<Partial<Movie>>({
  name: '',
  madeIn: '',
  cost: 0,
  producer: undefined
})

// Fetch data on component mount
onMounted(async () => {
  await moviesStore.fetchAllMovies()
  await producersStore.fetchAllProducers()
})

// Open modal for adding a new movie
const openAddModal = () => {
  isEditing.value = false
  currentMovie.value = {
    name: '',
    madeIn: '',
    cost: 0,
    producer: undefined
  }
  showModal.value = true
}

// Open modal for editing a movie
const openEditModal = (movie: Movie) => {
  isEditing.value = true
  currentMovie.value = { ...movie }
  showModal.value = true
}

// Save movie (add or update)
const saveMovie = async () => {
  // Validate required fields
  if (!currentMovie.value.name || !currentMovie.value.madeIn || currentMovie.value.cost === undefined) {
    alert('Please fill in all required fields')
    return
  }

  // Validate producer selection
  if (!currentMovie.value.producer || typeof currentMovie.value.producer !== 'object' || !currentMovie.value.producer.id) {
    alert('Please select a valid producer')
    return
  }

  try {
    if (isEditing.value && currentMovie.value.id) {
      await moviesStore.updateMovie(currentMovie.value.id, currentMovie.value)
    } else {
      await moviesStore.addMovie(currentMovie.value as Omit<Movie, 'id'>)
    }
    showModal.value = false
    // Refresh the list
    await moviesStore.fetchAllMovies()
  } catch (error: any) {
    console.error('Error saving movie:', error)
    alert(`Error saving movie: ${error.message || 'Unknown error'}`)
  }
}

// Delete a movie
const deleteMovie = async (id: string) => {
  if (confirm('Are you sure you want to delete this movie?')) {
    await moviesStore.deleteMovie(id)
    // Refresh the list
    await moviesStore.fetchAllMovies()
  }
}
</script>

<template>
  <div class="container mt-4">
    <h1 class="mb-4">Movies</h1>

    <!-- Add Button -->
    <div class="d-flex justify-content-end mb-3">
      <button class="btn btn-primary" @click="openAddModal">
        <i class="bi bi-plus-circle me-2"></i> Add Movie
      </button>
    </div>

    <!-- Loading indicator -->
    <div v-if="moviesStore.loading" class="d-flex justify-content-center my-5">
      <LoadingCircle />
    </div>

    <!-- Error message -->
    <div v-else-if="moviesStore.error" class="alert alert-danger">
      {{ moviesStore.error }}
    </div>

    <!-- Movies table -->
    <div v-else-if="moviesStore.movies.length > 0" class="table-responsive">
      <table class="table table-striped table-hover">
        <thead class="table-dark">
          <tr>
            <th>Name</th>
            <th>Made In</th>
            <th>Producer</th>
            <th>Cost</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="movie in moviesStore.movies" :key="movie.id">
            <td>{{ movie.name }}</td>
            <td>{{ movie.madeIn }}</td>
            <td>{{ movie.producer?.name }}</td>
            <td>{{ movie.cost }}</td>
            <td>
              <div class="btn-group">
                <button class="btn btn-sm btn-outline-primary" @click="openEditModal(movie)">
                  <i class="bi bi-pencil"></i> Edit
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="deleteMovie(movie.id)">
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
      No movies found. Add a new movie to get started.
    </div>

    <!-- Modal for Add/Edit -->
    <div class="modal fade" :class="{ 'show d-block': showModal }" tabindex="-1"
         :style="{ display: showModal ? 'block' : 'none' }">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ isEditing ? 'Edit Movie' : 'Add New Movie' }}</h5>
            <button type="button" class="btn-close" @click="showModal = false"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveMovie">
              <div class="mb-3">
                <label for="movieName" class="form-label">Movie Name</label>
                <input type="text" class="form-control" id="movieName" v-model="currentMovie.name" required>
              </div>
              <div class="mb-3">
                <label for="madeIn" class="form-label">Made In</label>
                <input type="text" class="form-control" id="madeIn" v-model="currentMovie.madeIn" required>
              </div>
              <div class="mb-3">
                <label for="cost" class="form-label">Cost</label>
                <input type="number" class="form-control" id="cost" v-model="currentMovie.cost" required>
              </div>
              <div class="mb-3">
                <label for="producer" class="form-label">Producer</label>
                <select class="form-select" id="producer" v-model="currentMovie.producer" required>
                  <option :value="undefined" disabled>Select a producer</option>
                  <option v-for="producer in producersStore.producers" :key="producer.id" :value="producer">
                    {{ producer.name }} (ID: {{ producer.id }})
                  </option>
                </select>
                <div class="form-text text-muted" v-if="currentMovie.producer">
                  Selected producer: {{ currentMovie.producer.name }} (ID: {{ currentMovie.producer.id }})
                </div>
                <div class="form-text text-danger" v-if="!currentMovie.producer">
                  Please select a producer
                </div>
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="showModal = false">Cancel</button>
            <button type="button" class="btn btn-primary" @click="saveMovie">Save</button>
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
