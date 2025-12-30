import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section
      className="relative bg-cover bg-center py-16 md:py-24"
      style={{
        backgroundImage: `url('https://www.picpong.co.il/s_pictures/img31671.jpg')`
      }}
    >
      {/* overlay removed per request */}

      <div className="relative container mx-auto px-4">
        <div className="grid grid-cols-1 gap-12 items-center justify-items-center">
          {/* Right side - Text content (centered over bg image) */}
          <div className="order-2 md:order-1 w-full">
            <div className="group mx-auto max-w-2xl bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-10 text-right shadow-xl transform transition-all duration-500">
              <div className="flex justify-end mb-4">
                <div className="h-1 w-20 bg-red-500 rounded-full animate-pulse/90"></div>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                ההישגים שלך הופכים למתנות
              </h1>

              <p className="text-base md:text-lg text-white/95 mb-6 leading-relaxed">
                ברוכה הבאה למערכת . כאן תוכלי לעקוב אחרי ההשיגים שלך ולממש שוברים בצורה קלה ומהירה.
              </p>

              <div className="flex justify-end">
                <button
                  onClick={() => navigate('/login')}
                  className="inline-flex items-center gap-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition-transform duration-300 group-hover:-translate-y-1 hover:scale-105"
                >
                  כניסה לאזור האישי
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
