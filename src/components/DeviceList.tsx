import { Device } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";

interface DeviceListProps {
  devices: Device[];
}

const statusColors = {
  AVAILABLE: "success",
  RENTED: "warning",
  MAINTENANCE: "error",
} as const;

export default function DeviceList({ devices }: DeviceListProps) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>모델명</TableCell>
            <TableCell>시리얼 번호</TableCell>
            <TableCell>OS 버전</TableCell>
            <TableCell>상태</TableCell>
            <TableCell>구매일</TableCell>
            <TableCell>마지막 점검일</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {devices.map((device) => (
            <TableRow key={device.device_id}>
              <TableCell>{device.model_name}</TableCell>
              <TableCell>{device.serial_number}</TableCell>
              <TableCell>{device.os_version}</TableCell>
              <TableCell>
                <Chip
                  label={device.status}
                  color={statusColors[device.status]}
                  size="small"
                />
              </TableCell>
              <TableCell>{device.purchase_date}</TableCell>
              <TableCell>{device.last_maintenance_date}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
