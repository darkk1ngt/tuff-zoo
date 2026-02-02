import { A } from "@solidjs/router";
import { type JSX, Show, splitProps } from "solid-js";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "small" | "medium" | "large";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  loading?: boolean;
  children: JSX.Element;
}

interface ButtonAsButton extends ButtonBaseProps {
  href?: never;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
}

interface ButtonAsLink extends ButtonBaseProps {
  href: string;
  external?: boolean;
  onClick?: () => void;
  class?: string;
  style?: JSX.CSSProperties;
}

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const [local, rest] = splitProps(
    props as ButtonBaseProps & {
      href?: string;
      external?: boolean;
      onClick?: (() => void) | JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
      class?: string;
      style?: JSX.CSSProperties;
    },
    [
      "variant",
      "size",
      "fullWidth",
      "loading",
      "children",
      "href",
      "external",
      "onClick",
      "class",
      "style",
    ]
  );

  const classes = () => {
    const classList = ["button"];
    classList.push(local.variant || "primary");
    if (local.size && local.size !== "medium") {
      classList.push(local.size);
    }
    if (local.fullWidth) classList.push("fullWidth");
    if (local.loading) classList.push("loading");
    if (local.class) classList.push(local.class);
    return classList.join(" ");
  };

  if (local.href) {
    if (local.external) {
      return (
        <a
          href={local.href}
          class={classes()}
          style={local.style}
          target="_blank"
          rel="noopener noreferrer"
          onClick={local.onClick as (() => void) | undefined}
          {...(rest as JSX.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {local.children}
        </a>
      );
    }
    return (
      <A
        href={local.href}
        class={classes()}
        style={local.style}
        onClick={local.onClick as (() => void) | undefined}
        {...(rest as Record<string, unknown>)}
      >
        {local.children}
      </A>
    );
  }

  return (
    <button
      type="button"
      class={classes()}
      style={local.style}
      disabled={local.loading || (rest as ButtonAsButton).disabled}
      onClick={local.onClick as JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent> | undefined}
      {...(rest as JSX.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      <Show when={local.loading}>
        <span class="spinner" />
      </Show>
      {local.children}
    </button>
  );
}
