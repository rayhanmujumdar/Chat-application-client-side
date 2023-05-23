export default function Layout({ children }) {
  return (
    <div className="max-w-7xl mx-auto -mt-1">
      <div className="min-w-full border rounded flex lg:grid lg:grid-cols-3">
        {children}
      </div>
    </div>
  );
}
