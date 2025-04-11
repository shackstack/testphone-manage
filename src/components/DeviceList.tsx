import { useState, useEffect } from "react";
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
import ReturnForm from "./ReturnForm";
import { format } from "date-fns";

interface DeviceListProps {
  devices: Device[];
  onDeviceUpdate: () => void;
}

const statusColors = {
  AVAILABLE: "success",
  RENTED: "warning",
  MAINTENANCE: "error",
} as const;

export default function DeviceList({
  devices,
  onDeviceUpdate,
}: DeviceListProps) {
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [rentals, setRentals] = useState<Rental[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);
  const [activeRentals, setActiveRentals] = useState<Record<string, Rental>>(
    {}
  );

  useEffect(() => {
    const fetchActiveRentals = async () => {
      const rentalMap: Record<string, Rental> = {};

      for (const device of devices) {
        if (device.status === "RENTED") {
          try {
            const response = await fetch(
              `/api/rentals?deviceId=${device.device_id}`
            );
            if (response.ok) {
              const data: Rental[] = await response.json();
              // 반납일이 없는 가장 최근 대여 이력을 찾습니다
              const activeRental = data
                .filter((rental) => !rental.return_date)
                .sort(
                  (a, b) =>
                    new Date(b.rental_start_date).getTime() -
                    new Date(a.rental_start_date).getTime()
                )[0];

              if (activeRental) {
                rentalMap[device.device_id] = activeRental;
              }
            }
          } catch (error) {
            console.error(
              "Error fetching rental for device:",
              device.device_id,
              error
            );
          }
        }
      }

      setActiveRentals(rentalMap);
    };

    fetchActiveRentals();
  }, [devices]);

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

  const handleReturnClick = (device: Device) => {
    setSelectedDevice(device);
    setIsReturnOpen(true);
  };

  const handleReturnSuccess = () => {
    setIsReturnOpen(false);
    onDeviceUpdate();
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
              <TableCell>대여자</TableCell>
              <TableCell>대여 시작일</TableCell>
              <TableCell>작업</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {devices.map((device) => {
              const activeRental = activeRentals[device.device_id];
              if (activeRental) {
                console.log(activeRental);
              }
              return (
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
                  <TableCell>
                    {activeRental ? activeRental.borrower_name : "-"}
                  </TableCell>
                  <TableCell>
                    {activeRental
                      ? format(
                          new Date(activeRental.rental_start_date),
                          "MM월 dd일 HH:mm"
                        )
                      : "-"}
                  </TableCell>
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
                    {device.status === "RENTED" && (
                      <Button
                        variant="contained"
                        size="small"
                        color="secondary"
                        sx={{ ml: 1 }}
                        onClick={() => handleReturnClick(device)}
                      >
                        반납
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
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

      <Dialog
        open={isReturnOpen}
        onClose={() => setIsReturnOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent>
          {selectedDevice && (
            <ReturnForm
              deviceId={selectedDevice.device_id}
              onSuccess={handleReturnSuccess}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
