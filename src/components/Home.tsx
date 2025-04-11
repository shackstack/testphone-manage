"use client";

import { useEffect, useState } from "react";
import { Container, Typography, Box } from "@mui/material";
import DeviceList from "@/components/DeviceList";
import { Device } from "@/types";

export default function Home() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchDevices = async () => {
    try {
      const response = await fetch("/api/devices");
      if (!response.ok) {
        throw new Error("Failed to fetch devices");
      }
      const data = await response.json();
      setDevices(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          테스트폰 관리 대장
        </Typography>
        {error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          <DeviceList devices={devices} onDeviceUpdate={fetchDevices} />
        )}
      </Box>
    </Container>
  );
}
