export const LoadingSpinner = () => (
  <div className="h-screen flex flex-col bg-gradient-to-b from-blue-50/80 to-white p-4 md:p-8">
    <div className="max-w-7xl mx-auto w-full">
      {/* Loading Profile Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl shadow-lg mb-8 overflow-hidden animate-pulse">
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/20"></div>
            <div className="flex-1 space-y-4">
              <div className="h-8 bg-white/20 rounded w-64"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-4 bg-white/20 rounded"></div>
                <div className="h-4 bg-white/20 rounded"></div>
                <div className="h-4 bg-white/20 rounded"></div>
                <div className="h-4 bg-white/20 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-blue-100 bg-blue-50">
          <div className="h-6 bg-blue-200 rounded w-48 animate-pulse"></div>
        </div>

        <div className="p-6">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-t-blue-500 border-b-blue-300 border-blue-200 rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 text-lg font-medium">
              Loading test results...
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Please wait while we fetch your data
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const ErrorComponent = ({ error, onRetry }) => (
  <div className="h-screen flex flex-col bg-gradient-to-b from-red-50/80 to-white p-4 md:p-8">
    <div className="max-w-4xl mx-auto w-full">
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-red-200">
        <div className="px-6 py-4 border-b border-red-100 bg-red-50">
          <h2 className="font-semibold text-red-700 flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Error Loading Test Reports
          </h2>
        </div>

        <div className="p-8 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Unable to Load Test Results
            </h3>
            <p className="text-gray-600 mb-4">
              {error?.message ||
                "An unexpected error occurred while fetching test reports."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors duration-200"
                >
                  Try Again
                </button>
              )}
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md transition-colors duration-200"
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);
