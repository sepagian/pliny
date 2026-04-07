import { superValidate } from "sveltekit-superforms";
import { zod4 } from "sveltekit-superforms/adapters";
import { applianceSchema } from "$lib/utils/schema";

export const load = async () => {
  return {
    applianceForm: await superValidate(zod4(applianceSchema)),
  };
};