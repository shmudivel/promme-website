export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center space-y-6 max-w-2xl">
        <h1 className="text-6xl font-bold text-gray-900">
          PROMME
        </h1>
        <p className="text-xl text-gray-600">
          Industrial HR Platform Demo
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <a
            href="/register"
            className="px-8 py-4 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Get Started
          </a>
          <a
            href="/login"
            className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Sign In
          </a>
        </div>
      </div>
    </main>
  );
}

