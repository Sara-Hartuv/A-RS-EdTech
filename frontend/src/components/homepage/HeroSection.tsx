import { useNavigate } from 'react-router-dom';

export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="bg-gradient-to-br from-primary-50 via-white via-accent-50/30 to-primary-100 py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Right side - Text content */}
          <div className="order-2 md:order-1 text-right">
            <h1 className="text-4xl md:text-5xl font-bold text-primary-700 mb-6 leading-tight">
              ההישגים שלך הופכים למתנות
            </h1>
            <p className="text-lg md:text-xl text-neutral-600 mb-8 leading-relaxed">
              ברוכה הבאה למערכת הצבירה. כאן תוכלי לעקוב אחרי היתרה שלך ולממש שוברים בצורה קלה ומהירה.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="bg-gradient-to-r from-accent-700 via-accent-500 to-accent-600 hover:from-accent-800 hover:via-accent-600 hover:to-accent-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              כניסה לאזור האישי
            </button>
          </div>

          {/* Left side - Illustration */}
          <div className="order-1 md:order-2 flex justify-center">
            <div className="relative">
              {/* Main illustration container */}
              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 max-w-md">
                {/* Decorative elements - representing achievements */}
                <div className="space-y-6">
                  {/* Book icon */}
                  <div className="flex items-center gap-4 bg-primary-50 p-4 rounded-xl">
                    <div className="bg-primary-500 p-3 rounded-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <div className="text-right flex-1">
                      <p className="text-sm text-primary-600 font-medium">לימודים והשקעה</p>
                      <p className="text-xs text-neutral-500">בונים את העתיד</p>
                    </div>
                  </div>

                  {/* Gift icon */}
                  <div className="flex items-center gap-4 bg-accent-50 p-4 rounded-xl">
                    <div className="bg-accent-500 p-3 rounded-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                      </svg>
                    </div>
                    <div className="text-right flex-1">
                      <p className="text-sm text-accent-600 font-medium">פרסים ומתנות</p>
                      <p className="text-xs text-neutral-500">תגמולים על הצלחה</p>
                    </div>
                  </div>

                  {/* Star icon */}
                  <div className="flex items-center gap-4 bg-primary-50 p-4 rounded-xl">
                    <div className="bg-primary-500 p-3 rounded-lg">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                    </div>
                    <div className="text-right flex-1">
                      <p className="text-sm text-primary-600 font-medium">הצטיינות</p>
                      <p className="text-xs text-neutral-500">הישגים מיוחדים</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating decorative element */}
              <div className="absolute -top-4 -right-4 bg-gradient-to-br from-red to-accent-500 text-white rounded-full p-4 shadow-lg animate-bounce">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
