import { type JSX, Show, splitProps } from "solid-js";

interface InputProps extends JSX.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export function Input(props: InputProps) {
  const [local, rest] = splitProps(props, ["label", "error", "required", "class"]);

  return (
    <div class={`field ${local.error ? "error" : ""}`}>
      <Show when={local.label}>
        <label class="label">
          {local.label}
          <Show when={local.required}>
            <span class="required">*</span>
          </Show>
        </label>
      </Show>
      <input class={`input ${local.class || ""}`} {...rest} />
      <Show when={local.error}>
        <span class="errorMessage">{local.error}</span>
      </Show>
    </div>
  );
}

interface TextareaProps extends JSX.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
}

export function Textarea(props: TextareaProps) {
  const [local, rest] = splitProps(props, ["label", "error", "required", "class"]);

  return (
    <div class={`field ${local.error ? "error" : ""}`}>
      <Show when={local.label}>
        <label class="label">
          {local.label}
          <Show when={local.required}>
            <span class="required">*</span>
          </Show>
        </label>
      </Show>
      <textarea class={`input textarea ${local.class || ""}`} {...rest} />
      <Show when={local.error}>
        <span class="errorMessage">{local.error}</span>
      </Show>
    </div>
  );
}

interface SelectProps extends JSX.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  required?: boolean;
  children: JSX.Element;
}

export function Select(props: SelectProps) {
  const [local, rest] = splitProps(props, ["label", "error", "required", "class", "children"]);

  return (
    <div class={`field ${local.error ? "error" : ""}`}>
      <Show when={local.label}>
        <label class="label">
          {local.label}
          <Show when={local.required}>
            <span class="required">*</span>
          </Show>
        </label>
      </Show>
      <select class={`input ${local.class || ""}`} {...rest}>
        {local.children}
      </select>
      <Show when={local.error}>
        <span class="errorMessage">{local.error}</span>
      </Show>
    </div>
  );
}
