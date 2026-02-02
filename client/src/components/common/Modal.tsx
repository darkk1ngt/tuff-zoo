import { createEffect, type JSX, onCleanup, Show } from "solid-js";
import { Portal } from "solid-js/web";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: JSX.Element;
  footer?: JSX.Element;
}

export function Modal(props: ModalProps) {
  // Handle escape key
  createEffect(() => {
    if (props.isOpen) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          props.onClose();
        }
      };
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";

      onCleanup(() => {
        document.removeEventListener("keydown", handleEscape);
        document.body.style.overflow = "";
      });
    }
  });

  const handleOverlayClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      props.onClose();
    }
  };

  return (
    <Show when={props.isOpen}>
      <Portal>
        <div class="overlay" onClick={handleOverlayClick}>
          <div class="modal" role="dialog" aria-modal="true">
            <Show when={props.title}>
              <div class="header">
                <h2 class="title">{props.title}</h2>
                <button
                  type="button"
                  class="closeButton"
                  onClick={props.onClose}
                  aria-label="Close modal"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    aria-hidden="true"
                  >
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </Show>
            <div class="body">{props.children}</div>
            <Show when={props.footer}>
              <div class="footer">{props.footer}</div>
            </Show>
          </div>
        </div>
      </Portal>
    </Show>
  );
}
