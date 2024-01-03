// https://vike.dev/onBeforeRender
export { onBeforeRender };

import fetch from "cross-fetch";
import type { OnBeforeRenderAsync } from "vike/types";
import { filterMovieData } from "../filterMovieData";
import type { MovieDetails } from "../types";

const onBeforeRender: OnBeforeRenderAsync = async (
  pageContext
): ReturnType<OnBeforeRenderAsync> => {
  const response = await fetch(
    `https://star-wars.brillout.com/api/films/${pageContext.routeParams?.id}.json`
  );
  let movie = (await response.json()) as MovieDetails;

  // We remove data we don't need because we pass `pageContext.movie` to
  // the client; we want to minimize what is sent over the network.
  movie = filterMovieData(movie);

  const { title } = movie;

  return {
    pageContext: {
      pageProps: {
        movie,
      },
      // The page's <title>
      title,
    },
  };
};