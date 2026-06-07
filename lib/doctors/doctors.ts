import type { Doctor } from '@/components/doctors/types';

export const DOCTORS: Doctor[] = [
  {
    id: 'mariana-myslovych',
    slug: 'mariana-myslovych',
    name: 'dr Mariana Myslovych',
    image: '/doctors/mariana-myslovych.jpg',
    tags: ['Dermatolog', 'Trycholog', 'Transplantolog'],
    shortBio:
      'Dermatolog, trycholog i transplantolog włosów z ponad 9-letnim doświadczeniem. Właścicielka kliniki i główny lekarz szkolący zespół.',
    bio: [
      'Dr Mariana to dermatolog, trycholog oraz transplantolog włosów z ponad 9-letnim doświadczeniem w transplantacji włosów. Jest właścicielką kliniki oraz głównym lekarzem szkolącym naszych transplantologów, którzy wykonują zabiegi zgodnie z jej autorską metodą pracy i najwyższymi europejskimi standardami.',
      'Dr Mariana przeprowadziła kilka tysięcy zabiegów przeszczepu włosów, specjalizując się w osiąganiu maksymalnie naturalnych efektów, które są dla naszej kliniki absolutnym priorytetem. Jest również członkiem European Hair Research Society.',
      'Każdy etap zabiegu został opracowany przez Dr Marianę z myślą o precyzji, bezpieczeństwie oraz naturalnym wyglądzie włosów. Podczas pobierania graftów stosowana jest technologia Micro FUE z wykorzystaniem najmniejszych dostępnych na rynku narzędzi, co pozwala zminimalizować ingerencję w skórę i przyspieszyć gojenie.',
      'Ogromną uwagę przykładamy również do projektowania naturalnej linii włosów. Dzięki europejskiemu podejściu do estetyki oraz metodzie Micro Sapphire tworzone linie włosów wyglądają niezwykle naturalnie, przez co sam przeszczep pozostaje praktycznie niezauważalny.',
      'Do implantacji graftów wykorzystywana jest jedna z najbardziej precyzyjnych metod na świecie — DHI, która zapewnia bardzo wysoką przeżywalność graftów, sięgającą ponad 90%, a jednocześnie pozwala uzyskać odpowiednią gęstość i naturalny kierunek wzrostu włosów.',
      'W przeciwieństwie do wielu klinik nastawionych wyłącznie na ilość wykonywanych zabiegów, w naszej klinice najważniejsze są naturalność, estetyka oraz indywidualne dopasowanie efektu do europejskich i polskich standardów wyglądu.',
      'Lekarz z polskim prawem wykonywania zawodu lekarza.',
    ],
  },
  {
    id: 'susana-eredzhepova',
    slug: 'susana-eredzhepova',
    name: 'dr Susana Eredzhepova',
    image: '/doctors/susana-eredzhepova.png',
    tags: ['Transplantolog', 'Micro FUE', 'DHI'],
    shortBio:
      'Lekarz z ponad 5-letnim doświadczeniem w transplantacji włosów, specjalizująca się w naturalnych efektach i indywidualnym podejściu.',
    bio: [
      'Dr Susana jest lekarzem z ponad 5-letnim doświadczeniem w zabiegach transplantacji włosów, które zdobywała, pracując w naszej klinice. Ukończyła Uniwersytet Medyczno-Farmaceutyczny, a swoje doświadczenie rozwijała pod okiem naszych specjalistów, pracując zgodnie z najwyższymi europejskimi standardami.',
      'W Hair Clinic PRIVE specjalizuje się w nowoczesnych zabiegach przeszczepu włosów, gdzie precyzja, estetyka oraz indywidualne podejście do pacjenta są dla niej absolutnym priorytetem.',
      'Dr Susana wykonuje zabiegi zgodnie z metodologią naszej kliniki, opartą na osiąganiu maksymalnie naturalnych efektów. Szczególną uwagę poświęca projektowaniu naturalnej linii włosów, odpowiedniej gęstości oraz kierunkowi wzrostu włosów, dzięki czemu efekty przeszczepu pozostają praktycznie niezauważalne.',
      'W swojej pracy wykorzystuje nowoczesne techniki transplantacji, takie jak Micro FUE, Micro Sapphire oraz DHI, które pozwalają osiągać wysoką przeżywalność graftów oraz naturalny efekt końcowy.',
      'Dzięki doświadczeniu, dokładności oraz wysokim standardom pracy, dr Susana pomaga pacjentom odzyskać nie tylko włosy, ale również pewność siebie i komfort życia.',
      'Lekarz z polskim prawem wykonywania zawodu lekarza.',
    ],
  },
  {
    id: 'mariia-zaplava',
    slug: 'mariia-zaplava',
    name: 'dr Mariia Zaplava',
    image: '/doctors/mariia-zaplava.jpg',
    tags: ['Transplantolog', 'Anestezjologia', 'DHI'],
    shortBio:
      'Doświadczony transplantolog włosów z wiedzą z zakresu anestezjologii — maksymalny komfort i bezpieczeństwo podczas zabiegu.',
    bio: [
      'Dr Mariia jest doświadczonym transplantologiem włosów, specjalizującym się w nowoczesnych zabiegach przeszczepu włosów wykonywanych zgodnie z najwyższymi europejskimi standardami.',
      'W Hair Clinic PRIVE odpowiada za wykonywanie zabiegów z dbałością o maksymalną naturalność efektów, odpowiednią gęstość włosów oraz precyzyjne projektowanie linii włosów dopasowanej indywidualnie do każdego pacjenta.',
      'Ogromnym atutem dr Mariii jest również jej doświadczenie w dziedzinie anestezjologii, co stanowi wyjątkową przewagę naszej kliniki nad wieloma innymi placówkami wykonującymi przeszczepy włosów. Dzięki temu pacjenci mogą czuć się wyjątkowo bezpiecznie i komfortowo podczas całego zabiegu.',
      'Dr Mariia specjalizuje się także w bezbolesnych procedurach medycznych, dbając o maksymalny komfort pacjentów oraz spokojny przebieg całego procesu transplantacji.',
      'Dzięki połączeniu doświadczenia transplantologicznego, precyzji oraz wiedzy z zakresu anestezjologii, dr Mariia pomaga pacjentom odzyskać nie tylko włosy, ale również pewność siebie i naturalny wygląd.',
    ],
  },
];

export function getDoctorBySlug(slug: string): Doctor | undefined {
  return DOCTORS.find((doctor) => doctor.slug === slug);
}

export function getAllDoctorSlugs(): string[] {
  return DOCTORS.map((doctor) => doctor.slug);
}
