export interface GraphNode {
  id: string;
  label: string;
  entity: string;
  properties: Record<string, string | number>;
  connections: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface GraphEdge {
  source: string | GraphNode;
  target: string | GraphNode;
}

// Primary O2C nodes (with full properties for popover)
export const nodes: GraphNode[] = [
  { id: "so-001", label: "Sales Order 4500012847", entity: "Sales Order", properties: { SalesOrganization: "1710", DistributionChannel: "10", SoldToParty: "CUST-0042", OrderDate: "2025-03-15", NetValue: 24500, Currency: "USD", Status: "Completed" }, connections: 6 },
  { id: "so-item-001", label: "SO Item 10", entity: "Sales Order Item", properties: { Material: "MAT-7821", Quantity: 50, Unit: "EA", NetPrice: 490, Plant: "1710" }, connections: 4 },
  { id: "so-item-002", label: "SO Item 20", entity: "Sales Order Item", properties: { Material: "MAT-3392", Quantity: 20, Unit: "EA", NetPrice: 275, Plant: "1710" }, connections: 3 },
  { id: "del-001", label: "Delivery 8000034521", entity: "Outbound Delivery", properties: { ShipToParty: "CUST-0042", ShippingPoint: "1710", PlannedGoodsMovement: "2025-03-18", ActualGoodsMovement: "2025-03-18", Status: "Completed" }, connections: 4 },
  { id: "del-002", label: "Delivery 8000034522", entity: "Outbound Delivery", properties: { ShipToParty: "CUST-0042", ShippingPoint: "1710", PlannedGoodsMovement: "2025-03-19", Status: "In Transit" }, connections: 3 },
  { id: "billing-001", label: "Billing Doc 91150187", entity: "Billing Document", properties: { BillingDate: "2025-03-20", PayerParty: "CUST-0042", NetValue: 24500, TaxAmount: 4410, Currency: "USD" }, connections: 4 },
  { id: "billing-002", label: "Billing Doc 91150201", entity: "Billing Document", properties: { BillingDate: "2025-03-22", PayerParty: "CUST-0042", NetValue: 5500, TaxAmount: 990, Currency: "USD" }, connections: 3 },
  { id: "je-001", label: "Journal Entry 9400635958", entity: "Journal Entry", properties: { CompanyCode: "", FiscalYear: 2025, AccountingDocument: 9400635958, GlAccount: 15500020, ReferenceDocument: 91150187, CostCenter: "", ProfitCenter: "", TransactionCurrency: "INR", AmountInTransactionCurrency: -1167, CompanyCodeCurrency: "INR", AmountInCompanyCodeCurrency: -1167, PostingDate: "2025-04-02T00:00:00.000Z", DocumentDate: "2025-04-02T00:00:00.000Z", AccountingDocumentType: "RV", AccountingDocumentItem: 1 }, connections: 3 },
  { id: "je-002", label: "Journal Entry 9400636012", entity: "Journal Entry", properties: { FiscalYear: 2025, AccountingDocument: 9400636012, GlAccount: 15500020, ReferenceDocument: 91150201, TransactionCurrency: "INR", AmountInTransactionCurrency: -523, PostingDate: "2025-04-03T00:00:00.000Z" }, connections: 2 },
  { id: "cust-001", label: "Customer CUST-0042", entity: "Customer Master", properties: { Name: "Meridian Industries Ltd", Country: "IN", Region: "MH", PaymentTerms: "Net 30", CreditLimit: 500000, Currency: "INR" }, connections: 5 },
  { id: "mat-001", label: "Material MAT-7821", entity: "Material Master", properties: { Description: "Precision Bearing Assembly", MaterialGroup: "MECH", BaseUnit: "EA", Weight: 2.4, WeightUnit: "KG" }, connections: 3 },
  { id: "mat-002", label: "Material MAT-3392", entity: "Material Master", properties: { Description: "Hydraulic Valve Unit", MaterialGroup: "HYDR", BaseUnit: "EA", Weight: 1.8, WeightUnit: "KG" }, connections: 2 },
  { id: "pay-001", label: "Payment 1400028934", entity: "Incoming Payment", properties: { PaymentDate: "2025-04-10", Amount: 28910, Currency: "INR", PaymentMethod: "Wire Transfer", ClearingDocument: "2000045612" }, connections: 3 },
  { id: "gi-001", label: "Goods Issue 4900012301", entity: "Goods Issue", properties: { MovementType: "601", Plant: "1710", StorageLocation: "FG01", PostingDate: "2025-03-18", Quantity: 50 }, connections: 3 },
  { id: "gi-002", label: "Goods Issue 4900012302", entity: "Goods Issue", properties: { MovementType: "601", Plant: "1710", StorageLocation: "FG01", PostingDate: "2025-03-19", Quantity: 20 }, connections: 2 },
  { id: "contract-001", label: "Contract 4600001234", entity: "Sales Contract", properties: { ValidFrom: "2025-01-01", ValidTo: "2025-12-31", TargetValue: 150000, Currency: "USD" }, connections: 3 },
  { id: "po-001", label: "PO 4500098712", entity: "Purchase Order", properties: { Vendor: "VEND-118", OrderDate: "2025-02-28", NetValue: 12300, Currency: "USD" }, connections: 3 },
  { id: "gr-001", label: "Goods Receipt 5000045231", entity: "Goods Receipt", properties: { MovementType: "101", Plant: "1710", PostingDate: "2025-03-10", Quantity: 50 }, connections: 2 },
  { id: "vendor-001", label: "Vendor VEND-118", entity: "Vendor Master", properties: { Name: "Apex Components GmbH", Country: "DE", PaymentTerms: "Net 45" }, connections: 2 },
  { id: "inv-001", label: "Invoice 5100023456", entity: "Vendor Invoice", properties: { InvoiceDate: "2025-03-12", Amount: 12300, Currency: "USD", Status: "Paid" }, connections: 2 },
];

// Generate peripheral "background" nodes for density
function generatePeripheralNodes(): GraphNode[] {
  const entities = [
    "Sales Order", "Sales Order Item", "Outbound Delivery", "Billing Document",
    "Journal Entry", "Customer Master", "Material Master", "Incoming Payment",
    "Goods Issue", "Purchase Order", "Goods Receipt", "Vendor Invoice",
    "Credit Memo", "Debit Memo", "Returns Order", "Scheduling Agreement",
  ];
  const peripheral: GraphNode[] = [];
  for (let i = 0; i < 80; i++) {
    const entity = entities[i % entities.length];
    const id = `bg-${i}`;
    peripheral.push({
      id,
      label: `${entity.split(" ").map(w => w[0]).join("")}-${(10000 + i * 73) % 99999}`,
      entity,
      properties: {},
      connections: 1 + Math.floor(Math.random() * 3),
    });
  }
  return peripheral;
}

const peripheralNodes = generatePeripheralNodes();

// Generate edges for peripheral nodes — connect to primary or each other
function generatePeripheralEdges(): GraphEdge[] {
  const primaryIds = nodes.map(n => n.id);
  const allIds = [...primaryIds, ...peripheralNodes.map(n => n.id)];
  const result: GraphEdge[] = [];

  peripheralNodes.forEach((pn, i) => {
    // Connect to a random primary node
    const primaryTarget = primaryIds[i % primaryIds.length];
    result.push({ source: pn.id, target: primaryTarget });

    // Some nodes connect to other peripheral nodes for web-like density
    if (i > 2 && Math.random() > 0.4) {
      const otherIdx = Math.floor(Math.random() * i);
      result.push({ source: pn.id, target: peripheralNodes[otherIdx].id });
    }
    if (Math.random() > 0.6) {
      const otherPrimary = primaryIds[Math.floor(Math.random() * primaryIds.length)];
      result.push({ source: pn.id, target: otherPrimary });
    }
  });

  return result;
}

export const allNodes: GraphNode[] = [...nodes, ...peripheralNodes];

export const edges: GraphEdge[] = [
  // Primary edges
  { source: "so-001", target: "so-item-001" },
  { source: "so-001", target: "so-item-002" },
  { source: "so-001", target: "del-001" },
  { source: "so-001", target: "del-002" },
  { source: "so-001", target: "cust-001" },
  { source: "so-001", target: "contract-001" },
  { source: "so-item-001", target: "mat-001" },
  { source: "so-item-001", target: "del-001" },
  { source: "so-item-001", target: "gi-001" },
  { source: "so-item-002", target: "mat-002" },
  { source: "so-item-002", target: "del-002" },
  { source: "del-001", target: "billing-001" },
  { source: "del-001", target: "gi-001" },
  { source: "del-002", target: "billing-002" },
  { source: "del-002", target: "gi-002" },
  { source: "billing-001", target: "je-001" },
  { source: "billing-001", target: "pay-001" },
  { source: "billing-002", target: "je-002" },
  { source: "billing-002", target: "pay-001" },
  { source: "cust-001", target: "pay-001" },
  { source: "cust-001", target: "contract-001" },
  { source: "mat-001", target: "gi-001" },
  { source: "mat-002", target: "gi-002" },
  { source: "je-001", target: "pay-001" },
  { source: "po-001", target: "vendor-001" },
  { source: "po-001", target: "gr-001" },
  { source: "po-001", target: "mat-001" },
  { source: "gr-001", target: "mat-001" },
  { source: "vendor-001", target: "inv-001" },
  { source: "inv-001", target: "po-001" },
  // Peripheral edges
  ...generatePeripheralEdges(),
];
