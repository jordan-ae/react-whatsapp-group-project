# Icons

The project uses **[lucide-react](https://lucide.dev/icons/)** for icons.

```jsx
import { Phone, Video, Search, X } from 'lucide-react';

<Phone size={20} />
<Search size={18} strokeWidth={2} />
```

Icons inherit `currentColor`, so they follow whatever `color` the parent sets —
including the dark theme, with no extra work.

## Why a library

There are currently ~33 hand-written `<svg>` blocks across 12 files. Each one is
a 300-character path string that nobody can read, review, or reuse — and two of
them turned out to be the *same* path used for different meanings (incoming and
missed calls looked identical for a week).

`lucide-react` is tree-shaken, so you only ship the icons you import.

## Which to use

**New icons → lucide.** Search [lucide.dev/icons](https://lucide.dev/icons/) first.

**Existing inline SVGs → leave them.** We are not doing a big-bang migration;
they work. Replace one only when you're already changing that component for
another reason.

**Keep inline when** the shape is bespoke — the WhatsApp logo, the empty-state
illustration, the doodle background. Those aren't icons.

## Sizing

Match the surrounding UI rather than picking a number:

| Context | Size |
|---|---|
| Message meta / ticks | 12–14 |
| List row meta (pin, mute) | 16 |
| Header actions, tab bar | 20–24 |
| Empty-state / hero | 48+ |

## Accessibility

Icons are decorative by default and lucide marks them `aria-hidden`. If an icon
is the *only* content of a control, label the control:

```jsx
<button aria-label="Start a voice call">
  <Phone size={20} />
</button>
```
