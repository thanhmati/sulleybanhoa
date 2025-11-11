import { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { IUser } from '@/types/user';
import { useCreateUser, useUpdateUserRoles } from '@/hooks/useUsers';

const userSchema = z.object({
  fullName: z.string().min(1, 'Họ tên không được để trống'),
  email: z.string().min(1, 'Email không được để trống'),
  roles: z.array(z.string()),
});

const defaultValues: UserFormValues = {
  fullName: '',
  email: '',
  roles: [],
};

type UserFormValues = z.infer<typeof userSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: IUser | null;
}

export function UserFormDialog({ open, onOpenChange, initialData }: Props) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);

    if (initialData) {
      form.reset(initialData);
    }
  }, [form, initialData]);

  useEffect(() => {
    if (!open) {
      form.reset();
    }
  }, [open, form]);

  const createUser = useCreateUser();
  const updateUser = useUpdateUserRoles();

  const onSubmit = (values: UserFormValues) => {
    const payload = {
      ...values,
    };

    if (initialData) {
      updateUser.mutate(
        { id: initialData.id, data: payload },
        {
          onSuccess: () => {
            toast.success('Cập nhật tài khoản thành công!');
            onOpenChange(false);
          },
          onError: () => toast.error('Cập nhật thất bại'),
        },
      );
    } else {
      createUser.mutate(payload, {
        onSuccess: () => {
          toast.success('Tạo tài khoản thành công!');
          onOpenChange(false);
        },
        onError: () => toast.error('Tạo thất bại'),
      });
    }
  };

  const isLoading = createUser.isPending || updateUser.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Chỉnh sửa tài khoản' : 'Tạo tài khoản'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 gap-6 my-4">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Họ và tên</FormLabel>
                    <FormControl>
                      <Input disabled type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input disabled type="text" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
                Huỷ
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Đang lưu...' : 'Lưu'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
