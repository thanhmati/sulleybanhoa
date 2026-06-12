import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldGroup } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { useLogin, useRegister } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/auth.store';

const authSchema = z.object({
  email: z.string().min(1, 'Vui lòng nhập email').email('Email không đúng định dạng'),
  password: z.string().min(6, 'Mật khẩu phải từ 6 ký tự'),
  fullName: z.string().optional(),
});

type AuthFormValues = z.infer<typeof authSchema>;

const defaultValues: AuthFormValues = {
  email: '',
  password: '',
  fullName: '',
};

export function LoginForm({ className, ...props }: React.ComponentProps<'form'>) {
  const [isRegistering, setIsRegistering] = useState(false);
  const form = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues,
  });

  const { isPending: isLoginPending, mutateAsync: loginMutate } = useLogin();
  const { isPending: isRegisterPending, mutateAsync: registerMutate } = useRegister();
  const navigate = useNavigate();
  const location = useLocation();
  const { setAuth } = useAuthStore();

  const from = (location.state as { from?: string })?.from || '/admin/orders';
  const isPending = isLoginPending || isRegisterPending;

  const onSubmit = async (values: AuthFormValues) => {
    try {
      if (isRegistering) {
        if (!values.fullName || values.fullName.trim() === '') {
          toast.error('Vui lòng nhập họ và tên để đăng ký');
          return;
        }
        await registerMutate({
          email: values.email,
          password: values.password,
          fullName: values.fullName,
        });
        toast.success('Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay.');
        setIsRegistering(false);
        form.setValue('password', '');
      } else {
        const res = await loginMutate({
          email: values.email,
          password: values.password,
        });

        const { accessToken, refreshToken, user } = res;
        setAuth(accessToken, refreshToken, user);
        navigate(from, { replace: true });
        toast.success('Đăng nhập thành công');
      }
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
            <h1 className="text-2xl font-bold">
              {isRegistering ? 'Đăng ký tài khoản' : 'Đăng nhập'}
            </h1>
            <p className="text-muted-foreground text-sm">
              {isRegistering
                ? 'Nhập thông tin bên dưới để tạo tài khoản mới'
                : 'Nhập email và mật khẩu để tiếp tục'}
            </p>
          </div>

          {isRegistering && (
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="fullName">Họ và tên</FormLabel>
                  <FormControl>
                    <Input id="fullName" placeholder="Admin Sulley" required {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

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
                  {!isRegistering && (
                    <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                      Quên?
                    </a>
                  )}
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
              {isPending
                ? isRegistering
                  ? 'Đang đăng ký...'
                  : 'Đang đăng nhập...'
                : isRegistering
                  ? 'Đăng ký'
                  : 'Đăng nhập'}
            </Button>
          </Field>

          <Field>
            <FieldDescription className="text-center text-sm">
              {isRegistering ? (
                <>
                  Đã có tài khoản?{' '}
                  <button
                    type="button"
                    onClick={() => setIsRegistering(false)}
                    className="underline underline-offset-4 cursor-pointer font-medium text-primary bg-transparent border-0 p-0"
                  >
                    Đăng nhập
                  </button>
                </>
              ) : (
                <>
                  Chưa có tài khoản?{' '}
                  <button
                    type="button"
                    onClick={() => setIsRegistering(true)}
                    className="underline underline-offset-4 cursor-pointer font-medium text-primary bg-transparent border-0 p-0"
                  >
                    Đăng ký
                  </button>
                </>
              )}
            </FieldDescription>
          </Field>
        </FieldGroup>
      </form>
    </Form>
  );
}
