import { createContext, createSignal, For, type JSX, useContext } from "solid-js";

type FlashType = "success" | "error" | "warning" | "info";

interface FlashMessage {
  id: number;
  type: FlashType;
  message: string;
}

interface FlashContextValue {
  showFlash: (type: FlashType, message: string) => void;
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
}

const FlashContext = createContext<FlashContextValue>();

let flashId = 0;

export function FlashProvider(props: { children: JSX.Element }) {
  const [messages, setMessages] = createSignal<FlashMessage[]>([]);

  const showFlash = (type: FlashType, message: string) => {
    const id = ++flashId;
    setMessages((prev) => [...prev, { id, type, message }]);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      removeFlash(id);
    }, 5000);
  };

  const removeFlash = (id: number) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const value: FlashContextValue = {
    showFlash,
    showSuccess: (message: string) => showFlash("success", message),
    showError: (message: string) => showFlash("error", message),
    showWarning: (message: string) => showFlash("warning", message),
    showInfo: (message: string) => showFlash("info", message),
  };

  return (
    <FlashContext.Provider value={value}>
      {props.children}
      <div class="container">
        <For each={messages()}>
          {(flash) => (
            <div class={`flash ${flash.type}`}>
              <span class="message">{flash.message}</span>
              <button class="close" onClick={() => removeFlash(flash.id)} aria-label="Dismiss">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </For>
      </div>
    </FlashContext.Provider>
  );
}

export function useFlash(): FlashContextValue {
  const context = useContext(FlashContext);
  if (!context) {
    throw new Error("useFlash must be used within a FlashProvider");
  }
  return context;
}
