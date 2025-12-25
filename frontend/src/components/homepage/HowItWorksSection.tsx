export default function HowItWorksSection() {
  const steps = [
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: 'לומדות ומשקיעות',
      description: 'השקיעו במאמצים, הצטיינו בלימודים, והשתתפו בפעילויות'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: 'צוברות נקודות במערכת',
      description: 'כל הישג מתורגם לנקודות ושוברים שנצברים באזור האישי שלך'
    },
    {
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
      ),
      title: 'מימוש השוברים בחנות שלנו',
      description: 'בוחרות מוצרים מהקטלוג וממשות את השוברים למתנות אמיתיות'
    }
  ];

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">
            איך זה עובד?
          </h2>
          <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
            שלושה שלבים פשוטים להפוך הישגים למתנות
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div
              key={index}
              className="text-center group hover:transform hover:scale-105 transition-all duration-300"
            >
              {/* Icon container */}
              <div className="inline-flex items-center justify-center w-24 h-24 bg-primary-100 text-primary-600 rounded-full mb-6 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300 shadow-md">
                {step.icon}
              </div>

              {/* Step number */}
              <div className="inline-block bg-gradient-to-r from-accent-100 to-red-light/30 text-accent-700 font-bold px-4 py-1 rounded-full text-sm mb-4 border border-accent-200">
                שלב {index + 1}
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-neutral-800 mb-3">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-neutral-600">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Connecting line for desktop */}
        <div className="hidden md:block relative -mt-80 mb-80">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary-300 via-accent-200 to-transparent" 
               style={{ transform: 'translateY(-50%)', maxWidth: '80%', margin: '0 auto' }}>
          </div>
        </div>
      </div>
    </section>
  );
}
