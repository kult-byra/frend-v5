import { fetchFathomSecrets } from "@/server/queries/utils/fathom-secrets.query";
import { TrackPageView } from "./fathom-tracker.component";

export async function FathomBase() {
  const fathomData = await fetchFathomSecrets();
  if (!fathomData) return null;
  return <TrackPageView {...fathomData} />;
}
