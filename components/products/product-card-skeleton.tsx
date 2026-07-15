export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-pink-100">
      <div className="aspect-square skeleton" />
      <div className="p-3 space-y-2">
        <div className="skeleton h-4 rounded-md w-3/4" />
        <div className="skeleton h-3 rounded-md w-1/2" />
        <div className="skeleton h-5 rounded-md w-1/3" />
      </div>
    </div>
  );
}
