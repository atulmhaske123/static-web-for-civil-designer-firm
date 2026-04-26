# Precision Structural Consultants — Website

A fully static, single-page website for a civil engineering consultancy firm. No build step, no server required — open `index.html` directly in a browser.

---

## How to Open the Site

Double-click `index.html`, or serve it with any static server:

```bash
# Python (any machine with Python installed)
cd precision-structural-consultants
python -m http.server 8080
# then open http://localhost:8080
```

---

## Folder Structure

```
precision-structural-consultants/
├── index.html              ← single HTML page
├── config/                 ← ALL editable content lives here
│   ├── config.js           ← company name, phone, email, logo, tagline
│   ├── services.js         ← list of services shown on the page
│   ├── projects.js         ← portfolio projects with images
│   ├── clients.js          ← client logos and names
│   └── formulas.js         ← calculator rates and formulas
├── images/
│   ├── projects/           ← project photos (drop your own here)
│   └── clients/            ← client logos (drop your own here)
├── assets/
│   ├── icons/services/     ← SVG icons for each service card
│   └── images/logo.png     ← company logo
├── css/                    ← stylesheets (no need to edit normally)
└── js/                     ← scripts (no need to edit normally)
```

---

## How to Update Content

All content is controlled by the `.js` files inside `config/`. Open the relevant file in any text editor (Notepad, VS Code, etc.), make changes, save, and refresh the browser. **No other files need to be touched.**

---

### 1. Company Info — `config/config.js`

Controls the company name, logo, tagline, phone, email, address and WhatsApp number shown across the site.

```js
window.CONFIG = {
    "companyName": "Precision Structural Consultants",
    "logoPath": "assets/images/logo.png",   // path to your logo file
    "tagline": "Your trusted partner in civil engineering solutions",
    "heroSubtitle": "Providing expert consultancy services...",
    "phone": "+91 12345 67890",
    "email": "info@precisionconsultants.com",
    "address": "123 Engineering Lane, Pune, Maharashtra, India",
    "whatsappNumber": "+91 98765 43210",
    "stats": {
        "projects": { "count": 95, "label": "Projects" },
        "clients":  { "count": 55, "label": "Clients"  },
        "years":    { "count": 11, "label": "Years"    }
    }
}
```

**To update:** change the values in quotes. For the logo, copy your logo file into `assets/images/` and update `logoPath` to match the filename.

---

### 2. Services — `config/services.js`

Controls the service cards shown in the Services section.

```js
{
    "name": "Structural Engineering",
    "description": "Full description text here...",
    "icon": "assets/icons/services/structural-engineering.svg"
}
```

**To add a service:** copy an existing `{ ... }` block, paste it at the end of the list (before the last `]`), add a comma after the previous block, and fill in `name`, `description`, and `icon`.

**To remove a service:** delete its entire `{ ... }` block. Make sure there is no trailing comma after the last remaining block.

**To reorder:** cut a block and paste it in the desired position.

**Icon files** live in `assets/icons/services/`. You can add your own SVG file and point `icon` to it.

---

### 3. Projects — `config/projects.js`

Controls the project cards and the background slideshow on the hero banner.

```js
{
    "projectName": "Residential Bungalow Structural Design",
    "projectType": "Residential",
    "description": "A modern bungalow designed with focus on structural integrity.",
    "location": "Kothrud, Pune",
    "images": [
        "images/projects/residential-bungalow-1.jpg",
        "images/projects/residential-bungalow-2.jpg",
        "images/projects/residential-bungalow-3.jpg"
    ]
}
```

**To add a project:**
1. Drop your photo files into `images/projects/` (use names like `my-project-1.jpg`, `my-project-2.jpg`).
2. Copy an existing block, paste it at the end of the list, and update all fields.
3. The `images` array can have 1, 2, or 3 images — the card will show a slider if there is more than one.

**To remove a project:** delete its entire `{ ... }` block.

**`projectType`** can be any label you like — e.g. `"Residential"`, `"Commercial"`, `"Industrial"`. It shows as a badge on the card.

---

### 4. Clients — `config/clients.js`

Controls the client logos shown in the Clients section.

```js
{
    "clientName": "ABC Builders",
    "clientType": "Residential",
    "logo": "images/clients/abc-builders.jpg",
    "description": "Optional short description."
}
```

**To add a client:**
1. Drop the client logo file into `images/clients/`.
2. Copy an existing block, paste it at the end of the list, and fill in the fields.

**To remove a client:** delete its block.

---

### 5. Calculator Rates — `config/formulas.js`

Controls the rates used by the estimation calculators (material cost, steel weight, construction quotation).

```js
window.FORMULAS = {
    "concreteVolume": { "formula": "length * width * thickness", ... },
    "cementBags":     { "formula": "concreteVolume * 6.5", ... },
    "steelWeight":    { "formula": "(diameter * diameter / 162) * length * quantity", ... },
    "constructionCost": { "formula": "area * ratePerSqFt", ... }
}
```

**To update a rate:** find the relevant formula and change the multiplier number (e.g. change `6.5` to `7.0` for cement bags per m³). Do not change the variable names (`length`, `width`, etc.) — those come from the form inputs.

---

## Adding Your Own Logo

1. Copy your logo image file (PNG or SVG recommended) to `assets/images/`.
2. Open `config/config.js` and set `"logoPath": "assets/images/your-logo-filename.png"`.
3. Refresh the browser.

---

## SEO — Updating for Your Domain

When your site goes live on a real domain, update these three files:

| File | What to change |
|---|---|
| `index.html` | Replace all `https://www.precisionstructuralconsultants.com/` with your actual URL in the `<head>` meta tags and JSON-LD schema |
| `sitemap.xml` | Replace the same placeholder domain with your actual URL |
| `robots.txt` | Update the `Sitemap:` line with your actual sitemap URL |

---

## Notes

- All config files use `window.VARIABLE = { ... }` syntax (not plain JSON) because the site opens via `file://` in a browser, and `fetch()` is blocked on that protocol. Loading them as `<script>` tags is the workaround.
- After any change to a config file, just **save and refresh** — no build step needed.
- For best performance before going live, compress images in `images/projects/` and `images/clients/` to under 200 KB each.

- To remove a project, delete the corresponding entry from `config/projects.json`.

### 3. Managing Clients
- To add a new client, open `config/clients.json` and add a new entry with the required fields: `clientName`, `clientType`, `logo`, and `description`.
- To remove a client, delete the corresponding entry from `config/clients.json`.

## Formula Management

### 4. Managing Formulas
- All engineering formulas are stored in `config/formulas.json`. 
- Civil engineers can safely modify values as needed. 
- Example changes include adjusting the cement ratio or steel factor.
- **Warning:** Incorrect formulas may lead to inaccurate outputs.

## Tools Explanation

### 5. Calculators
- All calculators (material calculator, steel weight calculator, cost estimator) utilize the formulas defined in `config/formulas.json`. 
- No code changes are needed to update the calculations.

## Quotation Generator

### 6. Lead Generation
- The quotation generator allows users to select services and input project details to receive an estimate.
- Users can share the generated quotation via WhatsApp or download it directly.

## Additional Features

- The website includes a floating WhatsApp button for easy communication.
- Google Maps integration is available on the contact page for directions.
- An email contact form is included to collect user inquiries.

## SEO Optimization

The website is optimized for search engines with a focus on keywords relevant to civil engineering consultancy in Pune, Maharashtra, India. 

## Conclusion

This README provides a comprehensive overview of the Precision Structural Consultants website. For any further assistance or inquiries, please contact the development team.