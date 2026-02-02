import { type JSX, Show } from "solid-js";

interface CardProps {
  children: JSX.Element;
  hoverable?: boolean;
  bordered?: boolean;
  compact?: boolean;
  class?: string;
}

export function Card(props: CardProps) {
  const classes = () => {
    const classList = ["card"];
    if (props.hoverable) classList.push("hoverable");
    if (props.bordered) classList.push("bordered");
    if (props.compact) classList.push("compact");
    if (props.class) classList.push(props.class);
    return classList.join(" ");
  };

  return <div class={classes()}>{props.children}</div>;
}

interface CardImageProps {
  src: string;
  alt: string;
  class?: string;
}

export function CardImage(props: CardImageProps) {
  return <img src={props.src} alt={props.alt} class={`image ${props.class || ""}`} />;
}

interface CardContentProps {
  children: JSX.Element;
  class?: string;
}

export function CardContent(props: CardContentProps) {
  return <div class={`content ${props.class || ""}`}>{props.children}</div>;
}

interface CardHeaderProps {
  title: string;
  subtitle?: string;
}

export function CardHeader(props: CardHeaderProps) {
  return (
    <div class="header">
      <h3 class="title">{props.title}</h3>
      <Show when={props.subtitle}>
        <p class="subtitle">{props.subtitle}</p>
      </Show>
    </div>
  );
}

interface CardBodyProps {
  children: JSX.Element;
}

export function CardBody(props: CardBodyProps) {
  return <div class="body">{props.children}</div>;
}

interface CardFooterProps {
  children: JSX.Element;
}

export function CardFooter(props: CardFooterProps) {
  return <div class="footer">{props.children}</div>;
}
