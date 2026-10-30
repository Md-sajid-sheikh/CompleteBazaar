function AdminMessage({ error, loading, children }) {
  if (loading) {
    return <p className="py-10 text-center text-sm text-[#686b60]" role="status">Loading {children || 'admin data'}…</p>;
  }
  if (error) {
    return <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800" role="alert">{error}</p>;
  }
  return null;
}

export default AdminMessage;
