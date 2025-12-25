export default function FooterSection() {
  return (
    <footer className="bg-primary-600 text-white py-12 w-full">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* About section */}
          <div className="text-right">
            <h3 className="text-xl font-bold mb-4">מערכת השוברים</h3>
            <p className="text-primary-100 text-sm leading-relaxed">
              פלטפורמה דיגיטלית לניהול הישגי תלמידות ומימוש שוברים. 
              מעודדת הצטיינות ומאפשרת מעקב פשוט ונוח.
            </p>
          </div>

          {/* Quick links */}
          <div className="text-right">
            <h3 className="text-xl font-bold mb-4">קישורים מהירים</h3>
            <ul className="space-y-2 text-primary-100 text-sm">
              <li>
                <a href="/login" className="hover:text-white transition-colors duration-200">
                  כניסה למערכת
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors duration-200">
                  איך זה עובד?
                </a>
              </li>
              <li>
                <a href="#catalog" className="hover:text-white transition-colors duration-200">
                  קטלוג מוצרים
                </a>
              </li>
              <li>
                <a href="#terms" className="hover:text-white transition-colors duration-200">
                  תקנון המערכת
                </a>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="text-right">
            <h3 className="text-xl font-bold mb-4">תמיכה ויצירת קשר</h3>
            <div className="space-y-3 text-primary-100 text-sm">
              <div className="flex items-center justify-end gap-2">
                <span>support@voucher-system.edu</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex items-center justify-end gap-2">
                <span>שעות פעילות: א׳-ה׳ 08:00-16:00</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs mt-4 leading-relaxed">
                זקוקות לעזרה? צוות התמיכה זמין לסייע בכל שאלה טכנית או הנחיה בשימוש במערכת.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-500 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-100">
            <p className="text-center md:text-right">
              © {new Date().getFullYear()} מערכת השוברים. כל הזכויות שמורות.
            </p>
            <div className="flex gap-6">
              <a href="#privacy" className="hover:text-white transition-colors duration-200">
                מדיניות פרטיות
              </a>
              <a href="#terms" className="hover:text-white transition-colors duration-200">
                תנאי שימוש
              </a>
              <a href="#accessibility" className="hover:text-white transition-colors duration-200">
                הצהרת נגישות
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
