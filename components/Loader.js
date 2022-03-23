const Loader = () => {
  return (
    <div className="flex flex-row items-center justify-center w-auto h-80v gap-x-4">
      <span className="w-4 h-4 ease-linear rounded-full opacity-75 bg-zinc-400 animate-bounce loader-1"></span>
      <span className="w-4 h-4 ease-linear rounded-full opacity-75 bg-zinc-400 animate-bounce loader-2"></span>
      <span className="w-4 h-4 ease-linear rounded-full opacity-75 bg-zinc-400 animate-bounce loader-3"></span>
    </div>
  );
};

export default Loader;
