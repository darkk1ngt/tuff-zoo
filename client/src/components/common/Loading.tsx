import { Show } from "solid-js";

interface LoadingProps {
  text?: string;
  fullPage?: boolean;
}

export function Loading(props: LoadingProps) {
  return (
    <div class={`container ${props.fullPage ? "fullPage" : ""}`}>
      <div class="spinner" />
      <Show when={props.text}>
        <span class="text">{props.text}</span>
      </Show>
    </div>
  );
}
