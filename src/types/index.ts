export interface Device {
  device_id: string;
  model_name: string;
  serial_number: string;
  os_version: string;
  status: "AVAILABLE" | "RENTED" | "MAINTENANCE";
  purchase_date: string;
  last_maintenance_date: string;
  notes: string;
}

export interface Rental {
  rental_id: string;
  device_id: string;
  borrower_name: string;
  borrower_email: string;
  rental_start_date: string;
  purpose: string;
  return_date?: string;
  notes?: string;
}

export interface Maintenance {
  maintenance_id: string;
  device_id: string;
  maintenance_date: string;
  maintenance_type: "REGULAR" | "REPAIR" | "OS_UPDATE";
  performed_by: string;
  description: string;
  status: "COMPLETED" | "IN_PROGRESS";
}
