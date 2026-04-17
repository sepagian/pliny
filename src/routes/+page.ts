import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { logMeterSchema, logSessionSchema, logTopUpSchema } from "$lib/utils/schema";

const today = new Date().toISOString().split("T")[0];

export const load = async () => {
  const [topUpForm, meterForm, sessionForm] = await Promise.all([
    superValidate(zod4(logTopUpSchema), {
      defaults: { date: today, amount: 0 },
    }),
    superValidate(zod4(logMeterSchema), { defaults: { meter: 0 } }),
    superValidate(zod4(logSessionSchema), {
      defaults: { appliance: "", duration: 0 },
    }),
  ]);
  return { topUpForm, meterForm, sessionForm };
};
