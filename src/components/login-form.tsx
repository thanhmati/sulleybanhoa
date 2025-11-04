import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { useLogin } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';

const loginSchema = z.object({
  email: z.string().min(1, 'Vui lòng nhập email'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const defaultValues: LoginFormValues = {
  email: '',
  password: '',
};

export function LoginForm({ className, ...props }: React.ComponentProps<'form'>) {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues,
  });

  const { isPending, mutateAsync } = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore(); // ✅ lấy setter từ Zustand

  const from = (location.state as { from?: string })?.from || '/admin/orders';

  const onSubmit = async (values: LoginFormValues) => {
    try {
      const res = await mutateAsync(values);

      // 🔑 Giả sử API trả về { accessToken, refreshToken, user }
      const { accessToken, refreshToken, user } = res;

      // ✅ Lưu token
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      localStorage.setItem('user', JSON.stringify(user));

      // ✅ Cập nhật Zustand state
      setAuth(accessToken, user);

      // ✅ Điều hướng
      navigate(from, { replace: true });
      toast.success('Đăng nhập thành công');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại');
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('flex flex-col gap-6', className)}
        {...props}
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <h1 className="text-2xl font-bold">Đăng nhập</h1>
            <p className="text-muted-foreground text-sm">Nhập email và mật khẩu để tiếp tục</p>
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="email">Email</FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    placeholder="example@gmail.com"
                    required
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center">
                  <FormLabel htmlFor="password">Mật khẩu</FormLabel>
                  <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                    Quên?
                  </a>
                </div>
                <FormControl>
                  <Input id="password" type="password" required {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Field>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
            </Button>
          </Field>

          <Field>
            <FieldDescription className="text-center text-sm">
              Chưa có tài khoản?{' '}
              <a href="#" className="underline underline-offset-4">
                Đăng ký
              </a>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </Form>
  );
}
