export default function HomePage() {
  return (
    <div className="grid gap-6 md:grid-cols-2 items-start mt-6">
      <section className="bg-white rounded-xl shadow p-6">
        <h1 className="text-2xl font-bold mb-3 text-slate-800">
          ברוכה הבאה למערכת השוברים של מיתרים
        </h1>
        <p className="text-slate-600 mb-4">
          כאן תלמידות יכולות לעקוב אחרי תעודות הצטיינות ושוברים,
          ומורות יכולות לנהל ולחלק תעודות בצורה מסודרת.
        </p>
        <ul className="list-disc pr-5 text-slate-600 space-y-1 text-sm">
          <li>תלמידה: צפייה במלאי השוברים והמוצרים</li>
          <li>מורה: ניהול תעודות, שוברים ואישור הזמנות</li>
          <li>מנהלת: תמונת מצב כללית של התקדמות התוכנית</li>
        </ul>
      </section>

      <section className="grid gap-4">
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <h2 className="font-semibold text-blue-800 mb-1">מה חדש?</h2>
          <p className="text-sm text-blue-900">
            בקרוב: חנות חדשה עם מוצרים, פילטרים לפי קטגוריות, והצגת מוצרים
            שעומדים להיגמר מהמלאי.
          </p>
        </div>
        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
          <h2 className="font-semibold text-emerald-800 mb-1">גרסת פיתוח</h2>
          <p className="text-sm text-emerald-900">
            זוהי גרסת פיתוח ראשונית. בקרוב יתווספו כניסת תלמידה, כניסת מורה
            וחיבור מלא למסד הנתונים.
          </p>
        </div>
      </section>
    </div>
  );
}
