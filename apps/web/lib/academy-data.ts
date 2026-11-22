/**
 * Shiksha Academy syllabus data.
 * 19 FMGE/NExT subjects grouped by pre-clinical, para-clinical and clinical.
 * Slugs match the links generated in the landing header mega menu.
 */

export const academyGroups = ["Pre-clinical", "Para-clinical", "Clinical"] as const;
export type AcademyGroup = (typeof academyGroups)[number];

export interface AcademySubject {
  slug: string;
  name: string;
  group: AcademyGroup;
  blurb: string;
  topics: string[];
}

export const academySubjects: AcademySubject[] = [
  // ─── Pre-clinical ───
  {
    slug: "anatomy",
    name: "Anatomy",
    group: "Pre-clinical",
    blurb: "Structure of the human body: from tissues and systems to clinical surface anatomy.",
    topics: [
      "General Anatomy & Terminology",
      "Osteology, Arthrology & Myology",
      "Angiology & Neurology",
      "Regional Anatomy",
      "Neuroanatomy",
      "Embryology",
      "Histology",
      "Topographic & Sectional Anatomy",
      "Surface & Radiological Anatomy",
      "Human Genetics",
    ],
  },
  {
    slug: "physiology",
    name: "Physiology",
    group: "Pre-clinical",
    blurb: "How the body works: cells, blood, nerves, organs and the systems that keep them in balance.",
    topics: [
      "Cell & Membrane Physiology",
      "Blood & Haemostasis",
      "Nerve & Muscle",
      "Gastrointestinal Tract",
      "Kidney & Acid–Base Balance",
      "Cardiovascular System",
      "Respiratory System",
      "Endocrinology",
      "Reproduction",
      "Central Nervous System",
      "Special Senses",
    ],
  },
  {
    slug: "biochemistry",
    name: "Biochemistry",
    group: "Pre-clinical",
    blurb: "The chemistry of life: molecules, enzymes, metabolism and the basis of laboratory medicine.",
    topics: [
      "Cell & Subcellular Structures",
      "pH, Buffers & Isotopes",
      "Carbohydrates, Lipids & Proteins",
      "Enzymes & Vitamins",
      "Biological Oxidation",
      "Intermediary Metabolism",
      "Purine & Pyrimidine Metabolism",
      "Biochemical Genetics",
      "Liver Function & Nutrition",
    ],
  },

  // ─── Para-clinical ───
  {
    slug: "pathology",
    name: "Pathology",
    group: "Para-clinical",
    blurb: "Disease processes: cell injury, inflammation, neoplasia and organ-wise pathology.",
    topics: [
      "Cell Injury & Adaptation",
      "Inflammation & Repair",
      "Immunopathology & Neoplasia",
      "Haematology",
      "Cardiovascular Pathology",
      "Respiratory & Renal Pathology",
      "Hepato-Biliary Pathology",
      "Endocrine & Neuropathology",
      "Dermato- & Ocular Pathology",
    ],
  },
  {
    slug: "microbiology",
    name: "Microbiology",
    group: "Para-clinical",
    blurb: "Infectious agents, immunity and the laboratory diagnosis of infection.",
    topics: [
      "General Microbiology",
      "Immunology",
      "Bacteriology",
      "Virology",
      "Mycology",
      "Parasitology",
      "Clinical & Applied Microbiology",
    ],
  },
  {
    slug: "pharmacology",
    name: "Pharmacology",
    group: "Para-clinical",
    blurb: "How drugs act, how they are used, and how to prescribe them safely and rationally.",
    topics: [
      "General Pharmacology & Kinetics",
      "Autonomic Nervous System",
      "Cardiovascular & Renal Drugs",
      "Diuretics & Autocoids",
      "Endocrine Pharmacology",
      "CNS & Psychopharmacology",
      "Chemotherapy",
      "Toxicology & Rational Prescribing",
    ],
  },
  {
    slug: "forensic-medicine",
    name: "Forensic Medicine",
    group: "Para-clinical",
    blurb: "Law, ethics and medicine: consent, injuries, postmortem findings and toxicology.",
    topics: [
      "Medical Jurisprudence & Ethics",
      "Consent & Documentation",
      "Postmortem Changes",
      "Forensic Identification",
      "Injuries & Wound Interpretation",
      "Toxicology & Poisoning",
      "Asphyxia & Sexual Offences",
    ],
  },
  {
    slug: "community-medicine-psm",
    name: "Community Medicine (PSM)",
    group: "Para-clinical",
    blurb: "Public health: epidemiology, biostatistics, disease control and health programmes.",
    topics: [
      "Epidemiology & Study Designs",
      "Biostatistics",
      "Screening & Surveillance",
      "Communicable Diseases",
      "Non-communicable Diseases",
      "Health Programmes",
      "Environmental & Occupational Health",
      "Health Management",
    ],
  },

  // ─── Clinical ───
  {
    slug: "medicine",
    name: "Medicine",
    group: "Clinical",
    blurb: "Diagnosis and management of adult medical illness across every major system.",
    topics: [
      "Cardiology & ECG",
      "Respiratory Medicine",
      "Gastroenterology & Hepatology",
      "Nephrology & Electrolytes",
      "Endocrinology & Diabetes",
      "Neurology",
      "Infectious Diseases",
      "Haematology & Rheumatology",
      "Critical Care",
    ],
  },
  {
    slug: "general-surgery",
    name: "General Surgery",
    group: "Clinical",
    blurb: "Surgical principles, emergency care and the operative management of common disease.",
    topics: [
      "Surgical Principles & Shock",
      "Wound Care & Trauma",
      "Acute Abdomen",
      "GI & Hepatobiliary Surgery",
      "Breast & Thyroid Surgery",
      "Vascular & Urologic Surgery",
      "Burns & Hernia",
    ],
  },
  {
    slug: "obstetrics-gynaecology",
    name: "Obstetrics & Gynaecology",
    group: "Clinical",
    blurb: "Pregnancy, childbirth and women's health: from antenatal care to gynaecological practice.",
    topics: [
      "Antenatal Care",
      "Labour & Delivery",
      "Postpartum Care",
      "Obstetric Emergencies",
      "Gynaecological Disorders",
      "Fertility & Contraception",
      "Oncology in OBG",
    ],
  },
  {
    slug: "paediatrics",
    name: "Paediatrics",
    group: "Clinical",
    blurb: "Child health: growth, development, nutrition, infection and paediatric emergencies.",
    topics: [
      "Growth & Development",
      "Neonatology",
      "Paediatric Nutrition",
      "Vaccination & Preventive Care",
      "Paediatric Infectious Diseases",
      "Paediatric Cardiology & Respiratory",
      "Paediatric Emergencies",
    ],
  },
  {
    slug: "ophthalmology",
    name: "Ophthalmology",
    group: "Clinical",
    blurb: "Eye anatomy, examination and the management of common sight-threatening conditions.",
    topics: [
      "Ocular Anatomy & Examination",
      "Refractive Errors",
      "Cataract & Glaucoma",
      "Red Eye & Uveitis",
      "Retina & Optic Nerve",
      "Ocular Trauma & Squint",
    ],
  },
  {
    slug: "ent",
    name: "ENT",
    group: "Clinical",
    blurb: "Ear, nose and throat: hearing, balance, sinus disease and airway emergencies.",
    topics: [
      "Ear & Hearing",
      "Vertigo & Otitis Media",
      "Nose & Sinuses",
      "Epistaxis",
      "Throat, Tonsils & Voice",
      "Swallowing & Neck Emergencies",
    ],
  },
  {
    slug: "dermatology",
    name: "Dermatology",
    group: "Clinical",
    blurb: "Skin, hair and nails: morphology, infections, inflammatory disease and STDs.",
    topics: [
      "Skin Lesion Morphology",
      "Eczema & Psoriasis",
      "Pigmentary Disorders",
      "Infections & Infestations",
      "Leprosy & STDs",
      "Drug Eruptions",
    ],
  },
  {
    slug: "psychiatry",
    name: "Psychiatry",
    group: "Clinical",
    blurb: "Mental health assessment and the management of psychiatric illness and emergencies.",
    topics: [
      "Psychiatric Assessment",
      "Mood & Anxiety Disorders",
      "Psychotic Disorders",
      "Substance Use",
      "Suicidality & Emergencies",
      "Sleep & Psychotropic Drugs",
    ],
  },
  {
    slug: "anaesthesiology",
    name: "Anaesthesiology",
    group: "Clinical",
    blurb: "Anaesthetic assessment, airway, monitoring, resuscitation and perioperative care.",
    topics: [
      "Pre-anaesthetic Assessment",
      "Airway Management",
      "Monitoring & Ventilation",
      "Resuscitation",
      "General Anaesthesia",
      "Regional Anaesthesia",
      "Perioperative Care",
    ],
  },
  {
    slug: "radiology",
    name: "Radiology",
    group: "Clinical",
    blurb: "Imaging principles, radiation safety and interpretation of common radiological findings.",
    topics: [
      "X-ray, USG, CT & MRI Principles",
      "Radiation Protection",
      "Chest Imaging",
      "Abdominal Imaging",
      "Musculoskeletal Imaging",
      "Neuroimaging",
      "Radiotherapy",
    ],
  },
  {
    slug: "orthopaedics",
    name: "Orthopaedics",
    group: "Clinical",
    blurb: "Bones, joints and spine: trauma, degenerative disease, tumours and reconstruction.",
    topics: [
      "Fractures & Dislocations",
      "Bone Healing & Grafts",
      "Spine Disorders",
      "Joint Pathology",
      "Bone Tumours & Infections",
      "Paediatric Orthopaedics",
      "Sports Injuries",
    ],
  },
];

export function findSubject(slug?: string): AcademySubject | undefined {
  return academySubjects.find((subject) => subject.slug === slug);
}

export function subjectHref(slug: string): string {
  return `/shiksha-academy?subject=${slug}`;
}

export function subjectsByGroup(group: AcademyGroup): AcademySubject[] {
  return academySubjects.filter((subject) => subject.group === group);
}

export const totalAcademyTopics = academySubjects.reduce(
  (total, subject) => total + subject.topics.length,
  0,
);
