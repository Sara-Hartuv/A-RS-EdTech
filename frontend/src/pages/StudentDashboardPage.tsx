export default function StudentDashboardPage() {
  return (
    <div className="mt-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">דשבורד תלמידה</h1>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-slate-500">סה״כ תעודות הצטיינות</p>
          <p className="text-3xl font-bold text-slate-800 mt-2">8</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-slate-500">שוברים זמינים</p>
          <p className="text-3xl font-bold text-emerald-700 mt-2">12</p>
        </div>
        <div className="bg-white rounded-xl shadow p-4">
          <p className="text-sm text-slate-500">הזמנות בהמתנה</p>
          <p className="text-3xl font-bold text-amber-600 mt-2">2</p>
        </div>
      </div>
    </div>
  );
}
