import { Container } from "@/components/layout/container.component";
import { H1 } from "@/components/layout/heading.component";
import { Button } from "@/components/ui/button";
import { LinkResolver } from "@/components/utils/link-resolver.component";

const NotFound = () => {
  return (
    <Container>
      <div className="flex max-w-md flex-col items-start gap-y-6">
        <H1 className="flex flex-col" balance={false}>
          <span className="opacity-50">404</span>Vi finner ikke siden
        </H1>

        <p>
          Beklager, siden du leter etter finnes ikke. Siden kan være flyttet, slettet, eller
          nettadressen kan være feil.
        </p>

        <Button asChild>
          <LinkResolver linkType="internal" _type="frontPage" slug={null}>
            Gå til forsiden
          </LinkResolver>
        </Button>
      </div>
    </Container>
  );
};

export default NotFound;
