import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import type { ZodObject, z } from "zod";

type InferParams<Params> = Params extends readonly string[]
  ? {
      [K in Params[number]]: string;
    }
  : Params extends ZodObject
    ? z.infer<Params>
    : unknown;

type NextJsRawSearchParams = Promise<{
  [key: string]: string | string[] | undefined;
}>;

type LoaderFn<Params extends readonly string[] | ZodObject> = (args: {
  params: InferParams<Params>;
  searchParams: NextJsRawSearchParams;
  // biome-ignore lint/suspicious/noExplicitAny: We need any here please
}) => Promise<any | null>;

// biome-ignore lint/suspicious/noExplicitAny: We need any here please
type InferLoaderData<Loader> = Loader extends (args: any) => Promise<infer T>
  ? NonNullable<T>
  : unknown;

export interface CreatePageProps<
  Params extends readonly string[] | ZodObject,
  Loader extends LoaderFn<Params> = LoaderFn<Params>,
> {
  params?: Params;
  loader?: Loader;
  metadata?:
    | Metadata
    | ((
        args: {
          params: InferParams<Params>;
          searchParams: NextJsRawSearchParams;
          data: InferLoaderData<Loader>;
        },
        parent: ResolvingMetadata,
      ) => Promise<Metadata>);
  component: React.ComponentType<{
    params: InferParams<Params>;
    searchParams: NextJsRawSearchParams;
    data: InferLoaderData<Loader>;
  }>;
  generateStaticParams?: () => Promise<Array<InferParams<Params>>>;
}

async function parseParams<Schema extends readonly string[] | ZodObject>(
  // biome-ignore lint/suspicious/noExplicitAny: We need any here please
  params: Promise<any> | undefined,
  schema?: Schema,
): Promise<InferParams<Schema>> {
  const resolvedParams = await Promise.resolve(params);

  if (schema && "parse" in schema) {
    return schema.parse(resolvedParams) as InferParams<Schema>;
  }

  return resolvedParams as InferParams<Schema>;
}

export const createPage = <
  const Params extends readonly string[] | ZodObject,
  Loader extends LoaderFn<Params> = LoaderFn<Params>,
>(
  props: CreatePageProps<Params, Loader>,
) => {
  const {
    params: paramsSchema,
    component: PageComponent,
    loader,
    metadata,
    generateStaticParams,
  } = props;

  async function Page(props: {
    // biome-ignore lint/suspicious/noExplicitAny: We need any here please
    params: Promise<any> | undefined;
    searchParams: NextJsRawSearchParams;
  }): Promise<React.ReactElement> {
    const params = await parseParams(props.params, paramsSchema);

    const rawSearchParamsToPass = props.searchParams;

    let pageProps: {
      params: InferParams<Params>;
      data: InferLoaderData<Loader>;
      searchParams: NextJsRawSearchParams;
    };

    if (typeof loader === "function") {
      const data = await loader({
        params,
        searchParams: rawSearchParamsToPass,
      });

      if (data === null) {
        notFound();
      }

      pageProps = {
        params,
        searchParams: rawSearchParamsToPass,
        data: data as InferLoaderData<Loader>,
      };
    } else {
      pageProps = {
        params,
        searchParams: rawSearchParamsToPass,
        data: {} as InferLoaderData<Loader>,
      };
    }

    return <PageComponent {...pageProps} />;
  }

  const result: {
    Page: typeof Page;
    generateMetadata?: (
      props: {
        // biome-ignore lint/suspicious/noExplicitAny: We need any here please
        params: Promise<any> | undefined;
        searchParams: NextJsRawSearchParams;
      },
      parent: ResolvingMetadata,
    ) => Promise<Metadata>;
    metadata?: Metadata;
    generateStaticParams?: () => Promise<Array<InferParams<Params>>>;
  } = { Page };

  if (typeof metadata === "function") {
    result.generateMetadata = async (
      {
        params,
        searchParams,
      }: {
        // biome-ignore lint/suspicious/noExplicitAny: We need any here please
        params: Promise<any> | undefined;
        searchParams: NextJsRawSearchParams;
      },
      parent: ResolvingMetadata,
    ): Promise<Metadata> => {
      const resolvedParams = await parseParams(params, paramsSchema);
      const rawSearchParamsToPass = searchParams;

      let data: InferLoaderData<Loader>;

      if (typeof loader === "function") {
        const loaderData = await loader({
          params: resolvedParams,
          searchParams: rawSearchParamsToPass,
        });
        if (loaderData === null) {
          notFound();
        }
        data = loaderData as InferLoaderData<Loader>;
      } else {
        data = {} as InferLoaderData<Loader>;
      }

      return metadata(
        {
          params: resolvedParams,
          searchParams: rawSearchParamsToPass,
          data,
        },
        parent,
      );
    };
  } else if (metadata) {
    result.metadata = metadata;
  }

  if (paramsSchema && generateStaticParams) {
    result.generateStaticParams = async () => {
      const staticParams = await generateStaticParams();
      return Promise.all(
        staticParams.map(async (params) =>
          // biome-ignore lint/suspicious/noExplicitAny: We need any here please
          parseParams(params as any, paramsSchema),
        ),
      );
    };
  }

  return result;
};
