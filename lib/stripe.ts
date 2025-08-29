import { env } from "@/config/server";
import Stripe from "stripe";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
	apiVersion: "2025-07-30.basil",
	typescript: true,
});
