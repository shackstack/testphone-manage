import { Rental } from "@/types";
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
import { format } from "date-fns";

interface RentalHistoryProps {
  rentals: Rental[];
}

export default function RentalHistory({ rentals }: RentalHistoryProps) {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>대여자</TableCell>
            <TableCell>대여 시작일</TableCell>
            <TableCell>반납일</TableCell>
            <TableCell>목적</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rentals.map((rental) => (
            <TableRow key={rental.rental_id}>
              <TableCell>{rental.borrower_name}</TableCell>
              <TableCell>
                {format(new Date(rental.rental_start_date), "MM월 dd일 HH:mm")}
              </TableCell>
              <TableCell>
                {rental.return_date
                  ? format(new Date(rental.return_date), "MM월 dd일 HH:mm")
                  : "-"}
              </TableCell>
              <TableCell>{rental?.purpose ?? "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
