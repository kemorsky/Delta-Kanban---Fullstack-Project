import { MouseSensor } from '@dnd-kit/core';

export class CustomMouseSensor extends MouseSensor {
  // We override the activators array with a type-safe handler
  static activators = [
    {
      eventName: 'onMouseDown' as const,
      handler: ({ nativeEvent }: { nativeEvent: MouseEvent }) => {
        const target = nativeEvent.target as HTMLElement;

        // Skip drag if inside input, textarea, or any contentEditable
        return !(
          target.closest('input, textarea, [contenteditable="true"]')
        );
      },
    },
  ];
}
