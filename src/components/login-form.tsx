import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { useLogin } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';

const authSchema = z.object({
  email: z.string().min(1, 'Vui lòng nhập email').email('Email không đúng định dạng'),
  password: z.string().min(6, 'Mật khẩu phải từ 6 ký tự'),
});

type AuthFormValues = z.infer<typeof authSchema>;

const defaultValues: AuthFormValues = {
  email: '',
  password: '',
};

export function LoginForm({ className, ...props }: React.ComponentProps<'form'>) {
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues,
  });

  const { isPending, mutateAsync: loginMutate } = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();

  const from = (location.state as { from?: string })?.from || '/admin/orders';

  const onSubmit = async (values: AuthFormValues) => {
    try {
      const res = await loginMutate({
        email: values.email,
        password: values.password,
      });

      const { accessToken, refreshToken, user } = res;
      setAuth(accessToken, refreshToken, user);
      navigate(from, { replace: true });
      toast.success('Đăng nhập thành công');
    } catch (error: any) {
      toast.error(error.message || 'Đã có lỗi xảy ra');
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
        </FieldGroup>
      </form>
    </Form>
  );
}
