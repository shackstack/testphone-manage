"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Grid,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

interface RentalFormData {
  borrower_name: string;
  borrower_email: string;
  rental_start_date: Date;
  rental_end_date: Date;
  purpose: string;
}

export default function RentalForm({
  params,
}: {
  params: { deviceId: string };
}) {
  const router = useRouter();
  const [formData, setFormData] = useState<RentalFormData>({
    borrower_name: "",
    borrower_email: "",
    rental_start_date: new Date(),
    rental_end_date: new Date(),
    purpose: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/rentals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          device_id: params.deviceId,
          rental_id: crypto.randomUUID(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create rental");
      }

      router.push("/");
    } catch (error) {
      console.error("Error creating rental:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          테스트폰 대여
        </Typography>
        <Paper sx={{ p: 3 }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box>
                <TextField
                  fullWidth
                  label="대여자 이름"
                  value={formData.borrower_name}
                  onChange={(e) =>
                    setFormData({ ...formData, borrower_name: e.target.value })
                  }
                  required
                />
              </Box>
              <Box>
                <TextField
                  fullWidth
                  label="이메일"
                  type="email"
                  value={formData.borrower_email}
                  onChange={(e) =>
                    setFormData({ ...formData, borrower_email: e.target.value })
                  }
                  required
                />
              </Box>
              <Box>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="대여 시작일"
                    value={formData.rental_start_date}
                    onChange={(date) =>
                      setFormData({
                        ...formData,
                        rental_start_date: date || new Date(),
                      })
                    }
                  />
                </LocalizationProvider>
              </Box>
              <Box>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="대여 종료일"
                    value={formData.rental_end_date}
                    onChange={(date) =>
                      setFormData({
                        ...formData,
                        rental_end_date: date || new Date(),
                      })
                    }
                  />
                </LocalizationProvider>
              </Box>
              <Box>
                <TextField
                  fullWidth
                  label="대여 목적"
                  multiline
                  rows={4}
                  value={formData.purpose}
                  onChange={(e) =>
                    setFormData({ ...formData, purpose: e.target.value })
                  }
                  required
                />
              </Box>
              <Box>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  대여 신청
                </Button>
              </Box>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
}
