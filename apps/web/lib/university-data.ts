export interface University {
  id: string
  name: string
  slug: string
  shortName: string
  image: string
  country: string
  degree: string
  course: string
  type: string
  intake: string
  grade: string
  duration: string
  established: string
  fee: string
  worldRank: string
  medium: string
  ecfmg: string
  specialization: string
  brochureUrl: string
  detailUrl: string
}

export const universities: University[] = [
  {
    id: "jalal-abad-international-university",
    name: "Jalal-Abad International University",
    slug: "jalal-abad-international-university",
    shortName: "JAIU",
    image:
      "https://lh3.googleusercontent.com/p/AF1QipNBy1McRjl6mu1yFfuLLMdw5qbqHHIUHCHPnzJ0=s1360-w1360-h1020-rw",
    country: "Kyrgyzstan",
    degree: "Bachelor",
    course: "Medicine",
    type: "Public",
    intake: "Sep-24",
    grade: "B+",
    duration: "5.8 Yrs of MBBS",
    established: "1951",
    fee: "₹23.41 Lacs",
    worldRank: "8168",
    medium: "English",
    ecfmg: "Approved",
    specialization: "MBBS",
    brochureUrl: "https://wciecorganization.com/img/Brochure/jaiu brochure.pdf",
    detailUrl: "https://wciecorganization.com/jaiu_university",
  },
  {
    id: "jalal-abad-state-university",
    name: "Jalal-Abad State University",
    slug: "jalal-abad-state-university",
    shortName: "JASU",
    image: "https://wciecorganization.com/img/jasu_sq.webp",
    country: "Kyrgyzstan",
    degree: "Bachelor",
    course: "Medicine",
    type: "Public",
    intake: "Sep-24",
    grade: "B+",
    duration: "5.8 Yrs of MBBS",
    established: "1951",
    fee: "₹23.41 Lacs",
    worldRank: "8168",
    medium: "English",
    ecfmg: "Approved",
    specialization: "MBBS",
    brochureUrl: "https://wciecorganization.com/img/Brochure/JASU.pdf",
    detailUrl: "https://wciecorganization.com/jalal_abad_university",
  },
  {
    id: "osh-state-university",
    name: "Osh State University",
    slug: "osh-state-university",
    shortName: "OSU",
    image: "https://wciecorganization.com/img/uni/osh_logo_bg.webp",
    country: "Kyrgyzstan",
    degree: "Bachelor",
    course: "Medicine",
    type: "Public",
    intake: "Sep-24",
    grade: "B+",
    duration: "5.8 Yrs of MBBS",
    established: "1951",
    fee: "₹23.41 Lacs",
    worldRank: "8168",
    medium: "English",
    ecfmg: "Approved",
    specialization: "MBBS",
    brochureUrl: "https://wciecorganization.com/img/Brochure/Osh State.pdf",
    detailUrl: "https://wciecorganization.com/osh_state_university",
  },
  {
    id: "central-asian-international-medical-university",
    name: "The Central Asian International Medical University",
    slug: "central-asian-international-medical-university",
    shortName: "CAIMU",
    image: "https://wciecorganization.com/img/caimuimagwithlogo.png",
    country: "Kyrgyzstan",
    degree: "Bachelor",
    course: "Medicine",
    type: "Public",
    intake: "Sep-24",
    grade: "B+",
    duration: "5.8 Yrs of MBBS",
    established: "1951",
    fee: "₹23.41 Lacs",
    worldRank: "8168",
    medium: "English",
    ecfmg: "Approved",
    specialization: "MBBS",
    brochureUrl: "https://wciecorganization.com/img/Brochure/CAIMU.pdf",
    detailUrl: "https://wciecorganization.com/caimu_university",
  },
  {
    id: "osh-state-medical-university",
    name: "Osh State Medical University",
    slug: "osh-state-medical-university",
    shortName: "OSMU",
    image: "https://wciecorganization.com/img/uni/oshm_logo_bg.webp",
    country: "Kyrgyzstan",
    degree: "Bachelor",
    course: "Medicine",
    type: "Public",
    intake: "Sep-24",
    grade: "B+",
    duration: "5.8 Yrs of MBBS",
    established: "1951",
    fee: "₹23.41 Lacs",
    worldRank: "8168",
    medium: "English",
    ecfmg: "Approved",
    specialization: "MBBS",
    brochureUrl: "https://wciecorganization.com/img/Brochure/osh int 2.pdf",
    detailUrl: "https://wciecorganization.com/osh_university",
  },
];

export function getUniversityBySlug(slug: string): University | undefined {
  return universities.find((u) => u.slug === slug);
}

