export const TailwindIndicator = () => {
  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="fixed bottom-[3px] left-[3px] z-50 flex min-w-[26px] h-[18px] px-1 items-center justify-center rounded-[5px] bg-[#333333] text-[11px] text-[#FFFFFF] border border-[#555555] uppercase">
      <div className="block sm:hidden">base</div>
      <div className="hidden sm:block mobile:hidden">sm (320px)</div>
      <div className="hidden mobile:block tablet:hidden">mobile (390px)</div>
      <div className="hidden tablet:block laptop:hidden">tablet (820px)</div>
      <div className="hidden laptop:block desktop:hidden">laptop (1024px)</div>
      <div className="hidden desktop:block wide:hidden">desktop (1440px)</div>
      <div className="hidden wide:block">wide (1920px)</div>
    </div>
  );
};
