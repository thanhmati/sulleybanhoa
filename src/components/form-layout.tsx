import FormFooter from './ui/form-footer';

interface FormLayoutProps {
  form: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export default function FormLayout({ form, header, footer }: FormLayoutProps) {
  return (
    <div className="relative overflow-hidden">
      {header}
      <div className="space-y-4 w-full overflow-y-auto h-screen max-h-[calc(100vh_-_170px)] p-6">
        {form}
      </div>
      <FormFooter>{footer}</FormFooter>
    </div>
  );
}
