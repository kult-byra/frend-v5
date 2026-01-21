export const TailwindIndicator = () => {
  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="fixed bottom-[3px] left-[3px] z-50 flex min-w-[26px] h-[18px] px-1 items-center justify-center rounded-[5px] bg-[#333333] text-[11px] text-[#FFFFFF] border border-[#555555] uppercase">
      <div className="block sm:hidden">base</div>
      <div className="hidden sm:block mobile:hidden">sm</div>
      <div className="hidden mobile:block tablet:hidden">mobile</div>
      <div className="hidden tablet:block laptop:hidden">tablet</div>
      <div className="hidden laptop:block desktop:hidden">laptop</div>
      <div className="hidden desktop:block wide:hidden">desktop</div>
      <div className="hidden wide:block">wide screen</div>
    </div>
  );
};
