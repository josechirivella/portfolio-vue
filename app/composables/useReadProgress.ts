export function useReadProgress() {
  const readProgress = ref(0);
  let rafId: number | null = null;

  function updateReadProgress(): void {
    if (rafId !== null) return;
    rafId = requestAnimationFrame(() => {
      const total = document.body.clientHeight - document.documentElement.clientHeight;
      readProgress.value = (window.scrollY / total) * 100;
      rafId = null;
    });
  }

  onMounted(() => window.addEventListener('scroll', updateReadProgress, { passive: true }));
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', updateReadProgress);
    if (rafId !== null) cancelAnimationFrame(rafId);
  });

  return { readProgress };
}
