// This page is to test image component in different use cases
// Delete this file or use it for testing

import { defineQuery } from "next-sanity";
import { Container } from "@/components/layout/container.component";
import { H1 } from "@/components/layout/heading.component";
import { Img } from "@/components/utils/img.component";
import { imageQuery } from "@/server/queries/utils/image.query";
import { sanityFetch } from "@/server/sanity/sanity-live";

const imageOnlyQuery =
  defineQuery(`*[_type == "newsArticle" && _id == "b0aaa3a1-5a60-4555-a956-09ec63450c91"][0] {
    "coverImage": coverImages[0].figure{
        ${imageQuery}
    }
}`);

export default async function ImageTest() {
  const article = await sanityFetch({
    query: imageOnlyQuery,
  }).then((data) => data.data);

  const image = article?.coverImage;

  if (!image) return null;

  const imageWithoutCrop = {
    ...image,
    crop: null,
  };

  return (
    <Container className="space-y-8">
      <H1>Auto</H1>
      <Img
        sizes={{
          md: "full",
        }}
        {...imageWithoutCrop}
      />
      <H1>Auto with crop</H1>
      <Img
        sizes={{
          md: "full",
        }}
        {...image}
      />
      <H1>Specific width and height</H1>
      <Img
        sizes={{
          md: "full",
        }}
        {...imageWithoutCrop}
        width={500}
        height={500}
      />
      <H1>Specific width and height with crop</H1>
      <Img
        sizes={{
          md: "half",
        }}
        {...image}
        width={500}
        height={500}
      />
      <H1>Specific width and height</H1>
      <Img
        sizes={{
          md: "half",
          xl: "third",
        }}
        {...imageWithoutCrop}
        width={500}
        height={500}
      />
      <H1>Cover</H1>
      <Img
        sizes={{
          md: "full",
        }}
        className="w-64 h-64"
        cover
        {...image}
      />
      <H1>Cover without crop</H1>
      <Img
        sizes={{
          md: "third",
        }}
        className="w-64 h-64"
        cover
        {...imageWithoutCrop}
      />
      <H1>Cover</H1>
      <Img
        sizes={{
          md: "third",
        }}
        className="w-24 h-24 rounded-full overflow-hidden"
        cover
        {...image}
      />
      <H1>Cover without crop</H1>
      <Img
        sizes={{
          md: "third",
        }}
        className="w-24 h-24 rounded-full overflow-hidden"
        cover
        {...imageWithoutCrop}
      />
    </Container>
  );
}
