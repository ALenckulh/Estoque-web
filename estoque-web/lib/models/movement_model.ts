export class MovementRecord {
  id?: number;
  group_id: number;
  lote?: string;
  nota_fiscal?: string;
  date: string;
  quantity: number;
  user_id: number | string;
  item_id: number;
  participate_id?: number;
  safe_delete: boolean;
  created_at: string;
  enterprise_id: number;

  constructor(
    group_id: number,
    date: string,
    quantity: number,
    user_id: number | string,
    item_id: number,
    enterprise_id: number,
    lote?: string,
    nota_fiscal?: string,
    participate_id?: number,
    safe_delete: boolean = false,
    created_at: string = new Date().toISOString(),
    id?: number
  ) {
    this.group_id = group_id;
    this.date = date;
    this.quantity = quantity;
    this.user_id = user_id;
    this.item_id = item_id;
    this.enterprise_id = enterprise_id;
    this.lote = lote;
    this.nota_fiscal = nota_fiscal;
    this.participate_id = participate_id;
    this.safe_delete = safe_delete;
    this.created_at = created_at;
    if (id !== undefined) this.id = id;
  }
}
