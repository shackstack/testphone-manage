import { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Alert,
} from "@mui/material";

interface ReturnFormProps {
  deviceId: string;
  onSuccess: () => void;
}

export default function ReturnForm({ deviceId, onSuccess }: ReturnFormProps) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/rentals/return", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ deviceId, email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "반납 처리 중 오류가 발생했습니다.");
      }

      onSuccess();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "반납 처리 중 오류가 발생했습니다."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper sx={{ p: 3, mt: 2 }}>
      <Typography variant="h6" gutterBottom>
        테스트폰 반납
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="대여자 이메일"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            fullWidth
          />
          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "처리 중..." : "반납하기"}
          </Button>
        </Box>
      </form>
    </Paper>
  );
}
