import type { PageContext } from "vike/types";
import { PageContextProvider } from "./PageContextProvider";
import { usePageContext } from "../hooks/usePageContext";
import type { JSX } from "solid-js";
import { Dynamic } from "solid-js/web";
import type { Store } from "solid-js/store";

export function getPageElement(pageContext: Store<PageContext>): JSX.Element {
  const page = (
    <PageContextProvider pageContext={pageContext}>
      <Wrapper>
        <Layout>
          <Page />
        </Layout>
      </Wrapper>
    </PageContextProvider>
  );
  return page;
}

function Layout(props: { children: JSX.Element }) {
  const pageContext = usePageContext();
  return (
    <Dynamic component={pageContext.config.Layout ?? Passthrough}>
      {props.children}
    </Dynamic>
  );
}

function Wrapper(props: { children: JSX.Element }) {
  const pageContext = usePageContext();
  return (
    <Dynamic component={pageContext.config.Wrapper ?? Passthrough}>
      {props.children}
    </Dynamic>
  );
}

function Page() {
  const pageContext = usePageContext();
  return (
    <>
      <Dynamic component={pageContext.Page} />
    </>
  );
}

function Passthrough(props: { children: JSX.Element }) {
  return <>{props.children}</>;
}
