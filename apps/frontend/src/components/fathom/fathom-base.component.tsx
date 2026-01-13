import { fetchFathomSecrets } from "./fathom-secrets.query";
import { TrackPageView } from "./fathom-tracker.component";

export async function FathomBase() {
  const fathomData = await fetchFathomSecrets();
  if (!fathomData) return null;
  return <TrackPageView {...fathomData} />;
}
