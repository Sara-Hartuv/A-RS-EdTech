const StudentProcessHome = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-neutral-50">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-neutral-200 p-10 text-center">
        
        <div className="flex justify-center mb-6">
          <div className="w-14 h-14 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-2xl">
            💬
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-neutral-800 mb-4">
          התהליך האישי שלי
        </h1>

        <p className="text-neutral-600 leading-relaxed mb-8">
          המקום הזה נועד לעזור לך לעצור לרגע,
          <br />
          להבין קושי אחד, ולעבוד עליו בקצב שלך.
        </p>

        <button
          className="w-full py-3 rounded-xl bg-primary-500 text-white font-medium text-lg hover:bg-primary-600 transition"
        >
          התחלת תהליך חדש
        </button>
      </div>
    </div>
  );
};

export default StudentProcessHome;
