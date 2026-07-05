import { COMPANIES } from "../data/companies";
import { CONCEPT_CARDS } from "../data/conceptCards";
import { VALUE_LEVERS } from "../data/valueLevers";
import { PLAYBOOKS } from "../data/playbooks";
import { BRIDGE_SCENARIOS } from "../data/valueBridge";

const LEARN_REGISTRY = {
  concept: { items: () => CONCEPT_CARDS, path: "concepts" },
  lever: { items: () => VALUE_LEVERS, path: "levers" },
  playbook: { items: () => PLAYBOOKS, path: "playbooks" },
  bridge: { items: () => BRIDGE_SCENARIOS, path: "bridge" },
};

/**
 * Resolve a persisted SRS atom back to reviewable content. Imports the full
 * learn data surface, so keep callers behind a lazy route boundary.
 *
 * Returns null for unknown types or IDs that no longer exist (content can be
 * renamed or removed between sessions; stale atoms must not crash review).
 *
 * - company-question: `{ kind, title, company, question }` (replayable in QuestionCard)
 * - concept/lever/playbook/bridge: `{ kind, title, link }` into the learn surface
 */
export function resolveAtom(atomId, atomType) {
  if (atomType === "company-question") {
    for (const company of COMPANIES) {
      const question = (company.questions || []).find((q) => q.id === atomId);
      if (question) return { kind: atomType, title: question.q, company, question };
    }
    return null;
  }

  const registry = LEARN_REGISTRY[atomType];
  if (!registry) return null;
  const item = registry.items().find((i) => i.id === atomId);
  if (!item) return null;
  return {
    kind: atomType,
    title: item.title || item.label || item.name || atomId,
    link: `/learn/${registry.path}/${atomId}`,
  };
}
