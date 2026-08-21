// Josh Comeau-style repeat-tappable likes. Visitors are identified server-side by an IP
// hash, so there's nothing here to auth — just optimistic UI over GET/POST /api/likes/:slug.

type LikeAction = 'add' | 'remove';

interface LikesResponse {
  totalLikes: number;
  userLikes: number;
  remainingLikes: number;
  maxLikes: number;
}

export function useBlogLikes(slug: MaybeRefOrGetter<string>) {
  // "confirmed*" is the last state the server told us about. Displayed values layer any
  // not-yet-settled optimistic taps on top, so a burst of clicks never has to guess what
  // the "previous state" was to roll back to — it just drops its own delta.
  const confirmedTotal = ref(0);
  const confirmedUser = ref(0);
  const maxLikes = ref(10);
  const pendingDeltas = ref<number[]>([]);

  const ready = ref(false);
  const unavailable = ref(false);
  const pending = ref(false);
  const error = ref<string | null>(null);
  let errorTimer: ReturnType<typeof setTimeout> | null = null;

  const netDelta = computed(() => pendingDeltas.value.reduce((sum, d) => sum + d, 0));
  const totalLikes = computed(() => confirmedTotal.value + netDelta.value);
  const userLikes = computed(() => confirmedUser.value + netDelta.value);
  const remainingLikes = computed(() => Math.max(0, maxLikes.value - userLikes.value));
  // Counts pending taps, not just server-confirmed ones -- otherwise a burst of clicks
  // would each pass the guard before any of them settled and blow through the cap.
  const atLimit = computed(() => userLikes.value >= maxLikes.value);
  const canLike = computed(() => ready.value && !unavailable.value && !atLimit.value);
  const canUnlike = computed(() => ready.value && !unavailable.value && userLikes.value > 0);

  function applyServerState(data: LikesResponse) {
    confirmedTotal.value = data.totalLikes;
    confirmedUser.value = data.userLikes;
    maxLikes.value = data.maxLikes;
  }

  function showError(message: string) {
    error.value = message;
    if (errorTimer) clearTimeout(errorTimer);
    errorTimer = setTimeout(() => (error.value = null), 4000);
  }

  function messageFor(err: unknown, action: LikeAction): string {
    const status =
      (err as { response?: { status?: number }; statusCode?: number })?.response?.status ??
      (err as { statusCode?: number })?.statusCode;
    if (status === 409) {
      return action === 'add' ? "You've hit the 10-like limit on this post." : 'Nothing left to remove.';
    }
    if (status === 503) return 'Likes are temporarily unavailable — try again later.';
    if (status === 400) return 'That like got lost — please try again.';
    return 'Something went wrong. Please try again.';
  }

  // One in-flight POST at a time, in click order, so the server never sees requests that
  // race each other. Deltas already queued behind the current one stay visible on screen
  // (that's the "fun mashing" part) and only get flushed when their own request settles.
  const queue: LikeAction[] = [];
  let processing = false;

  async function processQueue() {
    if (processing) return;
    processing = true;
    pending.value = true;
    while (queue.length) {
      const action = queue[0]!;
      try {
        const data = await $fetch<LikesResponse>(`/api/likes/${toValue(slug)}`, {
          method: 'POST',
          body: { action },
        });
        applyServerState(data);
      } catch (err) {
        showError(messageFor(err, action));
      } finally {
        // Whether it succeeded or failed, this click's optimistic delta is resolved:
        // on success it's now baked into confirmed*, on failure it's simply dropped.
        queue.shift();
        pendingDeltas.value = pendingDeltas.value.slice(1);
      }
    }
    pending.value = false;
    processing = false;
  }

  function enqueue(action: LikeAction) {
    if (unavailable.value) return;
    // Hard block, not just a disabled attribute: the button being disabled is a UI hint a
    // determined caller can bypass, so refuse the enqueue outright at the cap/floor. The
    // server enforces this too (409 + a SQL-side clamp); this keeps the UI honest.
    if (action === 'add' && !canLike.value) return;
    if (action === 'remove' && !canUnlike.value) return;

    pendingDeltas.value = [...pendingDeltas.value, action === 'add' ? 1 : -1];
    queue.push(action);
    void processQueue();
  }

  function addLike() {
    enqueue('add');
  }

  function removeLike() {
    enqueue('remove');
  }

  onMounted(async () => {
    try {
      const data = await $fetch<LikesResponse>(`/api/likes/${toValue(slug)}`);
      applyServerState(data);
    } catch {
      // Prerendered site must still render fine without a working widget (e.g. DB down).
      unavailable.value = true;
    } finally {
      ready.value = true;
    }
  });

  onBeforeUnmount(() => {
    if (errorTimer) clearTimeout(errorTimer);
  });

  return {
    totalLikes,
    userLikes,
    remainingLikes,
    maxLikes,
    canLike,
    canUnlike,
    atLimit,
    ready,
    unavailable,
    pending,
    error,
    addLike,
    removeLike,
  };
}
