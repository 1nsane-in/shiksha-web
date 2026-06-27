import type { UniversityListItem } from "@/domains/universities/universities.types";

/**
 * Seed universities used as fallback when the API returns no results.
 */
export const seedUniversities: UniversityListItem[] = [
  {
    id: "1",
    name: "Jalalabad International University",
    shortName: "JAIU",
    slug: "jalalabad-international-university",
    establishedYear: 1998,
    type: "PRIVATE",
    status: "ACTIVE",
    logo: "https://placehold.co/200x200/1A153A/C4953B?text=JAIU",
    bannerImage:
      "https://placehold.co/1200x400/1A153A/FAF9F6?text=Jalalabad+International+University",
    location: {
      city: "Jalalabad",
      country: "Kyrgyzstan",
      state: "Jalalabad Region",
      address: "104 Silk Road St, Jalalabad",
    },
    contact: { email: "admissions@jaiu.edu.kg", phone: "+996 XXX XXX XXX" },
    academic: { medium: "English" },
    content: {
      shortDescription:
        "NMC & WHO recognized medical university with modern infrastructure and 25+ years of excellence in medical education.",
      longDescription: "",
      highlights: [],
      gallery: [],
    },
  },
  {
    id: "2",
    name: "Osh State University",
    shortName: "OSMU",
    slug: "osh-state-university",
    establishedYear: 1992,
    type: "GOVERNMENT",
    status: "ACTIVE",
    logo: "https://placehold.co/200x200/1A153A/C4953B?text=OSMU",
    bannerImage:
      "https://placehold.co/1200x400/1A153A/FAF9F6?text=Osh+State+University",
    location: {
      city: "Osh",
      country: "Kyrgyzstan",
      state: "Osh Region",
      address: "331 Lenin Ave, Osh",
    },
    contact: { email: "admissions@osmu.edu.kg", phone: "+996 XXX XXX XXX" },
    academic: { medium: "English" },
    content: {
      shortDescription:
        "One of the oldest medical universities in Central Asia with a strong alumni network and clinical training across 15+ affiliated hospitals.",
      longDescription: "",
      highlights: [],
      gallery: [],
    },
  },
  {
    id: "3",
    name: "Asian Medical Institute",
    shortName: "ASI",
    slug: "asian-medical-institute",
    establishedYear: 2004,
    type: "PRIVATE",
    status: "ACTIVE",
    logo: "https://placehold.co/200x200/1A153A/C4953B?text=ASI",
    bannerImage:
      "https://placehold.co/1200x400/1A153A/FAF9F6?text=Asian+Medical+Institute",
    location: {
      city: "Kant",
      country: "Kyrgyzstan",
      state: "Chuy Region",
      address: "12 Mira St, Kant",
    },
    contact: { email: "admissions@asi.edu.kg", phone: "+996 XXX XXX XXX" },
    academic: { medium: "English" },
    content: {
      shortDescription:
        "Modern medical institute with affordable fee structure, NMC approved curriculum, and dedicated international student support.",
      longDescription: "",
      highlights: [],
      gallery: [],
    },
  },
];
