import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function CurrentPage({ params }: Props) {
  const { locale } = await params;

  // Redirect to news archive by default
  // Use direct path - next-intl middleware will handle the translation
  redirect(`/${locale}/current/news`);
}
