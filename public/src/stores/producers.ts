import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Producer } from '@/types/Producer'
import type { Movie } from '@/types/Movie'
import { ApiWrapper } from '@/composables/ApiWrapper'
import { useMoviesStore } from './movies'

export const useProducersStore = defineStore('producers', () => {
  const producers = ref<Producer[]>([])
  const currentProducer = ref<Producer | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Get all producers
  async function fetchAllProducers() {
    loading.value = true
    error.value = null
    try {
      const response = await ApiWrapper.get<Producer[]>('/api/producers', {})
      producers.value = response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch producers'
      console.error('Error fetching producers:', err)
    } finally {
      loading.value = false
    }
  }

  // Get producer by ID
  async function fetchProducerById(id: string) {
    loading.value = true
    error.value = null
    try {
      const response = await ApiWrapper.get<Producer>(`/api/producers/${id}`, {})
      currentProducer.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message || `Failed to fetch producer with ID ${id}`
      console.error(`Error fetching producer with ID ${id}:`, err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Get producer's movies
  async function fetchProducerMovies(id: string) {
    loading.value = true
    error.value = null
    try {
      const response = await ApiWrapper.get<Movie[]>(`/api/producers/${id}/movies`, {})
      return response.data
    } catch (err: any) {
      error.value = err.message || `Failed to fetch movies for producer ${id}`
      console.error(`Error fetching movies for producer ${id}:`, err)
      return []
    } finally {
      loading.value = false
    }
  }

  // Add new producer
  async function addProducer(producerData: Omit<Producer, 'id'>) {
    loading.value = true
    error.value = null
    try {
      const response = await ApiWrapper.post<Producer>('/api/producers/addProd', producerData)
      producers.value.push(response.data)
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to add producer'
      console.error('Error adding producer:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Update producer
  async function updateProducer(id: string, producerData: Partial<Producer>) {
    loading.value = true
    error.value = null
    try {
      const response = await ApiWrapper.patch<Producer>(`/api/producers/${id}`, producerData)

      // Update the producer in the producers array
      const index = producers.value.findIndex(producer => producer.id === id)
      if (index !== -1) {
        producers.value[index] = response.data
      }

      // Update currentProducer if it's the same producer
      if (currentProducer.value && currentProducer.value.id === id) {
        currentProducer.value = response.data
      }

      return response.data
    } catch (err: any) {
      error.value = err.message || `Failed to update producer with ID ${id}`
      console.error(`Error updating producer with ID ${id}:`, err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Delete producer
  async function deleteProducer(id: string) {
    loading.value = true
    error.value = null
    try {
      // Get the response from the API which includes information about deleted movies
      const response = await ApiWrapper.delete<{ message: string, deletedMoviesCount: number }>(`/api/producers/${id}`, {})

      console.log('Producer deletion response:', response.data)

      // If movies were deleted along with the producer, refresh the movies store
      if (response.data.deletedMoviesCount > 0) {
        // Get the movies store and refresh the movies list
        const moviesStore = useMoviesStore()
        await moviesStore.fetchAllMovies()
      }

      // Remove the producer from the producers array
      producers.value = producers.value.filter(producer => producer.id !== id)

      // Clear currentProducer if it's the same producer
      if (currentProducer.value && currentProducer.value.id === id) {
        currentProducer.value = null
      }

      return true
    } catch (err: any) {
      error.value = err.message || `Failed to delete producer with ID ${id}`
      console.error(`Error deleting producer with ID ${id}:`, err)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    producers,
    currentProducer,
    loading,
    error,
    fetchAllProducers,
    fetchProducerById,
    fetchProducerMovies,
    addProducer,
    updateProducer,
    deleteProducer
  }
})
