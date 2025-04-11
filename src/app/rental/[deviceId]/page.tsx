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
  notes: string;
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
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 현재 날짜를 YYYY-MM-DD 형식으로 설정
      const today = new Date();
      const formattedDate = today.toISOString();

      const response = await fetch("/api/rentals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          device_id: params.deviceId,
          borrower_name: formData.borrower_name,
          borrower_email: formData.borrower_email,
          rental_start_date: formattedDate,
          notes: formData.notes,
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
    <Container maxWidth="sm" component="main">
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
                <TextField
                  fullWidth
                  label="대여 목적"
                  multiline
                  rows={4}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
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
