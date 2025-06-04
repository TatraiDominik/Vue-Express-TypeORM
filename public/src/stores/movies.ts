import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Movie } from '@/types/Movie'
import { ApiWrapper } from '@/composables/ApiWrapper'

export const useMoviesStore = defineStore('movies', () => {
  const movies = ref<Movie[]>([])
  const currentMovie = ref<Movie | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Get all movies
  async function fetchAllMovies() {
    loading.value = true
    error.value = null
    try {
      const response = await ApiWrapper.get<Movie[]>('/api/movies', {})
      movies.value = response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to fetch movies'
      console.error('Error fetching movies:', err)
    } finally {
      loading.value = false
    }
  }

  // Get movie by ID
  async function fetchMovieById(id: string) {
    loading.value = true
    error.value = null
    try {
      const response = await ApiWrapper.get<Movie>(`/api/movies/${id}`, {})
      currentMovie.value = response.data
      return response.data
    } catch (err: any) {
      error.value = err.message || `Failed to fetch movie with ID ${id}`
      console.error(`Error fetching movie with ID ${id}:`, err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Get movies by producer
  async function fetchMoviesByProducer(producerId: string) {
    loading.value = true
    error.value = null
    try {
      const response = await ApiWrapper.get<Movie[]>(`/api/movies/producer/${producerId}`, {})
      return response.data
    } catch (err: any) {
      error.value = err.message || `Failed to fetch movies for producer ${producerId}`
      console.error(`Error fetching movies for producer ${producerId}:`, err)
      return []
    } finally {
      loading.value = false
    }
  }

  // Add new movie
  async function addMovie(movieData: Omit<Movie, 'id'>) {
    loading.value = true
    error.value = null
    try {
      // Check if producer exists and has an id
      if (!movieData.producer || typeof movieData.producer !== 'object') {
        throw new Error('Producer is required')
      }

      // Extract producerId from the producer object
      const producerId = movieData.producer.id

      if (!producerId) {
        throw new Error('Producer ID is required')
      }

      // Create a new object with the producerId instead of the producer object
      const movieDataForApi = {
        name: movieData.name,
        madeIn: movieData.madeIn,
        cost: movieData.cost,
        producerId: producerId
      }

      console.log('Sending movie data to API:', movieDataForApi)

      const response = await ApiWrapper.post<Movie>('/api/movies', movieDataForApi)
      movies.value.push(response.data)
      return response.data
    } catch (err: any) {
      error.value = err.message || 'Failed to add movie'
      console.error('Error adding movie:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Update movie
  async function updateMovie(id: string, movieData: Partial<Movie>) {
    loading.value = true
    error.value = null
    try {
      // Create a new object with the producerId instead of the producer object if producer is provided
      const movieDataForApi: any = { ...movieData }

      // If producer is provided, extract the producerId
      if (movieData.producer) {
        if (typeof movieData.producer !== 'object' || !movieData.producer.id) {
          throw new Error('Producer ID is required')
        }
        movieDataForApi.producerId = movieData.producer.id
        delete movieDataForApi.producer // Remove the producer object
      }

      console.log('Sending movie update data to API:', movieDataForApi)

      const response = await ApiWrapper.patch<Movie>(`/api/movies/${id}`, movieDataForApi)

      // Update the movie in the movies array
      const index = movies.value.findIndex(movie => movie.id === id)
      if (index !== -1) {
        movies.value[index] = response.data
      }

      // Update currentMovie if it's the same movie
      if (currentMovie.value && currentMovie.value.id === id) {
        currentMovie.value = response.data
      }

      return response.data
    } catch (err: any) {
      error.value = err.message || `Failed to update movie with ID ${id}`
      console.error(`Error updating movie with ID ${id}:`, err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Delete movie
  async function deleteMovie(id: string) {
    loading.value = true
    error.value = null
    try {
      await ApiWrapper.delete(`/api/movies/${id}`, {})

      // Remove the movie from the movies array
      movies.value = movies.value.filter(movie => movie.id !== id)

      // Clear currentMovie if it's the same movie
      if (currentMovie.value && currentMovie.value.id === id) {
        currentMovie.value = null
      }

      return true
    } catch (err: any) {
      error.value = err.message || `Failed to delete movie with ID ${id}`
      console.error(`Error deleting movie with ID ${id}:`, err)
      return false
    } finally {
      loading.value = false
    }
  }

  return {
    movies,
    currentMovie,
    loading,
    error,
    fetchAllMovies,
    fetchMovieById,
    fetchMoviesByProducer,
    addMovie,
    updateMovie,
    deleteMovie
  }
})
