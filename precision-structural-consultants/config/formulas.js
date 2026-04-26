// ── Engineering Formulas ──────────────────────────────────────────────────────
// Used by the engineering tools calculator on the page.
// After saving, just refresh the browser — no other files need to be touched.

window.FORMULAS = {
    "concreteVolume": {
        "formula": "length * width * thickness",
        "description": "Calculates the volume of concrete needed based on length, width, and thickness."
    },
    "cementBags": {
        "formula": "concreteVolume * 6.5",
        "description": "Calculates the number of cement bags required based on the volume of concrete."
    },
    "steelWeight": {
        "formula": "(diameter * diameter / 162) * length * quantity",
        "description": "Calculates the weight of steel bars based on diameter, length, and quantity."
    },
    "constructionCost": {
        "formula": "area * ratePerSqFt",
        "description": "Estimates the construction cost based on area and rate per square foot."
    }
};
