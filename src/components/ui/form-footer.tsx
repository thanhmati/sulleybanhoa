interface FormFooterProps {
  children: React.ReactNode;
}

export default function FormFooter({ children }: FormFooterProps) {
  return (
    <div className="sticky left-0 right-0 p-6 flex justify-end items-center border-0 border-t border-solid border-neutral-200 z-10 min-h-[90px] w-full">
      {children}
    </div>
  );
}
