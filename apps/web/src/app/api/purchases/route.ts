import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { loadCatalog, loadBundles } from "@/lib/catalog";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    const allProducts = loadCatalog();
    const allBundles = loadBundles();

    // Search for customer by email
    const customers = await stripe.customers.search({
      query: `email:'${email.toLowerCase().replace(/'/g, "\\'")}'`,
      limit: 5,
    });

    if (customers.data.length === 0) {
      return NextResponse.json({ purchases: [] });
    }

    const purchases: Array<{
      session_id: string;
      purchased_at: number;
      items: Array<{
        type: "product" | "bundle";
        id: string;
        name: string;
        slug: string;
        download_url: string;
      }>;
    }> = [];

    // Check checkout sessions for all matching customers
    for (const customer of customers.data) {
      const sessions = await stripe.checkout.sessions.list({
        customer: customer.id,
        limit: 100,
        expand: ["data.line_items.data.price.product"],
      });

      for (const session of sessions.data) {
        if (session.payment_status !== "paid") continue;

        const items: typeof purchases[0]["items"] = [];

        for (const lineItem of session.line_items?.data ?? []) {
          const stripeProduct = lineItem.price?.product as Stripe.Product | null;
          if (!stripeProduct || typeof stripeProduct === "string") continue;

          const productId = stripeProduct.metadata?.product_id;
          const bundleId = stripeProduct.metadata?.bundle_id;

          if (productId) {
            const product = allProducts.find((p) => p.product_id === productId);
            if (product) {
              items.push({
                type: "product",
                id: productId,
                name: product.name,
                slug: product.slug,
                download_url: `/downloads/paid/${productId}.md`,
              });
            }
          } else if (bundleId) {
            const bundle = allBundles.find((b) => b.bundle_id === bundleId);
            if (bundle) {
              items.push({
                type: "bundle",
                id: bundleId,
                name: bundle.name,
                slug: bundle.slug,
                download_url: `/success?session_id=${session.id}`,
              });
            }
          }
        }

        if (items.length > 0) {
          purchases.push({
            session_id: session.id,
            purchased_at: session.created,
            items,
          });
        }
      }
    }

    // Sort by most recent first
    purchases.sort((a, b) => b.purchased_at - a.purchased_at);

    return NextResponse.json({ purchases });
  } catch (err) {
    console.error("Purchase lookup error:", err);
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
}
