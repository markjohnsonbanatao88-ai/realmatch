import assert from "node:assert/strict";
import test from "node:test";
import {
  parseApplicationDraft,
  previewDraft,
  relationshipGoalLabels,
  timelineLabels,
  validateAll
} from "../lib/validation/application";
import { verifiedCapture } from "../lib/paypal/validation";

test("the locked preview draft passes the same validation as a live submission", () => {
  assert.deepEqual(validateAll(previewDraft), {});
});

test("untrusted payloads must include every text and consent field", () => {
  assert.equal(parseApplicationDraft({ fullName: "Only one field" }), null);
  assert.equal(parseApplicationDraft({ ...previewDraft, ageConfirmed: "true" }), null);
  assert.deepEqual(parseApplicationDraft({ ...previewDraft }), previewDraft);
});

test("human-readable review labels never expose internal option values", () => {
  assert.equal(relationshipGoalLabels[previewDraft.relationshipGoal], "A long-term partnership");
  assert.equal(timelineLabels[previewDraft.timeline], "Ready now — this is a priority in my life");
});

test("a PayPal capture is accepted only when completed with the server-recorded amount and currency", () => {
  const order = {
    status: "COMPLETED",
    purchase_units: [{ payments: { captures: [{ id: "capture", status: "COMPLETED", amount: { value: "299.00", currency_code: "GBP" } }] } }]
  };
  assert.equal(verifiedCapture(order, 29_900, "GBP")?.id, "capture");
  assert.equal(verifiedCapture(order, 29_901, "GBP"), null);
  assert.equal(verifiedCapture(order, 29_900, "USD"), null);
});
