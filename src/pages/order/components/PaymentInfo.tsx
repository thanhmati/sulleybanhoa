import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TRANSACTION_TYPE, TRANSACTION_TYPE_LABEL } from '@/lib/constants/order.constant';
import dayjs from 'dayjs';

interface Transaction {
  type: TRANSACTION_TYPE;
  amount: number;
  paymentDate: string;
}

interface PaymentInfoProps {
  transactions: Transaction[];
}

export default function PaymentInfo({ transactions }: PaymentInfoProps) {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Loại giao dịch</TableHead>
            <TableHead>Số tiền</TableHead>
            <TableHead>Thời gian thanh toán</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {transactions?.map((tx, index) => (
            <TableRow key={index}>
              <TableCell className="capitalize">{TRANSACTION_TYPE_LABEL[tx.type]}</TableCell>
              <TableCell>{tx.amount.toLocaleString()} đ</TableCell>
              <TableCell>{dayjs(tx.paymentDate).format('DD/MM/YYYY HH:mm')}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
