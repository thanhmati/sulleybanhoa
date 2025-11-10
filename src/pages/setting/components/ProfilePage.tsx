import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
import { useUpdateMultipleFile } from '@/hooks/useMedia';
import { useCurrentUserQuery, useUpdateCurrentUser } from '@/hooks/useUsers';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

const profileSchema = z.object({
  fullName: z.string().min(1, 'Họ tên không được để trống'),
  avatar: z.string().optional(),
  email: z.string(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const defaultValues: ProfileFormValues = {
  fullName: '',
  avatar: '',
  email: '',
};

export default function ProfilePage() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(undefined);

  const { data: user } = useCurrentUserQuery();

  const updateUser = useUpdateCurrentUser();

  const updateMultipleFile = useUpdateMultipleFile();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isLoading = updateUser.isPending || updateMultipleFile.isPending;

  useEffect(() => {
    if (user) {
      form.reset({
        avatar: user.avatar,
        fullName: user.fullName,
        email: user.email,
      });
      setPreviewUrl(user.avatar);
    }
  }, [form, user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleClickUpload = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (values: ProfileFormValues) => {
    let avatarUrl = values.avatar;

    if (selectedFile) {
      const res = await updateMultipleFile.mutateAsync([selectedFile]);
      avatarUrl = res[0];
    }

    updateUser.mutate(
      { avatar: avatarUrl, fullName: values.fullName },
      {
        onSuccess: () => {
          toast.success('Cập nhật thông tin thành công!');
        },
        onError: () => toast.error('Cập nhật thất bại'),
      },
    );
  };

  return (
    <Form {...form}>
      <Card className="bg-muted/20 border border-border/40">
        <CardContent className="mt-6">
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="avatar"
              render={() => (
                <FormItem>
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={previewUrl} />
                      <AvatarFallback>👤</AvatarFallback>
                    </Avatar>

                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />

                      <Button type="button" variant="secondary" onClick={handleClickUpload}>
                        Tải ảnh đại diện
                      </Button>
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
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

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Form>
  );
}
