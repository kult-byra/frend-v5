export const TailwindIndicator = () => {
  if (process.env.NODE_ENV === "production") return null;

  return (
    <div className="fixed bottom-[3px] left-[3px] z-50 flex w-[26px] h-[18px] items-center justify-center rounded-[5px] bg-[#333333] text-[11px] text-[#FFFFFF] border border-[#555555] uppercase">
      <div className="block xs:hidden">&lt;xs</div>
      <div className="hidden xs:block sm:hidden">xs</div>
      <div className="hidden sm:block md:hidden">sm</div>
      <div className="hidden md:block lg:hidden">md</div>
      <div className="hidden lg:block xl:hidden">lg</div>
      <div className="hidden xl:block 2xl:hidden">xl</div>
      <div className="hidden 2xl:block">2xl</div>
    </div>
  );
};
