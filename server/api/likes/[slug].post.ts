import { eq, sum, and } from 'drizzle-orm'
import { postLikes } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
  const body = await readBody(event)
  
  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Post slug is required'
    })
  }

  const { action } = body // 'add' or 'remove'
  
  if (!action || !['add', 'remove'].includes(action)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Action must be "add" or "remove"'
    })
  }

  try {
    const db = getDatabase()
    const clientIP = getClientIPFromEvent(event)
    const userHash = hashIP(clientIP)

    // Get current user's likes for this post
    const existingLikesResult = await db
      .select({ 
        likeCount: postLikes.likeCount 
      })
      .from(postLikes)
      .where(
        and(
          eq(postLikes.postSlug, slug),
          eq(postLikes.userHash, userHash)
        )
      )
      .limit(1)

    const currentLikes = existingLikesResult[0]?.likeCount || 0
    let newLikeCount: number

    if (action === 'add') {
      // Check if user has reached the limit
      if (currentLikes >= 10) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Maximum likes per post reached (10)'
        })
      }
      newLikeCount = currentLikes + 1
    } else { // action === 'remove'
      if (currentLikes <= 0) {
        throw createError({
          statusCode: 400,
          statusMessage: 'No likes to remove'
        })
      }
      newLikeCount = currentLikes - 1
    }

    // Upsert the like count using Drizzle's conflict resolution
    await db
      .insert(postLikes)
      .values({
        postSlug: slug,
        userHash: userHash,
        likeCount: newLikeCount,
        updatedAt: new Date()
      })
      .onConflictDoUpdate({
        target: [postLikes.postSlug, postLikes.userHash],
        set: {
          likeCount: newLikeCount,
          updatedAt: new Date()
        }
      })

    // Fetch updated totals
    const totalLikesResult = await db
      .select({ 
        totalLikes: sum(postLikes.likeCount) 
      })
      .from(postLikes)
      .where(eq(postLikes.postSlug, slug))
    
    const totalLikes = Number(totalLikesResult[0]?.totalLikes) || 0
    const remainingLikes = Math.max(0, 10 - newLikeCount)

    return {
      success: true,
      totalLikes,
      userLikes: newLikeCount,
      remainingLikes,
      canLike: remainingLikes > 0,
      action
    }
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }
    
    console.error('Unexpected error updating likes:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})