# Histology Resources

Last checked: 2026-11-18

Free 2D histology is abundant. Free 3D histology is limited and mostly research-grade. The hard part is not finding images; it is finding assets that are legally safe for a commercial platform.

**Rule:** "free to view" does not mean "free to reuse." For Shiksha, use CC BY, CC BY-SA, CC0, or BSD assets only. Avoid CC BY-NC, CC BY-ND, and unlicensed copyrighted material unless you have written permission.

---

## Commercial-safe resources

| Resource | Type | License | Notes |
|---|---|---|---|
| [Human Protein Atlas](https://www.proteinatlas.org/about/licence) | 2D IHC histology images, large collection | CC BY 4.0 | Commercial use allowed with attribution. Images are IHC, not H&E. Check third-party image exceptions. Older HPA versions had different licenses; verify the version you archive. |
| [PLISM dataset](https://www.nature.com/articles/s41597-024-03122-5) | 2D whole-slide + phone images | CC BY 4.0 | Research/ML dataset. Not a labeled teaching atlas. |
| [Human Organ Atlas](https://human-organ-atlas.esrf.fr/) | 3D intact organs, 0.65-20 µm resolution | CC BY 4.0 | Closest available resource to 3D histology. Browser viewer. Datasets are large; the largest is over 14 TB. |
| [HuBMAP Data Portal](https://portal.hubmapconsortium.org/) | 2D tissue data + spatial data | CC BY 4.0 | Includes histology and spatial assays. |
| [Human Reference Atlas 3D Reference Objects](https://humanatlas.io/3d-reference-library) | 3D GLB organ models | CC BY 4.0 | Anatomically correct organ models. Not labeled histology. |
| [GCA-Models](https://github.com/Comparative-Pathology/GCA-Models) | 2D/3D gut models | CC BY 4.0 | Niche. Useful only for gut-specific content. |
| [Open Michigan Histology Laboratory Drawings](https://open.umich.edu/find/open-educational-resources/medical/histology-laboratory-drawings) | 2D hand-drawn histology sketches | CC BY-SA | Basic teaching. Share-alike applies to adaptations. |
| [Histopia](https://github.com/oncologylab/histopia) | 3D serial-section histology viewer/code | BSD-3-Clause (code) | Research software. Mouse demo data license is not clear; treat demo data as reference only. |

### CC BY-SA caveat

CC BY-SA is commercial-safe, but adaptations of the licensed material must be shared under the same license. That can complicate proprietary content. For images used unchanged with attribution, it is usually manageable; get legal review before building a derivative design system around it.

---

## Free to view, not safe to embed commercially

| Resource | License | Restriction |
|---|---|---|
| [Digital Histology (VCU)](https://digitalhistology.org/credits/) | CC BY-NC-SA 4.0 | No commercial use. |
| [Michigan Histology](https://histology.medicine.umich.edu/) | CC BY-NC-SA 4.0 | No commercial use. AI training for commercial use is explicitly prohibited. Commercial licensing available via `innovationpartnerships@umich.edu`. |
| [Open University virtual microscope](https://learn5.open.ac.uk/course/format/sciencelab/section.php?name=histology_microscope) | CC BY-NC-SA 4.0 | No commercial use. |
| [Histology Guide](https://histologyguide.org/) | Copyrighted | Link out only. Copying, displaying, modifying, or distributing is prohibited. |
| [Iowa Virtual Slidebox](https://www.mbfbioscience.com/iowavirtualslidebox) | Copyrighted | Free viewer, about 1,000 slides. No reuse. |
| [Virtual Microscopy Database](https://www.virtualmicroscopydatabase.org/) | Membership terms | Free for eligible faculty, not an open license. |
| [NUS Pathweb](https://medicine.nus.edu.sg/pathweb/virtual-pathology-museum) | Copyrighted | Normal histology is open access; reuse needs permission. |
| [AnatomyTOOL histology collection](https://anatomytool.org/content/histology-collection-page) | Mixed | Aggregator. Check every linked item; many are CC BY-NC-SA or copyrighted. |

---

## 3D histology research datasets

| Resource | Type | Notes |
|---|---|---|
| [3DCPath-datasets](https://github.com/mahmoodlab/3DCPath-datasets) | Index of 3D computational pathology datasets | Licenses vary by dataset. Sizes range from tens of GB to hundreds of GB. |
| [Human Organ Atlas](https://human-organ-atlas.esrf.fr/) | 3D organ imaging | Best current open 3D organ resource. Not a labeled histology teaching atlas. |
| [HuBMAP](https://portal.hubmapconsortium.org/) | 3D tissue maps + histology | Research data. Expect custom ingestion and coordinate work. |
| [Histopia](https://oncologylab.github.io/histopia) | 3D serial-section viewer demo | Useful as a technical reference for 3D reconstruction. Mouse data. |

**Important:** there is no drop-in, labeled, free 3D histology atlas equivalent to the 3D anatomy atlas used in `apps/atlas`. True 3D histology means large datasets, registration, segmentation, and a custom viewer.

---

## Recommended implementation for Shiksha

1. **Start with 2D histology.** Build a viewer route like `/histology` using a whole-slide viewer such as OpenSeadragon, with OpenSlide/Deep Zoom tiles on the backend.
2. **Use commercial-safe sources first.** Human Protein Atlas and PLISM are the safest starting points. HPA is best for tissue/protein context; PLISM is research/ML-oriented.
3. **Need a structured teaching set?** License Michigan Histology or Digital Histology commercially, or build your own slide collection. Do not copy their images into the repo.
4. **3D is a later phase.** For V1, link to the Human Organ Atlas or use HuBMAP GLB organ models. Do not self-host a full 3D histology pipeline in the admission platform.
5. **Keep attribution visible.** Add a credits/sources page and include license text for every external asset.

---

## License checklist

- [ ] Confirm the exact license for every image, not just the parent site.
- [ ] Record source URL, author, license, and retrieval date in a credits file.
- [ ] Reject CC BY-NC, CC BY-ND, and unlicensed copyrighted teaching slides for commercial use.
- [ ] Check third-party exceptions in aggregate databases.
- [ ] Keep a local copy of the license text used at retrieval time; sites can change terms.
- [ ] For CC BY-SA adaptations, confirm share-alike obligations with legal.
- [ ] For 3D datasets, check whether the license covers derived meshes/renders, not only raw data.
