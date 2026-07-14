# Asset Requirements

Every photography slot on the site renders a clearly labelled development
placeholder until a real, approved image exists. **Never** fill a slot with a
stock photo presented as members or staff, an AI-generated person, or any
image the subject has not consented to for this use.

Supply final images to `public/images/` and pass `src`/`alt` to the
`ImageSlot` component at each location below.

## Global specifications

- Format: AVIF or WebP preferred (JPEG acceptable), sRGB
- Colour mood: warm, natural light; ivory/espresso tones; no heavy filters
- People: real adults who signed a model release for this exact use
- No direct-to-camera grinning stock poses; candid and editorial
- Respectful diversity across ages (30s–60s), ethnicities, and body types
- No wealth props (sports cars, champagne towers, yachts)

## Required images

### 1. Hero editorial relationship image
- Location: homepage hero (`components/marketing/Hero.tsx`)
- Orientation: portrait, 4:5, minimum 1600×2000px
- Subject: two adults mid-conversation at a table or walking; faces may be
  angled away; warmth over glamour
- Lighting: golden-hour or warm interior window light

### 2. Discreet consultation environment
- Location: philosophy section (`components/marketing/Philosophy.tsx`)
- Orientation: portrait, 4:5, minimum 1600×2000px
- Subject: calm sitting room / study with two chairs; no people required
- Mood: quiet, private, lived-in rather than showroom

### 3. Mature social interaction (reserve)
- Future use: how-it-works page
- Orientation: landscape, 3:2, minimum 2400×1600px
- Subject: small dinner or café scene, adults 35+, natural laughter not
  performed laughter

### 4. Service-team image (only when real)
- Future use: about page, only once real staff consent to appear
- Orientation: landscape, 3:2, minimum 2400×1600px
- Hard rule: real Real Match staff only, named with consent — never models

### 5. Lifestyle detail (optional)
- Orientation: either
- Subject: hands pouring tea, a bookshop shelf, a coastal path — texture
  images with no people

## Alt text

Every final image must ship with specific, human-written alt text describing
what is actually pictured (not marketing copy).
