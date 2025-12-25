export default function CatalogTeaserSection() {
  const categories = [
    {
      title: 'ספרי קריאה ועיון',
      description: 'מבחר עשיר של ספרים להעשרה ולפנאי',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      color: 'primary'
    },
    {
      title: 'ציוד כתיבה יוקרתי',
      description: 'עטים, מחברות ואביזרי כתיבה איכותיים',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
        </svg>
      ),
      color: 'accent'
    },
    {
      title: 'ערכות יצירה',
      description: 'כלי יצירה, אומנות ופעילות ידנית',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      color: 'primary'
    },
    {
      title: 'סדנאות העשרה',
      description: 'השתתפות בסדנאות מיוחדות ופעילויות',
      icon: (
        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'accent'
    }
  ];

  return (
    <section className="bg-neutral-50 py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
            מה אפשר למצוא אצלנו?
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            מגוון רחב של מוצרים ופעילויות שממתינים לכן
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {categories.map((category, index) => (
            <div
              key={index}
              className={`bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border-2 ${
                category.color === 'accent' 
                  ? 'border-accent-200 hover:border-accent-400' 
                  : 'border-primary-200 hover:border-primary-400'
              } group cursor-pointer hover:-translate-y-1`}
            >
              {/* Icon */}
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4 ${
                category.color === 'primary' 
                  ? 'bg-primary-100 text-primary-600 group-hover:bg-primary-500 group-hover:text-white' 
                  : 'bg-accent-100 text-accent-600 group-hover:bg-accent-500 group-hover:text-white'
              } transition-all duration-300`}>
                {category.icon}
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-neutral-800 mb-2 text-right">
                {category.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-neutral-600 text-right leading-relaxed">
                {category.description}
              </p>

              {/* Decorative element */}
              <div className={`mt-4 h-1 w-12 rounded-full ${
                category.color === 'primary' ? 'bg-primary-200' : 'bg-accent-200'
              } group-hover:w-full transition-all duration-300`}></div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-neutral-600 mb-4">
            רוצות לראות את כל המוצרים?
          </p>
          <p className="text-sm text-neutral-500">
            התחברו כדי לגלות את הקטלוג המלא ולהתחיל לממש שוברים
          </p>
        </div>
      </div>
    </section>
  );
}
