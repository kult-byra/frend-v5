import { Package } from "lucide-react";
import type { StructureBuilder } from "sanity/structure";
import { singletonListItem } from "@/structure/utils/singleton-list-item.desk";
import { servicesArchiveSchema } from "@/schemas/documents";
import { subServiceSchema } from "@/schemas/documents/services/sub-service.schema";
import { env } from "@/env";

const title = "Services";

export const servicesStructure = (S: StructureBuilder) => {
  return S.listItem()
    .title(title)
    .icon(Package)
    .child(
      S.list()
        .title(title)
        .items([
          S.documentTypeListItem("service")
            .title("Services")
            .child(
              S.documentTypeList("service")
                .title("Services")
                .apiVersion(env.SANITY_STUDIO_API_VERSION)
                .child((serviceId) =>
                  S.list()
                    .title("Service")
                    .items([
                      // The parent document itself
                      S.documentListItem()
                        .id(serviceId)
                        .schemaType("service")
                        .child(
                          S.document().documentId(serviceId).schemaType("service"),
                        ),

                      S.divider(),

                      // The subpages list
                      S.documentTypeListItem("subService")
                        .title("Subservices")
                        .icon(subServiceSchema.icon)
                        .child(
                          S.documentTypeList("subService")
                            .title("Subservice")
                            .filter(
                              "_type == 'subService' && $serviceId == service._ref",
                            )
                            .params({ serviceId })
                            .apiVersion(env.SANITY_STUDIO_API_VERSION)
                            .initialValueTemplates([
                              S.initialValueTemplateItem("subServiceWithService", {
                                serviceId,
                              }),
                            ]),
                        ),
                    ]),
                ),
            ),

          S.divider(),

          singletonListItem(S, servicesArchiveSchema),
        ]),
    );
};
