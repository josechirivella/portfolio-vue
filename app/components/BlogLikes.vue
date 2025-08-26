<template>
  <div class="blog-likes-container bg-zinc-50 dark:bg-zinc-900 rounded-lg p-6 border border-zinc-200 dark:border-zinc-700">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <Icon name="fa6-regular:heart" class="text-red-500 text-lg" />
        <span class="text-sm text-zinc-600 dark:text-zinc-400">
          {{ totalLikes }} {{ totalLikes === 1 ? 'like' : 'likes' }}
        </span>
      </div>
      
      <div class="flex items-center space-x-3">
        <div v-if="userLikes > 0" class="text-sm text-zinc-500 dark:text-zinc-400">
          You've liked this {{ userLikes }} {{ userLikes === 1 ? 'time' : 'times' }}
        </div>
        
        <div class="flex space-x-2">
          <Button 
            :disabled="isLoading || userLikes === 0"
            size="small"
            severity="secondary"
            :class="{
              'opacity-50 cursor-not-allowed': userLikes === 0
            }"
            @click="removeLike"
          >
            <Icon name="fa6-regular:minus" class="mr-1" />
            Unlike
          </Button>
          
          <Button 
            :disabled="isLoading || !canLike"
            size="small"
            :class="{
              'opacity-50 cursor-not-allowed': !canLike,
              'animate-pulse': isLoading
            }"
            @click="addLike"
          >
            <Icon name="fa6-regular:plus" class="mr-1" />
            Like
          </Button>
        </div>
      </div>
    </div>
    
    <div v-if="remainingLikes === 0 && canLike === false" class="mt-3 text-xs text-amber-600 dark:text-amber-400">
      You've reached the maximum of 10 likes for this post
    </div>
    <div v-else-if="remainingLikes <= 3 && remainingLikes > 0" class="mt-3 text-xs text-zinc-500 dark:text-zinc-400">
      {{ remainingLikes }} {{ remainingLikes === 1 ? 'like' : 'likes' }} remaining
    </div>

    <!-- Error message -->
    <div v-if="error" class="mt-3 text-xs text-red-600 dark:text-red-400">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
interface LikeData {
  totalLikes: number
  userLikes: number
  remainingLikes: number
  canLike: boolean
}

interface Props {
  slug: string
}

const props = defineProps<Props>()

// Reactive state
const totalLikes = ref(0)
const userLikes = ref(0)
const remainingLikes = ref(10)
const canLike = ref(true)
const isLoading = ref(false)
const error = ref('')

// Fetch initial like data
const { data: initialData, error: fetchError } = await $fetch<LikeData>(`/api/likes/${props.slug}`)
  .catch(err => ({ data: null, error: err.message }))

if (fetchError) {
  error.value = 'Failed to load likes'
} else if (initialData) {
  totalLikes.value = initialData.totalLikes
  userLikes.value = initialData.userLikes
  remainingLikes.value = initialData.remainingLikes
  canLike.value = initialData.canLike
}

// Add like function with optimistic updates
const addLike = async () => {
  if (isLoading.value || !canLike.value) return

  // Optimistic update
  const previousState = {
    totalLikes: totalLikes.value,
    userLikes: userLikes.value,
    remainingLikes: remainingLikes.value,
    canLike: canLike.value
  }

  totalLikes.value++
  userLikes.value++
  remainingLikes.value--
  canLike.value = remainingLikes.value > 0
  isLoading.value = true
  error.value = ''

  try {
    const response = await $fetch<LikeData & { success: boolean, action: string }>(`/api/likes/${props.slug}`, {
      method: 'POST',
      body: { action: 'add' }
    })

    if (response.success) {
      // Update with server response
      totalLikes.value = response.totalLikes
      userLikes.value = response.userLikes
      remainingLikes.value = response.remainingLikes
      canLike.value = response.canLike
    } else {
      throw new Error('Server returned unsuccessful response')
    }
  } catch (err: unknown) {
    // Revert optimistic update on error
    totalLikes.value = previousState.totalLikes
    userLikes.value = previousState.userLikes
    remainingLikes.value = previousState.remainingLikes
    canLike.value = previousState.canLike
    error.value = (err as Error)?.message || 'Failed to add like'
  } finally {
    isLoading.value = false
  }
}

// Remove like function with optimistic updates
const removeLike = async () => {
  if (isLoading.value || userLikes.value === 0) return

  // Optimistic update
  const previousState = {
    totalLikes: totalLikes.value,
    userLikes: userLikes.value,
    remainingLikes: remainingLikes.value,
    canLike: canLike.value
  }

  totalLikes.value--
  userLikes.value--
  remainingLikes.value++
  canLike.value = true
  isLoading.value = true
  error.value = ''

  try {
    const response = await $fetch<LikeData & { success: boolean, action: string }>(`/api/likes/${props.slug}`, {
      method: 'POST',
      body: { action: 'remove' }
    })

    if (response.success) {
      // Update with server response
      totalLikes.value = response.totalLikes
      userLikes.value = response.userLikes
      remainingLikes.value = response.remainingLikes
      canLike.value = response.canLike
    } else {
      throw new Error('Server returned unsuccessful response')
    }
  } catch (err: unknown) {
    // Revert optimistic update on error
    totalLikes.value = previousState.totalLikes
    userLikes.value = previousState.userLikes
    remainingLikes.value = previousState.remainingLikes
    canLike.value = previousState.canLike
    error.value = (err as Error)?.message || 'Failed to remove like'
  } finally {
    isLoading.value = false
  }
}

// Clear error message after 5 seconds
watch(error, (newError) => {
  if (newError) {
    setTimeout(() => {
      if (error.value === newError) {
        error.value = ''
      }
    }, 5000)
  }
})
</script>

<style scoped>
.blog-likes-container {
  transition: all 0.2s ease-in-out;
}

.blog-likes-container:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.dark .blog-likes-container:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}
</style>