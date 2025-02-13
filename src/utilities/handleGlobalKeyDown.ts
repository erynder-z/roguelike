/**
 * Handles global keydown events, preventing default behavior for the Escape key. This is intended to prevent exiting fullscreen mode when pressing Esc on macOS.
 *
 * @param {KeyboardEvent} event - The keyboard event to handle.
 */
export const handleGlobalKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' || event?.altKey || event?.metaKey)
    event.preventDefault();
};
