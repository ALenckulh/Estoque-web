export class Item {
  id?: number;
  name: string;
  description?: string;
  quantity: number;
  quantity_alert?: number;
  unity?: string;
  segment_id?: number;
  manufacturer?: string;
  position?: string;
  group_id?: number;
  enterprise_id: number;
  safe_delete: boolean;
  created_at: string;

  constructor(
    name: string,
    quantity: number,
    enterprise_id: number,
    description?: string,
    quantity_alert?: number,
    unity?: string,
    segment_id?: number,
    manufacturer?: string,
    position?: string,
    group_id?: number,
    safe_delete: boolean = false,
    created_at: string = new Date().toISOString(),
    id?: number
  ) {
    this.name = name;
    this.description = description;
    this.quantity = quantity;
    this.quantity_alert = quantity_alert;
    this.unity = unity;
    this.segment_id = segment_id;
    this.manufacturer = manufacturer;
    this.position = position;
    this.group_id = group_id;
    this.enterprise_id = enterprise_id;
    this.safe_delete = safe_delete;
    this.created_at = created_at;
    if (id !== undefined) this.id = id;
  }
}