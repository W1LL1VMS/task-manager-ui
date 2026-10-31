export default function Background() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -left-32 -top-40 h-[34rem] w-[34rem] rounded-full bg-neon-cyan/20 blur-[120px] animate-float" />
      <div className="absolute -right-40 top-1/3 h-[32rem] w-[32rem] rounded-full bg-neon-violet/20 blur-[120px] animate-float [animation-delay:-6s]" />
      <div className="absolute inset-0 opacity-[0.07] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:56px_56px]" />
    </div>
  );
}