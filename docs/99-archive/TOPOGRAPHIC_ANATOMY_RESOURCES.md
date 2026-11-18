# Topographic Anatomy Resources

Last checked: 2026-11-18

Topographic anatomy here means regional, cross-sectional, and surface anatomy: body regions, CT/MRI cross-sections, and landmark-based surface anatomy. The hard part is not finding anatomy images; it is finding assets that are legally safe for a commercial platform.

**Rule:** "free to view" does not mean "free to reuse." For Shiksha, use CC BY, CC BY-SA, CC0, public domain, or BSD-style assets only. Avoid CC BY-NC, CC BY-ND, and unlicensed copyrighted material unless you have written permission.

---

## Commercial-safe resources

| Resource | Type | License | Notes |
|---|---|---|---|
| [BodyParts3D / Anatomography](https://dbarchive.biosciencedbc.jp/en/bodyparts3d/desc.html) | 3D whole-body models, ~3,210 meshes | CC BY 4.0 (current release) | Best fit for the existing 3D atlas. Older BodyParts3D releases may use CC BY 2.1 Japan; verify the exact version. Attribution required. |
| [Open Anatomy Project atlases](https://www.openanatomy.org/atlas-pages) | 3D regional atlases: brain, head/neck, thorax, abdomen, knee, liver, inner ear | 3D Slicer License §B (BSD-like) | Commercial use allowed. Keep the copyright notice. Good anatomical detail but not a single whole-body atlas. |
| [Visible Human Project](https://www.nlm.nih.gov/research/visible/visible_human.html) | Cadaver cross-sections, CT, MRI | Public domain | NLM no longer requires a license as of 2019. Large files, no prebuilt labels. Review donor/ethics context before public marketing use. |
| [SIO Visible Human Male](https://www.virtual-body.org/news/3d-anatomy-model-published-under-cc-license) | 200+ segmented internal organs, 3D voxel, TIFF | CC BY 4.0 | New 2025 release. Good organ detail. Needs conversion or a custom viewer. |
| [Human Organ Atlas](https://human-organ-atlas.esrf.fr/) | 3D/2D organ imaging | CC BY 4.0 | Strong organ detail. Not whole-body regional anatomy. Datasets are large. |
| [Gray's Anatomy 1918](https://www.bartleby.com/lit/collections/anatomy-of-the-human-body/) | 2D historic plates | Public domain | Free and commercial-safe, but old terminology and illustration style. |
| [Wikimedia Commons anatomy](https://commons.wikimedia.org/wiki/Category:Human_anatomy) | Mixed 2D/3D | Mixed | Filter to CC0, CC BY, CC BY-SA, or public domain. Check every file; many are NC or unlicensed. |

### CC BY-SA caveat

CC BY-SA is commercial-safe, but adaptations must be shared under the same license. Using an unmodified image with attribution is usually manageable. Building a proprietary derivative model or illustration set around it needs legal review.

---

## Free to view, not safe to embed commercially

| Resource | License | Restriction |
|---|---|---|
| [OpenStax Anatomy & Physiology 2e](https://openstax.org/details/books/anatomy-and-physiology-2e) | CC BY-NC-SA 4.0 | Current edition bars commercial use. The 1e preface still says CC BY 4.0, but the live site shows NC-SA. Treat as NC unless an archived CC BY copy is verified. |
| [Anatomy Atlases: Atlas of Human Anatomy in Cross Section](https://www.anatomyatlases.org/HumanAnatomy/CrossSectionAtlas.shtml) | CC BY-NC-SA 4.0 | Exactly the topographic cross-section style, but no commercial use. |
| [Bassett Collection](https://www.nlm.nih.gov/exhibition/bassett/bassett_1.html) | CC BY-NC-SA 3.0 | Stereoscopic cadaver images. No commercial use. |
| [UBC Clinical Anatomy](https://clinicalanatomy.ca/) | CC BY-NC-SA 4.0 | Regional anatomy, images, and 3D. No commercial use. |
| [eSkeletons](https://www.eskeletons.org/) | CC BY-NC-SA 2.0 | Skeleton only. No commercial use. |
| [AnatomyTOOL](https://anatomytool.org/) | Mixed | Aggregator. Many items are CC BY-NC-SA or copyrighted. Check each asset. |
| [Z-Anatomy](https://github.com/Z-Anatomy/Models-of-human-anatomy) | CC BY-SA 4.0, some models NC | Share-alike applies. Some included models (inner ear, kidney) are non-commercial. Do not ship the full bundle. |
| Netter, Visible Body, Complete Anatomy | Paid | No reuse without a license. |

---

## Recommended implementation for Shiksha

1. **Keep the current 3D atlas as the base.** `apps/atlas` uses BodyParts3D-derived data under CC BY 4.0. Preserve `LICENSE` and `ATTRIBUTION.md` and keep the attribution visible in the UI.
2. **Build 2D topographic plates in-house.** Use Visible Human cross-sections, public-domain Gray's plates, and other commercial-safe sources. Add labels and callouts yourself so the layout matches Shiksha.
3. **Do not embed NC atlases in a paid product.** Anatomy Atlases, Bassett, and UBC Clinical Anatomy are useful references, not source assets. Link out or license them commercially.
4. **Treat Z-Anatomy as a mixed bundle.** Use only the BodyParts3D subset, or remove the NC models. Share-alike obligations still apply to adapted models.
5. **Use Open Anatomy Project atlases for regional detail.** Brain, head/neck, thorax, abdomen, and knee are useful supplements. They are not a replacement for a whole-body atlas.
6. **Keep attribution visible.** Add a credits/sources page and include the license text for every external asset.

---

## License checklist

- [ ] Confirm the exact license for every image or mesh, not just the parent site.
- [ ] Record source URL, author, license, and retrieval date in a credits file.
- [ ] Reject CC BY-NC, CC BY-ND, and unlicensed copyrighted assets for commercial use.
- [ ] Check third-party exceptions in aggregate datasets.
- [ ] Keep a local copy of the license text used at retrieval time; sites can change terms.
- [ ] For CC BY-SA adaptations, confirm share-alike obligations with legal.
- [ ] For 3D datasets, confirm the license covers derived meshes and renders, not only raw data.
- [ ] Review donor consent and ethics before using cadaver images in public marketing.
