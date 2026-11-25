/**
 * Per-structure reference content for the atlas detail panel.
 *
 * Keyed by lowercase structure name (matching atlas.json concept names).
 * Only concepts with an entry get the extended, student-level sections; the
 * rest fall back to the system blurb in anatomy.ts.
 *
 * Sources:
 * - Gray's Anatomy, 1918 edition (public domain)
 * - OpenStax Anatomy & Physiology 2e (CC BY 4.0)
 * - Terminologia Anatomica (structure names)
 */
export interface StructureDetail {
  summary: string;
  quickFacts?: { label: string; value: string }[];
  parts?: string[];
  articulations?: string[];
  features?: string[];
  development?: string;
  clinical?: string[];
  bloodSupply?: string;
  nerveSupply?: string;
  sources?: string[];
}

export const STRUCTURE_DETAILS: Record<string, StructureDetail> = {
  'frontal bone': {
    summary:
      'Unpaired flat bone of the cranial vault that forms the forehead, the roofs of both orbits and the floor of the anterior cranial fossa. The frontal sinuses are hollowed out between its outer and inner tables, and the bone also contributes to the root of the nose.',
    quickFacts: [
      { label: 'Type', value: 'Flat bone (cranial vault)' },
      { label: 'Location', value: 'Anterior cranium' },
      { label: 'Ossification', value: 'Intramembranous, two centres' },
      { label: 'Sutures', value: 'Coronal, metopic, fronto-ethmoidal' },
    ],
    parts: [
      'Squamous part — vertical portion forming the forehead and temple region',
      'Orbital parts — two horizontal plates forming the orbital roofs',
      'Nasal part — small midline portion between the orbits, forming the nasal root',
    ],
    articulations: [
      'Parietal bones — coronal suture',
      'Sphenoid (greater wing and body) — frontosphenoid suture',
      'Ethmoid — ethmoidal notch and cribriform plate',
      'Zygomatic bones — frontozygomatic suture',
      'Maxillae — frontomaxillary suture at the orbital margin',
      'Nasal bones — frontonasal suture',
      'Lacrimal bones — anterior lacrimal crest',
    ],
    features: [
      'Supraorbital margin, notch and foramen',
      'Superciliary arches and glabella between them',
      'Frontal crest and sagittal sulcus on the inner surface',
      'Foramen cecum at the front of the cribriform plate',
      'Frontal sinus draining through the frontonasal duct',
      'Zygomatic process, nasal spine, trochlear fovea and spine',
    ],
    development:
      'Develops by intramembranous ossification from two primary centres in the mesenchyme of the forehead; the halves are separated at birth by the metopic (frontal) suture, which fuses in the first years of life. If it persists it forms a metopic suture. The frontal sinus is a postnatal pneumatisation of the bone, becoming radiographically visible around 6–7 years.',
    clinical: [
      'Frontal sinusitis and mucocele formation, obstructing the frontonasal duct',
      'Depressed frontal fractures; involvement of the posterior table can tear dura and cause CSF rhinorrhoea or pneumocephalus',
      'Pott puffy tumour — osteomyelitis of the frontal bone with subperiosteal abscess',
      'Orbital roof fractures with intraorbital haematoma or enophthalmos',
      'Supraorbital neuralgia from compression of the supraorbital nerve',
    ],
    bloodSupply:
      'Supraorbital and supratrochlear arteries (branches of the ophthalmic artery) supply the forehead; anterior branches of the superficial temporal artery reach the lateral part; diploic veins drain the marrow, and the middle meningeal artery supplies the dural surface of the inner table.',
    nerveSupply:
      'Supraorbital and supratrochlear nerves, terminal branches of the ophthalmic division (V1) of the trigeminal nerve, supply the skin and pericranium of the forehead.',
    sources: [
      "Gray's Anatomy (1918), public domain",
      'OpenStax A&P 2e §7.1, §8.1 (CC BY 4.0)',
    ],
  },
  heart: {
    summary:
      'Four-chambered muscular pump in the middle mediastinum that drives blood through the pulmonary and systemic circuits. Its wall is built of cardiac muscle, its chambers are lined by endocardium, and its valves keep flow unidirectional.',
    quickFacts: [
      { label: 'Weight', value: '250–350 g' },
      { label: 'Location', value: 'Middle mediastinum, behind sternum' },
      { label: 'Chambers', value: '2 atria, 2 ventricles' },
      { label: 'Rate', value: '~60–100 beats/min at rest' },
    ],
    parts: [
      'Right atrium — receives superior and inferior vena cava and coronary sinus',
      'Right ventricle — pumps blood into the pulmonary trunk',
      'Left atrium — receives the four pulmonary veins',
      'Left ventricle — thickest wall; pumps into the aorta',
      'Fibrous skeleton — four valve rings and the membranous septum',
    ],
    features: [
      'Tricuspid, pulmonary, mitral and aortic valves',
      'Coronary sulcus and anterior/interventricular sulci',
      'Interatrial and interventricular septa',
      'Chordae tendineae and papillary muscles',
      'Coronary arteries and cardiac veins on the epicardial surface',
    ],
    development:
      'Forms from the cardiogenic mesoderm as a linear heart tube that loops and septates into four chambers; the fetal circulation bypasses the lungs through the foramen ovale and ductus arteriosus, both of which close after birth.',
    clinical: [
      'Myocardial infarction from coronary artery occlusion',
      'Valvular stenosis or regurgitation, often post-rheumatic',
      'Atrial fibrillation with risk of thromboembolism',
      'Heart failure from systolic or diastolic dysfunction',
      'Congenital defects such as septal defects and patent ductus arteriosus',
    ],
    bloodSupply:
      'Right and left coronary arteries arise from the aortic sinuses; the left divides into anterior interventricular and circumflex branches. Cardiac veins drain into the coronary sinus and thence the right atrium.',
    nerveSupply:
      'Sympathetic fibres from the cardiac plexus increase rate and contractility; parasympathetic fibres from the vagus nerve slow the sinoatrial and atrioventricular nodes.',
    sources: [
      "Gray's Anatomy (1918), public domain",
      'OpenStax A&P 2e §19 (CC BY 4.0)',
    ],
  },
  femur: {
    summary:
      'Long bone of the thigh and the longest, strongest bone in the body. It transmits body weight from the hip to the tibia, gives attachment to the major muscles of the hip and thigh, and contains the marrow where blood cells are produced in adults.',
    quickFacts: [
      { label: 'Type', value: 'Long bone' },
      { label: 'Length', value: '~26% of body height' },
      { label: 'Proximal', value: 'Head, neck, greater/lesser trochanters' },
      { label: 'Distal', value: 'Condyles, epicondyles, patellar surface' },
    ],
    parts: [
      'Head — hemispherical, articulates with the acetabulum',
      'Neck — angled at ~125° to the shaft in adults',
      'Greater and lesser trochanters — muscle attachments',
      'Shaft (body) — with linea aspera posteriorly',
      'Distal condyles and intercondylar fossa',
    ],
    features: [
      'Fovea capitis for the ligament of the head',
      'Intertrochanteric line and crest',
      'Linea aspera, pectineal and gluteal lines',
      'Adductor tubercle on the medial epicondyle',
      'Nutrient foramen on the linea aspera',
    ],
    development:
      'Ossifies from a primary centre in the shaft and secondary centres in the head, greater trochanter and distal condyles; the distal epiphysis is the first to appear and the last to fuse, making the knee a reliable site for skeletal age estimation.',
    clinical: [
      'Fracture of the neck — common in osteoporosis; risk of avascular necrosis of the head',
      'Intertrochanteric and subtrochanteric fractures',
      'Femoral shaft fractures with significant blood loss',
      'Distal femoral fractures involving the knee joint',
      'Femoral anteversion and coxa vara/valga affecting gait',
    ],
    bloodSupply:
      'Medullary artery from the linea aspera supplies the shaft; retinacular branches of the circumflex femoral arteries supply the neck and head; a small contribution reaches the head through the ligament of the head (artery of the ligamentum teres).',
    nerveSupply:
      'Femoral nerve and its branches supply the anterior compartment; obturator nerve the medial compartment; sciatic nerve the posterior compartment. The bone itself is innervated by periosteal branches of these nerves.',
    sources: [
      "Gray's Anatomy (1918), public domain",
      'OpenStax A&P 2e §6.2, §8.4 (CC BY 4.0)',
    ],
  },
};

export function detailFor(name: string | undefined): StructureDetail | undefined {
  if (!name) return undefined;
  return STRUCTURE_DETAILS[name.toLowerCase().trim()];
}
