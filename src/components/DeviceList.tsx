import { useState } from "react";
import { Device, Rental } from "@/types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import RentalHistory from "./RentalHistory";

interface DeviceListProps {
  devices: Device[];
}

const statusColors = {
  AVAILABLE: "success",
  RENTED: "warning",
  MAINTENANCE: "error",
} as const;

export default function DeviceList({ devices }: DeviceListProps) {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleDeviceClick = async (device: Device) => {
    setSelectedDevice(device);
    try {
      const response = await fetch(`/api/rentals?deviceId=${device.device_id}`);
      if (!response.ok) {
        throw new Error("Failed to fetch rentals");
      }
      const data = await response.json();
      setRentals(data);
      setIsHistoryOpen(true);
    } catch (error) {
      console.error("Error fetching rentals:", error);
    }
  };

  return (
    <>
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
              <TableCell>작업</TableCell>
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
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleDeviceClick(device)}
                  >
                    대여 이력
                  </Button>
                  {device.status === "AVAILABLE" && (
                    <Button
                      variant="contained"
                      size="small"
                      color="primary"
                      sx={{ ml: 1 }}
                      href={`/rental/${device.device_id}`}
                    >
                      대여
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{selectedDevice?.model_name} - 대여 이력</DialogTitle>
        <DialogContent>
          <RentalHistory rentals={rentals} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsHistoryOpen(false)}>닫기</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
