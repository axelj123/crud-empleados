
export const Modal = ({ title, onClose, children }) => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-gray-900 bg-opacity-50">
        <div className="relative p-4 w-full max-w-2xl h-full md:h-auto">
          <div className="relative w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
            <div className="sticky top-0 z-10 bg-white dark:bg-black px-6 py-4 border-b dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                  {title}
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors dark:hover:bg-gray-700"
                >
                  <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            </div>
            <div className="max-h-[calc(100vh-200px)] overflow-y-auto p-6 bg-white dark:bg-black">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  };