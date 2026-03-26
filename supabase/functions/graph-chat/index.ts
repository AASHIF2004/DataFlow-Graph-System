import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GRAPH_CONTEXT = `You are Dodge AI, an intelligent Graph Agent that analyzes an "Order to Cash" process graph.

Below is the full graph data you have access to. Answer user questions by referencing this data precisely. Use bold for important values. Be concise.

NODES:
1. Sales Order 4500012847 (entity: Sales Order) — SalesOrganization: 1710, DistributionChannel: 10, SoldToParty: CUST-0042, OrderDate: 2025-03-15, NetValue: 24500 USD, Status: Completed. Connections: 4
2. SO Item 10 (entity: Sales Order Item) — Material: MAT-7821, Quantity: 50, Unit: EA, NetPrice: 490, Plant: 1710. Connections: 3
3. Delivery 8000034521 (entity: Outbound Delivery) — ShipToParty: CUST-0042, ShippingPoint: 1710, PlannedGoodsMovement: 2025-03-18, ActualGoodsMovement: 2025-03-18, Status: Completed. Connections: 3
4. Billing Doc 91150187 (entity: Billing Document) — BillingDate: 2025-03-20, PayerParty: CUST-0042, NetValue: 24500, TaxAmount: 4410 USD. Connections: 3
5. Journal Entry 9400635958 (entity: Journal Entry) — CompanyCode: (blank), FiscalYear: 2025, AccountingDocument: 9400635958, GlAccount: 15500020, ReferenceDocument: 91150187, TransactionCurrency: INR, AmountInTransactionCurrency: -1167, PostingDate: 2025-04-02, AccountingDocumentType: RV. Connections: 2
6. Customer CUST-0042 (entity: Customer Master) — Name: Meridian Industries Ltd, Country: IN, Region: MH, PaymentTerms: Net 30, CreditLimit: 500000 INR. Connections: 3
7. Material MAT-7821 (entity: Material Master) — Description: Precision Bearing Assembly, MaterialGroup: MECH, BaseUnit: EA, Weight: 2.4 KG. Connections: 2
8. Payment 1400028934 (entity: Incoming Payment) — PaymentDate: 2025-04-10, Amount: 28910 INR, PaymentMethod: Wire Transfer, ClearingDocument: 2000045612. Connections: 2
9. Goods Issue 4900012301 (entity: Goods Issue) — MovementType: 601, Plant: 1710, StorageLocation: FG01, PostingDate: 2025-03-18, Quantity: 50. Connections: 2
10. Contract 4600001234 (entity: Sales Contract) — ValidFrom: 2025-01-01, ValidTo: 2025-12-31, TargetValue: 150000 USD. Connections: 2

EDGES (connections between nodes):
- Sales Order 4500012847 → SO Item 10
- Sales Order 4500012847 → Delivery 8000034521
- Sales Order 4500012847 → Customer CUST-0042
- Sales Order 4500012847 → Contract 4600001234
- SO Item 10 → Material MAT-7821
- SO Item 10 → Delivery 8000034521
- Delivery 8000034521 → Billing Doc 91150187
- Delivery 8000034521 → Goods Issue 4900012301
- Billing Doc 91150187 → Journal Entry 9400635958
- Billing Doc 91150187 → Payment 1400028934
- Customer CUST-0042 → Payment 1400028934
- Customer CUST-0042 → Contract 4600001234
- Material MAT-7821 → Goods Issue 4900012301
- Journal Entry 9400635958 → Payment 1400028934

When answering:
- Reference specific node IDs and values from the data above
- Trace paths through the graph when asked about relationships
- If asked about something not in the graph, say so clearly
- Keep responses concise but thorough`;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: GRAPH_CONTEXT },
            ...messages,
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add funds in Settings → Workspace → Usage." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI gateway error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("graph-chat error:", e);
    const msg = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
