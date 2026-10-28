import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography
} from '@mui/material';

interface TimelineData {
  id: number;
  dept: string;
  itemName: string;
  completeDate: string;
  totalAmount: number;
  monthsToAllocate: number;
  amountPerMonth: number;
  timeline: Record<string, number>;
}

interface TimelineTableProps {
  data: TimelineData[];
}

const TimelineTable: React.FC<TimelineTableProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <Typography>No data to display.</Typography>;
  }

  // Extract unique timeline dates for headers (sorting them)
  const timelineDatesSet = new Set<string>();
  data.forEach((row) => {
    Object.keys(row.timeline).forEach((date) => {
      timelineDatesSet.add(date);
    });
  });

  const timelineColumns = Array.from(timelineDatesSet).sort();

  return (
    <TableContainer component={Paper} sx={{ mt: 4, width: '100%', overflowX: 'auto' }}>
      <Table sx={{ minWidth: 1200 }} size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ minWidth: 50, position: 'sticky', left: 0, backgroundColor: 'white', zIndex: 1 }}>ID</TableCell>
            <TableCell sx={{ minWidth: 100 }}>Dept</TableCell>
            <TableCell sx={{ minWidth: 200 }}>Item Name</TableCell>
            <TableCell sx={{ minWidth: 120 }}>Complete Date</TableCell>
            <TableCell align="right" sx={{ minWidth: 120 }}>Total Amount</TableCell>
            <TableCell align="right" sx={{ minWidth: 100 }}>Months</TableCell>
            <TableCell align="right" sx={{ minWidth: 120 }}>Amount/Mo</TableCell>
            {/* Timeline Columns */}
            {timelineColumns.map((date) => (
              <TableCell key={date} align="center" sx={{ minWidth: 100, borderLeft: '1px solid #e0e0e0' }}>
                {date.substring(0, 7)} {/* Show YYYY-MM */}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index} hover>
              <TableCell sx={{ position: 'sticky', left: 0, backgroundColor: 'white', zIndex: 1 }}>
                  {row.id}
              </TableCell>
              <TableCell>{row.dept}</TableCell>
              <TableCell>{row.itemName}</TableCell>
              <TableCell>{row.completeDate}</TableCell>
              <TableCell align="right">
                {row.totalAmount ? row.totalAmount.toLocaleString(undefined, { maximumFractionDigits: 2 }) : ''}
              </TableCell>
              <TableCell align="right">{row.monthsToAllocate}</TableCell>
              <TableCell align="right">
                {row.amountPerMonth ? row.amountPerMonth.toLocaleString(undefined, { maximumFractionDigits: 2 }) : ''}
              </TableCell>
              {timelineColumns.map((date) => (
                <TableCell key={date} align="right" sx={{ borderLeft: '1px solid #e0e0e0', backgroundColor: row.timeline[date] ? '#e8f5e9' : 'inherit' }}>
                  {row.timeline[date] ? row.timeline[date].toLocaleString(undefined, { maximumFractionDigits: 2 }) : ''}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TimelineTable;
