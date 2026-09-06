# 002 — Navbar: sync the drawer backdrop with the drawer's own transition

- **Status:** DONE
- **Commit at audit time:** d48bba7
- **Severity:** HIGH
- **Category:** Physicality / Cohesion
- **File:** `src/components/Navbar.jsx`

## Problem

```jsx
// src/components/Navbar.jsx
{menuOpen && (
  <div
    className="fixed inset-0 bg-black/65 backdrop-blur-[4px] z-[1040]"
    onClick={() => setMenuOpen(false)}
  />
)}
<aside
  className={`fixed top-0 left-0 w-[86%] max-w-[380px] h-screen bg-dark-navy shadow-[10px_0_30px_rgba(0,0,0,0.6)] z-[1050] flex flex-col px-7 py-7 transition-transform duration-300 overflow-y-auto ${
    menuOpen ? 'translate-x-0' : '-translate-x-full'
  }`}
  aria-hidden={!menuOpen}
>
```

The `<aside>` drawer is always mounted and animates correctly — its
`transition-transform duration-300` interpolates between
`-translate-x-full` and `translate-x-0` because the element persists across
the state change. The backdrop `<div>` right above it is conditionally
*mounted* (`{menuOpen && <div>}`), so it has no transition of its own to
run: it's simply absent, then present at full `bg-black/65` opacity the
instant `menuOpen` flips true. Observed directly in-browser: the scrim goes
fully dark before the drawer finishes its 300ms slide, so the two elements
that are supposed to open together visibly desync. This nav drawer is now
the site's only navigation surface (used at every viewport width), so this
runs on effectively every navigation interaction.

## Target fix

Mount the backdrop unconditionally (like the `<aside>`) and drive its
opacity the same way the drawer's transform is driven — with a toggled
class plus `transition-opacity duration-300` matching the drawer's own
duration exactly, so both animate in lockstep:

```jsx
<div
  className={`fixed inset-0 bg-black/65 backdrop-blur-[4px] z-[1040] transition-opacity duration-300 ${
    menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
  }`}
  onClick={() => setMenuOpen(false)}
  aria-hidden="true"
/>
<aside
  className={`fixed top-0 left-0 w-[86%] max-w-[380px] h-screen bg-dark-navy shadow-[10px_0_30px_rgba(0,0,0,0.6)] z-[1050] flex flex-col px-7 py-7 transition-transform duration-300 overflow-y-auto ${
    menuOpen ? 'translate-x-0' : '-translate-x-full'
  }`}
  aria-hidden={!menuOpen}
>
```

Key details:
- `pointer-events-none` when closed is required now that the div is always
  in the DOM — otherwise it would silently block clicks on whatever is
  underneath it even while invisible.
- `duration-300` on the backdrop matches the `<aside>`'s own `duration-300`
  exactly — this is the whole point of the fix, don't pick a different
  number.
- `aria-hidden="true"` on the backdrop (it's decorative/a click-catcher,
  never contains content a screen reader should announce).

## Steps

1. Open `src/components/Navbar.jsx`.
2. Find the `{menuOpen && (<div className="fixed inset-0 bg-black/65 backdrop-blur-[4px] z-[1040]" ...>)}` block.
3. Remove the `{menuOpen && ( ... )}` conditional wrapper so the div always
   renders.
4. Add `transition-opacity duration-300` and a `menuOpen ? 'opacity-100' :
   'opacity-0 pointer-events-none'` ternary to its `className`.
5. Add `aria-hidden="true"`.
6. Leave the `<aside>` element and everything else in the file unchanged.

## Scope boundaries

- Do not change the `<aside>` drawer's own transform/transition — it
  already works correctly and is the reference this fix matches.
- Do not change `menuOpen` state logic, Escape-key handling, or the nav
  item list.

## Verification

1. `npm run build` — must compile with no errors.
2. In-browser: click the hamburger. Confirm the backdrop fades in at the
   same visible rate as the drawer sliding in — they should reach full
   state together, not one before the other.
3. Close via the X button, Escape key, and by clicking the backdrop itself
   — confirm the backdrop fades out (not disappears instantly) in all
   three cases, in sync with the drawer sliding out.
4. Confirm the backdrop is not clickable/interactable while closed
   (`pointer-events-none` when `opacity-0`) — e.g. content underneath
   should be clickable when the drawer is closed.
5. Feel-check at normal speed: the two elements should read as one motion,
   not two.
