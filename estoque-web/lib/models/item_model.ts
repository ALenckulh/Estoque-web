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
<<<<<<< HEAD
  safe_delete: boolean;
=======
>>>>>>> 5623cfa (Implementa Item CRUD: model, database, services e routes além de alguns ajustes pontuais e adição do listUser)
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
<<<<<<< HEAD
    safe_delete: boolean = false,
=======
>>>>>>> 5623cfa (Implementa Item CRUD: model, database, services e routes além de alguns ajustes pontuais e adição do listUser)
    created_at: string = new Date().toISOString(),
    id?: number
  ) {
    this.name = name;
<<<<<<< HEAD
    this.description = description;
    this.quantity = quantity;
=======
    this.quantity = quantity;
    this.enterprise_id = enterprise_id;
    this.description = description;
>>>>>>> 5623cfa (Implementa Item CRUD: model, database, services e routes além de alguns ajustes pontuais e adição do listUser)
    this.quantity_alert = quantity_alert;
    this.unity = unity;
    this.segment_id = segment_id;
    this.manufacturer = manufacturer;
    this.position = position;
    this.group_id = group_id;
<<<<<<< HEAD
    this.enterprise_id = enterprise_id;
    this.safe_delete = safe_delete;
    this.created_at = created_at;
    if (id !== undefined) this.id = id;
  }
}
=======
    this.created_at = created_at;
    if (id !== undefined) this.id = id;
  }
}
>>>>>>> 5623cfa (Implementa Item CRUD: model, database, services e routes além de alguns ajustes pontuais e adição do listUser)
