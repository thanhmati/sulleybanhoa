import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useChangePassword } from '@/hooks/useAuth';
import { useCurrentUserQuery } from '@/hooks/useUsers';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const changePasswordSchema = z.object({
  oldPassword: z.string().min(1, 'Mật khẩu cũ không được bỏ trống'),
  newPassword: z.string().min(1, 'Mật khẩu mới không được bỏ trống'),
  email: z.string().min(1, 'Email không được bỏ trống'),
});

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

const defaultValues: ChangePasswordFormValues = {
  email: '',
  newPassword: '',
  oldPassword: '',
};

export default function ChangePasswordPage() {
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues,
  });

  const { data: user } = useCurrentUserQuery();

  const { mutateAsync, isPending } = useChangePassword();

  useEffect(() => {
    if (user) {
      form.reset({
        email: user.email,
      });
    }
  }, [form, user]);

  const onSubmit = async (values: ChangePasswordFormValues) => {
    try {
      await mutateAsync(values);

      toast.success('Cập nhật mật khẩu thành công!');
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Cập nhật thất bại');
    } finally {
      form.setValue('oldPassword', '');
      form.setValue('newPassword', '');
    }
  };

  return (
    <Form {...form}>
      <Card className="bg-muted/20 border border-border/40">
        <CardContent className="mt-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="oldPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu cũ</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu mới</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isPending}>
              {isPending ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Form>
  );
}
