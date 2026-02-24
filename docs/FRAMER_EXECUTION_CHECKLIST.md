# Framer Stabilization Checklist (Execution)

## 1) Project Safety
- Duplicate current production project to `staging`.
- Apply all edits in staging only.
- Publish staging URL and run full QA before promoting.

## 2) Data Import
- Import `framer-import/products.collection.patched.csv` into `Products`.
- Import `framer-import/bundles.collection.patched.csv` into `Bundles`.
- Confirm counts: `Products=42`, `Bundles=8`.
- Confirm slug uniqueness in both collections.

## 3) Card Component Contract
- Card container click target: `card_link_url`.
- Primary CTA button link: `buy_link_url`.
- Secondary CTA button link: `sample_or_secondary_url`.
- Add static text link on card: `View details`.
- Remove any card wrapper link set to `./` or `#`.

## 4) Home Page Contract
- Header container: centered, max-width locked, fixed horizontal padding.
- Hero H1 exact text: `Build faster with production-ready AI prompts, skills, and agents`.
- Ask Agent input below hero.
- Featured products module filters `home_featured=Y` and `type=product` (8 cards).
- Featured bundles module filters `home_featured=Y` and `type=bundle` (4 cards).
- Remove template placeholder sections not related to store conversion.

## 5) Catalog + Bundles Contract
- Catalog filters: category, compatibility, format, price range, trading toggle.
- Bundles filters: vertical, market type, execution mode, price range.
- Add active filter chips + clear-all action.
- Card body must open detail route. Buy stays checkout only.

## 6) Detail Page Contract
- Product detail route: `/products/[slug]`.
- Bundle detail route: `/bundles/[slug]`.
- Single centered container (no unused side columns).
- Required sections:
  - Title + short description
  - Pricing block (`price_label`, `compare_at_label`, `savings_label`)
  - Compatibility
  - Included files / included products
  - License + delivery note
  - Related products/bundles
  - Buy CTA
- Show disclosure panel only when `disclosure_required=Y`.

## 7) Content Contract
- FAQ must be purchase/store focused (not chatbot help).
- Terms/License/Policy pages include:
  - License scope
  - Redistribution restrictions
  - Updates/support boundary
  - Trading/live disclosure language

## 8) QA Gate (Must Pass Before Promote)
- Home:
  - Hero text exact match
  - Featured cards visible (8 products, 4 bundles)
  - No overlap/misalignment
- Routing:
  - Card body opens correct detail page
  - Buy CTA opens checkout URL
  - No click returns to top of home unless intentional
- Responsive:
  - Mobile, tablet, desktop, wide-desktop verified
  - Header does not stretch/break
  - Footer alignment stable
- Content:
  - No template placeholder copy
  - FAQ/terms/license copy is store-accurate

