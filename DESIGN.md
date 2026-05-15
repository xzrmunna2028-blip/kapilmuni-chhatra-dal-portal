# Design Brief

## Direction
Patriotic Authority — A premium political organization portal combining traditional Bengali patriotic symbolism with modern governance interfaces.

## Tone
Stately, organized, authoritative. Bold patriotic commitment with refined restraint — no garish gradients, structured hierarchy throughout.

## Differentiation
Split red/green architectural language with gold accents echoing Bengali flag symbolism; Bengali typography integrated across key headings and footer; hierarchical committee structure reflects organizational ranking.

## Color Palette

| Token           | OKLCH           | Role                                |
|-----------------|-----------------|-------------------------------------|
| background      | 0.99 0.005 0    | Pure white                          |
| foreground      | 0.15 0.01 155   | Deep forest text                    |
| primary         | 0.42 0.18 155   | Dark green (#006A4E equiv.)         |
| primary-fg      | 0.99 0.005 155  | White-on-green                      |
| accent          | 0.55 0.22 25    | Red (#DC143C equiv.)                |
| accent-fg       | 0.99 0.005 25   | White-on-red                        |
| card            | 1.0 0.0 0       | Off-white cards                     |
| border          | 0.9 0.01 155    | Soft green borders                  |
| chart-1         | 0.55 0.22 25    | Red data accent                     |
| chart-2         | 0.42 0.18 155   | Green data accent                   |

## Typography
- Display: Fraunces — Elegant serif for headings, hero text, Bengali titles
- Body: General Sans — Clean, modern sans for paragraphs, labels, UI
- Mono: JetBrains Mono — Code, timestamps, technical details
- Scale: Hero 5xl/7xl bold tight | H2 3xl/5xl bold | Labels text-sm uppercase | Body text-base/lg

## Elevation & Depth
Subtle card-based hierarchy: white cards on white background with 1px green borders; header elevated with red accent border-bottom; footer grounded dark green with white text. No heavy shadows — restraint over drama.

## Structural Zones

| Zone    | Background           | Border                  | Notes                             |
|---------|----------------------|-------------------------|-----------------------------------|
| Header  | Green (primary)      | Red 2px bottom          | White nav text, logo, language    |
| Hero    | Split red/green      | —                       | White serif text, gold accents    |
| Content | White                | 1px green (card+grid)   | Alternating white/cream sections  |
| Footer  | Green (primary)      | 1px red top             | Bengali copyright, white text     |

## Spacing & Rhythm
Spacious density: section gaps 4rem, content padding 2rem mobile/3rem desktop, micro-spacing 0.5rem. Conservative spacing creates premium feel.

## Component Patterns
- Buttons: Red primary (accent), green secondary, white labels, 6px radius
- Cards: White bg, 1px green border, 6px radius, shadow-sm
- Badges: Green bg + white text for roles, red for urgent
- Committee list: Hierarchical, indented by rank, green headers

## Motion
- Entrance: Fade-in 300ms on scroll
- Hover: Button brightens via opacity + 50ms transition
- Decorative: Subtle gold underlines on Bengali headings

## Constraints
- No full-page gradients — depth via layers only
- Red and green contrast sufficient for AA+; never overlap without white separator
- Bengali text on all key headings, footer; English as secondary in body content
- Footers and headers must maintain green/red split language

## Signature Detail
Split-screen hero section echoing Bengali flag design — red upper section with white Bengali title + gold stars/symbols, green lower section with white curved text — establishes patriotic identity immediately without kitsch.
