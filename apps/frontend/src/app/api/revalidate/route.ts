import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { env } from "@/env";

type WebhookPayload = {
  _type: string;
  _id: string;
  slug?: { current: string };
};

const TAG_MAP: Record<string, string[]> = {
  // Documents -> cache tags
  newsArticle: ["newsArticle", "newsAndEventsArchive"],
  event: ["event", "newsAndEventsArchive"],
  caseStudy: ["caseStudy", "caseStudyArchive", "knowledgeHub"],
  service: ["service", "servicesArchive"],
  client: ["client", "clientArchive"],
  seminar: ["seminar", "seminarArchive", "knowledgeHub"],
  eBook: ["eBook", "eBookArchive", "knowledgeHub"],
  knowledgeArticle: ["knowledgeArticle", "knowledgeArticleArchive", "knowledgeHub"],

  // Settings
  siteSettings: ["siteSettings"],
  menuSettings: ["menuSettings"],
  footerSettings: ["footerSettings"],
  metadataSettings: ["metadataSettings"],
  stringTranslations: ["stringTranslations"],

  // Archive settings
  newsAndEventsArchive: ["newsAndEventsArchive"],
  caseStudyArchive: ["caseStudyArchive"],
  servicesArchive: ["servicesArchive"],
  clientArchive: ["clientArchive"],
  seminarArchive: ["seminarArchive"],
  eBookArchive: ["eBookArchive"],
  knowledgeArticleArchive: ["knowledgeArticleArchive"],
  knowledgeHub: ["knowledgeHub"],

  // Pages
  frontPage: ["frontPage"],
  page: ["page"],
};

export async function POST(request: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<WebhookPayload>(
      request,
      env.SANITY_REVALIDATE_SECRET,
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { message: "Invalid signature", revalidated: false },
        { status: 401 },
      );
    }

    if (!body?._type) {
      return NextResponse.json(
        { message: "Missing document type", revalidated: false },
        { status: 400 },
      );
    }

    const tagsToRevalidate = TAG_MAP[body._type] ?? [body._type];

    for (const tag of tagsToRevalidate) {
      revalidateTag(tag, { expire: 0 });
    }

    return NextResponse.json({
      revalidated: true,
      tags: tagsToRevalidate,
      documentType: body._type,
      documentId: body._id,
    });
  } catch (error) {
    console.error("Revalidation error:", error);
    return NextResponse.json(
      { message: "Error revalidating", revalidated: false },
      { status: 500 },
    );
  }
}
