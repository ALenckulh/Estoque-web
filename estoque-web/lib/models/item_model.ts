export class Item {
  id?: number;
  name: string;
  description?: string;
  quantity: number;
  quantity_alert?: number;
  unit_id?: number;
  segment_id?: number;
  segment_name?: string; // Nome do segmento
  manufacturer?: string;
  position?: string;
  group_id?: number;
  group_name?: string; // Nome do grupo
  unit_name?: string; // Nome da unidade
  enterprise_id: number;
  created_at: string;
  safe_delete?: boolean;

  constructor(
    name: string,
    quantity: number,
    enterprise_id: number,
    description?: string,
    quantity_alert?: number,
    unit_id?: number,
    segment_id?: number,
    manufacturer?: string,
    position?: string,
    group_id?: number,
    created_at: string = new Date().toISOString(),
    id?: number,
    segment_name?: string,
    group_name?: string,
    unit_name?: string,
    safe_delete?: boolean
  ) {
    this.name = name;
    this.quantity = quantity;
    this.enterprise_id = enterprise_id;
    this.description = description;
    this.quantity_alert = quantity_alert;
    this.unit_id = unit_id;
    this.segment_id = segment_id;
    this.segment_name = segment_name;
    this.manufacturer = manufacturer;
    this.position = position;
    this.group_id = group_id;
    this.group_name = group_name;
    this.unit_name = unit_name;
    this.created_at = created_at;
    this.safe_delete = safe_delete;
    if (id !== undefined) this.id = id;
  }
}
