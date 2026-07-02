import type { UniversityListItem } from "@/domains/universities/universities.types";

/**
 * Seed universities used as fallback when the API returns no results.
 * Based on Shiksha International partner universities.
 */
export const seedUniversities: UniversityListItem[] = [
  // ─── Kyrgyzstan ───
  {
    id: "1",
    name: "Jalal-Abad State University",
    shortName: "JASU",
    slug: "jalal-abad-state-university",
    establishedYear: 1993,
    type: "GOVERNMENT",
    status: "ACTIVE",
    logo: "https://placehold.co/200x200/1A153A/C4953B?text=JASU",
    bannerImage:
      "https://placehold.co/1200x400/1A153A/FAF9F6?text=Jalal-Abad+State+University",
    location: {
      city: "Jalal-Abad",
      country: "Kyrgyzstan",
      state: "Jalal-Abad Region",
      address: "Jalal-Abad, Kyrgyzstan",
    },
    contact: { email: "admissions@jasu.edu.kg", phone: "+996 XXX XXX XXX" },
    academic: { medium: "English" },
    content: {
      shortDescription:
        "Government university with recognized medical faculty. Budget-friendly fees and popular among Indian students.",
      longDescription: "",
      highlights: [],
      gallery: [],
    },
  },
  {
    id: "2",
    name: "Bishkek International Medical Institute",
    shortName: "BIMI",
    slug: "bishkek-international-medical-institute",
    establishedYear: 2005,
    type: "PRIVATE",
    status: "ACTIVE",
    logo: "https://placehold.co/200x200/1A153A/C4953B?text=BIMI",
    bannerImage:
      "https://placehold.co/1200x400/1A153A/FAF9F6?text=Bishkek+International+Medical+Institute",
    location: {
      city: "Bishkek",
      country: "Kyrgyzstan",
      state: "Chuy Region",
      address: "Bishkek, Kyrgyzstan",
    },
    contact: { email: "admissions@bimi.edu.kg", phone: "+996 XXX XXX XXX" },
    academic: { medium: "English" },
    content: {
      shortDescription:
        "English-medium MBBS with modern laboratories, affordable tuition, and a large Indian student community.",
      longDescription: "",
      highlights: [],
      gallery: [],
    },
  },
  {
    id: "3",
    name: "Jalalabad International University",
    shortName: "JIU",
    slug: "jalalabad-international-university",
    establishedYear: 1998,
    type: "PRIVATE",
    status: "ACTIVE",
    logo: "https://placehold.co/200x200/1A153A/C4953B?text=JIU",
    bannerImage:
      "https://placehold.co/1200x400/1A153A/FAF9F6?text=Jalalabad+International+University",
    location: {
      city: "Jalalabad",
      country: "Kyrgyzstan",
      state: "Jalal-Abad Region",
      address: "104 Silk Road St, Jalalabad",
    },
    contact: { email: "admissions@jiu.edu.kg", phone: "+996 XXX XXX XXX" },
    academic: { medium: "English" },
    content: {
      shortDescription:
        "NMC & WDOMS listed university with modern infrastructure and updated medical curriculum. Ministry of Health approved.",
      longDescription: "",
      highlights: [],
      gallery: [],
    },
  },
  {
    id: "4",
    name: "Osh State University",
    shortName: "OSMU",
    slug: "osh-state-university",
    establishedYear: 1939,
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
        "Founded 1939. 40,000+ students, 18 departments, 6 colleges. Modern infrastructure and English-medium MBBS program.",
      longDescription: "",
      highlights: [],
      gallery: [],
    },
  },
  // ─── Uzbekistan ───
  {
    id: "5",
    name: "Andijan State Medical Institute",
    shortName: "ASMI",
    slug: "andijan-state-medical-institute",
    establishedYear: 1955,
    type: "GOVERNMENT",
    status: "ACTIVE",
    logo: "https://placehold.co/200x200/1A153A/C4953B?text=ASMI",
    bannerImage:
      "https://placehold.co/1200x400/1A153A/FAF9F6?text=Andijan+State+Medical+Institute",
    location: {
      city: "Andijan",
      country: "Uzbekistan",
      state: "Andijan Region",
      address: "Andijan, Uzbekistan",
    },
    contact: { email: "admissions@asmi.uz", phone: "+998 XXX XXX XXX" },
    academic: { medium: "English" },
    content: {
      shortDescription:
        "Government medical institute est. 1955. English-medium MBBS, advanced lab facilities, strong hospital training.",
      longDescription: "",
      highlights: [],
      gallery: [],
    },
  },
  // ─── Kazakhstan ───
  {
    id: "6",
    name: "North Kazakhstan State Medical University",
    shortName: "NKSMU",
    slug: "north-kazakhstan-state-medical-university",
    establishedYear: 1937,
    type: "GOVERNMENT",
    status: "ACTIVE",
    logo: "https://placehold.co/200x200/1A153A/C4953B?text=NKSMU",
    bannerImage:
      "https://placehold.co/1200x400/1A153A/FAF9F6?text=North+Kazakhstan+State+Medical+University",
    location: {
      city: "Petropavl",
      country: "Kazakhstan",
      state: "North Kazakhstan Region",
      address: "Petropavl, Kazakhstan",
    },
    contact: { email: "admissions@nksmu.kz", phone: "+7 XXX XXX XXX" },
    academic: { medium: "English" },
    content: {
      shortDescription:
        "Est. 1937. NMC & WHO approved. 6-year English-medium MBBS with affordable tuition and safe on-campus accommodation.",
      longDescription: "",
      highlights: [],
      gallery: [],
    },
  },
  // ─── Russia ───
  {
    id: "7",
    name: "Sevastopol State University",
    shortName: "SevSU",
    slug: "sevastopol-state-university",
    establishedYear: 2014,
    type: "GOVERNMENT",
    status: "ACTIVE",
    logo: "https://placehold.co/200x200/1A153A/C4953B?text=SevSU",
    bannerImage:
      "https://placehold.co/1200x400/1A153A/FAF9F6?text=Sevastopol+State+University",
    location: {
      city: "Sevastopol",
      country: "Russia",
      state: "Crimea",
      address: "Sevastopol, Russia",
    },
    contact: { email: "admissions@sevsu.ru", phone: "+7 XXX XXX XXX" },
    academic: { medium: "English" },
    content: {
      shortDescription:
        "Government Federal University. NMC & WHO approved. Modern simulation laboratories and English-medium MBBS.",
      longDescription: "",
      highlights: [],
      gallery: [],
    },
  },
  {
    id: "8",
    name: "Kemerovo State University",
    shortName: "KemSU",
    slug: "kemerovo-state-university",
    establishedYear: 1974,
    type: "GOVERNMENT",
    status: "ACTIVE",
    logo: "https://placehold.co/200x200/1A153A/C4953B?text=KemSU",
    bannerImage:
      "https://placehold.co/1200x400/1A153A/FAF9F6?text=Kemerovo+State+University",
    location: {
      city: "Kemerovo",
      country: "Russia",
      state: "Kemerovo Oblast",
      address: "Kemerovo, Russia",
    },
    contact: { email: "admissions@kemsu.ru", phone: "+7 XXX XXX XXX" },
    academic: { medium: "English" },
    content: {
      shortDescription:
        "Est. 1974. 21,000+ students. Strong academic reputation with multi-specialty hospital training.",
      longDescription: "",
      highlights: [],
      gallery: [],
    },
  },
  {
    id: "9",
    name: "Maykop State Medical Institute",
    shortName: "MSMI",
    slug: "maykop-state-medical-institute",
    establishedYear: 1998,
    type: "GOVERNMENT",
    status: "ACTIVE",
    logo: "https://placehold.co/200x200/1A153A/C4953B?text=MSMI",
    bannerImage:
      "https://placehold.co/1200x400/1A153A/FAF9F6?text=Maykop+State+Medical+Institute",
    location: {
      city: "Maykop",
      country: "Russia",
      state: "Adygea Republic",
      address: "Maykop, Russia",
    },
    contact: { email: "admissions@msmi.ru", phone: "+7 XXX XXX XXX" },
    academic: { medium: "English" },
    content: {
      shortDescription:
        "Part of Adyghe State University. NMC approved, English-medium, affordable tuition ~USD 3,000/year.",
      longDescription: "",
      highlights: [],
      gallery: [],
    },
  },
  {
    id: "10",
    name: "Kirov State Medical University",
    shortName: "KSMU",
    slug: "kirov-state-medical-university",
    establishedYear: 1987,
    type: "GOVERNMENT",
    status: "ACTIVE",
    logo: "https://placehold.co/200x200/1A153A/C4953B?text=KSMU",
    bannerImage:
      "https://placehold.co/1200x400/1A153A/FAF9F6?text=Kirov+State+Medical+University",
    location: {
      city: "Kirov",
      country: "Russia",
      state: "Kirov Oblast",
      address: "Kirov, Russia",
    },
    contact: { email: "admissions@ksmu.ru", phone: "+7 XXX XXX XXX" },
    academic: { medium: "English" },
    content: {
      shortDescription:
        "NMC & WHO approved. Research-oriented education. Tuition ~USD 2,100–4,000/year. Strong Indian student community.",
      longDescription: "",
      highlights: [],
      gallery: [],
    },
  },
];
