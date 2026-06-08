import { useEffect, useState } from "react";
import { X, ChevronLeft, ChevronRight, Plus, Minus, AlertCircle } from "lucide-react";
import type { Pizza } from "./HomePage";
import type { CartItem, Ingredient } from "../types";
import { ingredientAPI } from "../services/store";

interface Props { pizza: Pizza; onClose: () => void; onAdd: (item: CartItem) => void; }

type Step = "base" | "sauce" | "cheese" | "veggies" | "meat";
const STEPS: Step[] = ["base", "sauce", "cheese", "veggies", "meat"];
const STEP_LABELS: Record<Step, string> = { base: "Base", sauce: "Sauce", cheese: "Cheese", veggies: "Veggies", meat: "Meat" };

function Spinner() { return <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />; }

export function BuilderModal({ pizza, onClose, onAdd }: Props) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [stepIndex, setStepIndex] = useState(0);
  const [selections, setSelections] = useState<Record<Step, string[]>>({ base: [], sauce: [], cheese: [], veggies: [], meat: [] });
  const [qty, setQty] = useState(1);

  useEffect(() => {
    ingredientAPI.getAll().then((data) => { setIngredients(data); setLoading(false); });
  }, []);

  const step = STEPS[stepIndex];
  const byStep = (s: Step) => {
    const cat = s === "meat" ? "meat" : s === "veggies" ? "veggie" : s;
    return ingredients.filter((i) => i.category === cat);
  };

  const isSingle = (s: Step) => ["base", "sauce", "cheese"].includes(s);

  const toggle = (s: Step, name: string) => {
    if (isSingle(s)) {
      setSelections((prev) => ({ ...prev, [s]: prev[s][0] === name ? [] : [name] }));
    } else {
      setSelections((prev) => ({
        ...prev,
        [s]: prev[s].includes(name) ? prev[s].filter((x) => x !== name) : [...prev[s], name],
      }));
    }
  };

  const extraPrice = STEPS.flatMap((s) =>
    byStep(s).filter((ing) => selections[s].includes(ing.name)).map((ing) => ing.price)
  ).reduce((a, b) => a + b, 0);

  const unitPrice = pizza.price + extraPrice;
  const totalPrice = unitPrice * qty;

  const handleAdd = () => {
    const getFirst = (s: Step) => selections[s][0] ?? byStep(s).find((i) => i.inStock)?.name ?? "";
    onAdd({
      id: `custom-${pizza.id}-${Date.now()}`,
      pizzaId: pizza.id, name: `Custom ${pizza.name}`,
      base: getFirst("base"), sauce: getFirst("sauce"), cheese: getFirst("cheese"),
      veggies: selections.veggies, meats: selections.meat,
      price: unitPrice, quantity: qty, image: pizza.image,
    });
  };

  const stepItems = byStep(step);
  const isSelected = (name: string) => selections[step].includes(name);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: "rgba(0,0,0,0.55)" }}>
      <div className="bg-card rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        {/* Header image */}
        <div className="relative h-36 bg-muted overflow-hidden">
          <img src={pizza.image} alt={pizza.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.65), transparent)" }} />
          <button onClick={onClose} className="absolute top-3 right-3 bg-white/20 backdrop-blur-sm text-white rounded-full p-1.5 hover:bg-white/40 transition-colors">
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-4">
            <p className="text-white/65 text-xs uppercase tracking-widest">Customize</p>
            <h2 className="text-white" style={{ fontFamily: "'Playfair Display', serif" }}>{pizza.name}</h2>
          </div>
        </div>

        {/* Step bar */}
        <div className="flex px-4 pt-4 gap-1">
          {STEPS.map((s, i) => (
            <div key={s} className="flex-1">
              <div className={`h-1 rounded-full transition-all ${i <= stepIndex ? "bg-primary" : "bg-muted"}`} />
              <p className={`text-center mt-1 text-xs ${i === stepIndex ? "text-primary font-semibold" : "text-muted-foreground"}`}>{STEP_LABELS[s]}</p>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="px-4 py-4 min-h-[200px]">
          {loading ? (
            <div className="flex items-center justify-center py-12"><Spinner /></div>
          ) : (
            <>
              <p className="text-xs text-muted-foreground mb-3">
                {isSingle(step) ? "Select one" : "Select any (optional)"} · Tap to {isSelected(stepItems[0]?.name ?? "") ? "deselect" : "select"}
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {stepItems.map((ing) => {
                  const sel = isSelected(ing.name);
                  return (
                    <button
                      key={ing.id}
                      onClick={() => ing.inStock && toggle(step, ing.name)}
                      disabled={!ing.inStock}
                      className={`p-3 rounded-xl border-2 text-left transition-all relative ${
                        !ing.inStock ? "opacity-40 cursor-not-allowed border-border" :
                        sel ? "border-primary bg-secondary" : "border-border hover:border-primary/40"
                      }`}
                    >
                      <p className="text-sm font-medium text-foreground">{ing.name}</p>
                      {ing.price > 0 && <p className="text-xs text-muted-foreground">+₹{ing.price}</p>}
                      {!ing.inStock && (
                        <span className="absolute top-1.5 right-1.5 flex items-center gap-0.5 text-destructive text-xs">
                          <AlertCircle className="w-3 h-3" /> Out
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 pb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-primary transition-colors">
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-6 text-center font-semibold text-foreground text-sm">{qty}</span>
            <button onClick={() => setQty((q) => q + 1)}
              className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:border-primary transition-colors">
              <Plus className="w-3 h-3" />
            </button>
          </div>

          <div className="flex items-center gap-2 flex-1 justify-end">
            {stepIndex > 0 && (
              <button onClick={() => setStepIndex((i) => i - 1)}
                className="px-3 py-2 rounded-xl border border-border text-sm flex items-center gap-1 hover:border-primary transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            )}
            {stepIndex < STEPS.length - 1 ? (
              <button onClick={() => setStepIndex((i) => i + 1)}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm flex items-center gap-1 hover:opacity-90 transition-opacity">
                Next <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button onClick={handleAdd}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                Add to Cart — ₹{totalPrice}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
