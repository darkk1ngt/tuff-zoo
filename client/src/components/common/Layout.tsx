import type { JSX } from "solid-js";
import { Footer } from "./Footer";
import { Nav } from "./Nav";

interface LayoutProps {
  children: JSX.Element;
}

export function Layout(props: LayoutProps) {
  return (
    <div class="layout">
      <Nav />
      <main class="main">{props.children}</main>
      <Footer />
    </div>
  );
}
