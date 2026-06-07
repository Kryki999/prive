import { articleCover } from '@/lib/site-images';

export type AktualnoscOrigin = 'home' | 'blog';

export type AktualnoscItem = {
  slug: string;
  date: string;
  title: string;
  excerpt: string;
  image: string;
  imageAlt: string;
  body: string[];
};

const MONTHS_PL = [
  'stycznia',
  'lutego',
  'marca',
  'kwietnia',
  'maja',
  'czerwca',
  'lipca',
  'sierpnia',
  'września',
  'października',
  'listopada',
  'grudnia',
] as const;

export function formatAktualnoscDate(dateString: string): string {
  const date = new Date(`${dateString}T12:00:00`);
  const day = date.getDate();
  const month = MONTHS_PL[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export function getAktualnoscHref(
  slug: string,
  from: AktualnoscOrigin = 'blog',
): string {
  return `/aktualnosci/${slug}?from=${from}`;
}

export function getAktualnoscBySlug(slug: string): AktualnoscItem | undefined {
  return AKTUALNOSCI_ITEMS.find((item) => item.slug === slug);
}

export function estimateReadTime(body: string[]): number {
  const wordCount = body.join(' ').split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(wordCount / 200));
}

export const AKTUALNOSCI_ITEMS: AktualnoscItem[] = [
  {
    slug: 'fue-vs-dhi-w-hair-clinic-prive',
    date: '2026-05-12',
    title: 'FUE czy DHI — jak dobieramy metodę przeszczepu w Hair Clinic PRIVÉ',
    excerpt:
      'Każdy pacjent ma inną skórę, gęstość i plan linii włosów. Zobacz, jak na konsultacji wybieramy technikę FUE lub DHI pod naturalny efekt.',
    image: articleCover('barberRazor'),
    imageAlt: 'Precyzyjny zabieg przeszczepu włosów — technika FUE i DHI',
    body: [
      'W Hair Clinic PRIVÉ nie traktujemy przeszczepu włosów jak gotowego pakietu. Na pierwszej, darmowej konsultacji omawiamy oczekiwania, badamy skórę głowy i projektujemy linię frontu dopasowaną do rysów twarzy.',
      'Metoda FUE sprawdza się, gdy potrzebujemy większej liczby graftów i elastycznego planu zabiegu. DHI daje precyzyjniejsze osadzenie pojedynczych mieszków — szczególnie przy wypełnianiu strefy czołowej i zagęszczaniu bez golenia całej głowy.',
      'Decyzja nie opiera się wyłącznie na „modzie”. Liczy się gęstość dawcy, elastyczność skóry, czas gojenia i styl życia pacjenta po zabiegu. Dlatego plan zawsze dokumentujemy i tłumaczymy krok po kroku.',
      'Jeśli rozważasz zabieg, zacznij od konsultacji — bez presji i z jasnym kosztorysem liczby graftów oraz rekonwalescencji.',
    ],
  },
  {
    slug: 'pierwsza-konsultacja-co-zabrac',
    date: '2026-04-22',
    title: 'Pierwsza konsultacja w klinice — na co się przygotować',
    excerpt:
      'Darmowe spotkanie to moment na pytania, zdjęcia stanu skóry głowy i realistyczny plan efektu. Krótki przewodnik przed wizytą w Gdańsku.',
    image: '/priveklinika.png',
    imageAlt: 'Wnętrze Hair Clinic PRIVÉ w Gdańsku',
    body: [
      'Konsultacja w Hair Clinic PRIVÉ jest bezpłatna i niezobowiązująca. Przyjdź z listą pytań — o metodę, liczbę graftów, gojenie i koszty. Im więcej wiemy o Twojej historii (wcześniejsze zabiegi, leki, styl życia), tym trafniejszy plan.',
      'Warto zabrać zdjęcia z różnych kątów głowy sprzed kilku lat, jeśli je masz. Pomagają ocenić tempo utraty włosów i zaplanować linię frontu z wyprzedzeniem.',
      'Podczas wizyty lekarz omawia strefy do zagęszczenia, proponuje liczbę graftów i orientacyjny harmonogram. Po spotkaniu otrzymujesz jasne podsumowanie — bez ukrytych opłat.',
      'Umów termin online lub telefonicznie. Zespół pomoże dobrać dogodny termin, także dla pacjentów spoza Trójmiasta.',
    ],
  },
  {
    slug: 'efekty-12-miesiecy-po-zabiegu',
    date: '2026-03-15',
    title: 'Efekty po roku — czego oczekiwać po przeszczepie włosów',
    excerpt:
      'Od fazy sheddingu po pełną gęstość — jak wygląda typowa droga pacjenta Hair Clinic PRIVÉ w pierwszych 12 miesiącach.',
    image:
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Zdrowe, gęste włosy — efekt zabiegu',
    body: [
      'Po zabiegu włosy przechodzą naturalne fazy: najpierw krótki okres gojenia, potem shedding przeszczepionych włosów, a następnie stopniowy wzrost nowych. To normalne — i dokładnie omawiamy to na konsultacji kontrolnej.',
      'Pierwsze widoczne efekty często pojawiają się po 4–6 miesiącach. Pełniejszy rezultat bywa widoczny po 10–12 miesiącach, w zależności od metabolizmu i strefy zabiegu.',
      'W Hair Clinic PRIVÉ pacjent ma zaplanowane kontrole pooperacyjne. Na każdym etapie możesz zapytać zespół o pielęgnację, sport, słońce i stylizację.',
      'Cierpliwość jest częścią procesu — ale dobrze zaplanowany przeszczep daje trwały, naturalny efekt, który starzeje się razem z Tobą.',
    ],
  },
  {
    slug: 'pielegnacja-po-przeszczepie',
    date: '2026-02-08',
    title: 'Pielęgnacja po zabiegu — 5 zasad z gabinetu Hair Clinic PRIVÉ',
    excerpt:
      'Delikatne mycie, ochrona przed słońcem i czego unikać w pierwszych tygodniach — praktyczne wskazówki po FUE i DHI.',
    image:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Spokojna strefa wellness — pielęgnacja i regeneracja',
    body: [
      'Pierwsze dni po przeszczepie to czas, gdy skóra głowy potrzebuje spokoju. Myjemy delikatnie, zgodnie z instrukcją zespołu — bez mocnego drapania i gorącej wody.',
      'Unikaj intensywnego słońca, sauny i ciężkiego wysiłku przez okres wskazany przez lekarza. To inwestycja w to, by grafty się dobrze przyjęły.',
      'Sen na plecach lub lekko uniesiona głowa zmniejsza obrzęk. Drobne zmiany nawyków na kilka nocy robią dużą różnicę.',
      'Masz wątpliwości? Zespół Hair Clinic PRIVÉ jest dostępny po zabiegu — nie zostawiamy pacjenta samego z pytaniami.',
    ],
  },
];
