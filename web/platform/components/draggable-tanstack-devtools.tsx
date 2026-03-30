import { TanStackDevtools } from '@tanstack/react-devtools';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import * as React from 'react';

const STORAGE_KEY = 'tanstack-devtools-position';
const SELECTOR = 'button[aria-label="Open TanStack Devtools"]';

function getStoredOffset(): { x: number; y: number } {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { x: 0, y: 0 };
}

export function DraggableTanStackDevtools() {
  React.useEffect(() => {
    let button: HTMLElement | null = null;
    const offset = getStoredOffset();

    const applyTransform = (transition = false) => {
      if (!button) return;
      button.style.transition = transition ? '' : 'none';
      button.style.transform = `translate(${offset.x}px, ${offset.y}px)`;
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 || !button) return;
      e.preventDefault();

      const startMouseX = e.clientX;
      const startMouseY = e.clientY;
      const startOffsetX = offset.x;
      const startOffsetY = offset.y;
      let dragging = false;

      document.body.style.userSelect = 'none';

      const onPointerMove = (e: PointerEvent) => {
        const dx = e.clientX - startMouseX;
        const dy = e.clientY - startMouseY;
        if (!dragging && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
          dragging = true;
          button!.style.cursor = 'grabbing';
        }
        if (dragging) {
          offset.x = startOffsetX + dx;
          offset.y = startOffsetY + dy;
          applyTransform(false);
        }
      };

      const onPointerUp = (e: PointerEvent) => {
        document.removeEventListener('pointermove', onPointerMove);
        document.removeEventListener('pointerup', onPointerUp);
        document.body.style.userSelect = '';
        if (button) button.style.cursor = 'grab';

        if (dragging) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify({ x: offset.x, y: offset.y }));
          applyTransform(false);
          // Swallow the click that fires after pointerup to prevent opening devtools
          const swallowClick = (ev: MouseEvent) => {
            ev.stopImmediatePropagation();
            ev.preventDefault();
            document.removeEventListener('click', swallowClick, true);
          };
          document.addEventListener('click', swallowClick, true);
        }
      };

      document.addEventListener('pointermove', onPointerMove);
      document.addEventListener('pointerup', onPointerUp);
    };

    const attachDrag = (el: HTMLElement) => {
      if (button === el) return;
      button = el;
      button.style.cursor = 'grab';
      button.addEventListener('pointerdown', onPointerDown);
      applyTransform(false);
    };

    const tryFind = () => {
      const el = document.querySelector<HTMLElement>(SELECTOR);
      if (el) attachDrag(el);
    };

    const observer = new MutationObserver(tryFind);
    observer.observe(document.body, { childList: true, subtree: true });
    tryFind();

    return () => {
      observer.disconnect();
      if (button) button.removeEventListener('pointerdown', onPointerDown);
    };
  }, []);

  return (
    <TanStackDevtools
      config={{ position: 'bottom-left' }}
      plugins={[
        {
          name: 'Tanstack Router',
          render: <TanStackRouterDevtoolsPanel />,
        },
      ]}
    />
  );
}
