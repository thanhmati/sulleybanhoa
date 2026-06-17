import { useEffect, useState } from 'react';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { CheckIcon } from 'lucide-react';

const userSchema = z.object({
  fullName: z.string().min(1, 'Họ tên không được để trống'),
  email: z.string().min(1, 'Email không được để trống').email('Email không đúng định dạng'),
  role: z.string().min(1, 'Vui lòng chọn vai trò'),
});

type UserFormValues = z.infer<typeof userSchema>;

const defaultValues: UserFormValues = {
  fullName: '',
  email: '',
  role: 'sales',
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData?: IUser | null;
}

export function UserFormDialog({ open, onOpenChange, initialData }: Props) {
  const [createdUserData, setCreatedUserData] = useState<{
    fullName: string;
    email: string;
    role: string;
    password?: string;
  } | null>(null);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);

    if (initialData) {
      form.reset({
        fullName: initialData.fullName,
        email: initialData.email,
        role: initialData.roles[0] || 'sales',
      });
    }
  }, [form, initialData]);

  useEffect(() => {
    if (!open) {
      form.reset(defaultValues);
      setCreatedUserData(null);
    }
  }, [open, form]);

  const createUser = useCreateUser();
  const updateUser = useUpdateUserRoles();

  const onSubmit = (values: UserFormValues) => {
    if (initialData) {
      const payload = {
        roles: [values.role],
      };
      updateUser.mutate(
        { id: initialData.id, data: payload },
        {
          onSuccess: () => {
            toast.success('Cập nhật vai trò thành công!');
            onOpenChange(false);
          },
          onError: (err: any) => toast.error(err.message || 'Cập nhật thất bại'),
        },
      );
    } else {
      const payload = {
        fullName: values.fullName,
        email: values.email,
        roles: [values.role],
      };
      createUser.mutate(payload, {
        onSuccess: (res: any) => {
          toast.success('Tạo tài khoản thành công!');
          setCreatedUserData({
            fullName: values.fullName,
            email: values.email,
            role: values.role,
            password: res.password,
          });
        },
        onError: (err: any) => toast.error(err.message || 'Tạo thất bại'),
      });
    }
  };

  const handleCopyInfo = () => {
    if (!createdUserData) return;
    const textToCopy = `Thông tin tài khoản Sulley Bán Hoa:
Họ tên: ${createdUserData.fullName}
Email: ${createdUserData.email}
Vai trò: ${createdUserData.role === 'administrator' ? 'Quản trị viên' : 'Nhân viên bán hàng'}
Mật khẩu: ${createdUserData.password}
Trang đăng nhập: ${window.location.origin}/login`;

    navigator.clipboard.writeText(textToCopy);
    toast.success('Đã sao chép thông tin tài khoản!');
  };

  const isLoading = createUser.isPending || updateUser.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl overflow-y-auto max-h-[90vh]">
        {createdUserData ? (
          <div className="space-y-6 py-4">
            <div className="flex flex-col items-center justify-center text-center space-y-2">
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                <CheckIcon className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Tạo tài khoản thành công!</h2>
              <p className="text-muted-foreground text-sm">
                Hãy sao chép thông tin đăng nhập bên dưới để gửi cho nhân viên.
              </p>
            </div>

            <div className="rounded-lg border bg-muted/40 p-4 space-y-3 font-mono text-sm">
              <div className="flex justify-between items-center py-1 border-b border-muted">
                <span className="text-muted-foreground font-sans">Họ và tên:</span>
                <span className="font-semibold text-foreground font-sans">
                  {createdUserData.fullName}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-muted">
                <span className="text-muted-foreground font-sans">Email đăng nhập:</span>
                <span className="font-semibold text-foreground font-sans">
                  {createdUserData.email}
                </span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-muted">
                <span className="text-muted-foreground font-sans">Vai trò:</span>
                <span className="font-semibold text-foreground font-sans">
                  {createdUserData.role === 'administrator'
                    ? 'Quản trị viên'
                    : 'Nhân viên bán hàng'}
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground font-sans">Mật khẩu tạm thời:</span>
                <span className="font-bold text-primary select-all">
                  {createdUserData.password}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <Button type="button" onClick={handleCopyInfo} className="w-full">
                Sao chép thông tin
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="w-full"
              >
                Đóng
              </Button>
            </div>
          </div>
        ) : (
          <>
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
                          <Input disabled={!!initialData} type="text" {...field} />
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
                          <Input disabled={!!initialData} type="text" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={() => (
                      <FormItem>
                        <FormLabel>Vai trò</FormLabel>
                        <FormControl>
                          <Controller
                            control={form.control}
                            name="role"
                            render={({ field: { value, onChange } }) => (
                              <Select value={value} onValueChange={onChange}>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Chọn vai trò" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="sales">Nhân viên bán hàng</SelectItem>
                                  <SelectItem value="administrator">Quản trị viên</SelectItem>
                                </SelectContent>
                              </Select>
                            )}
                          />
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
