export default function Home() {
  return (
    <div className="p-6 space-y-4">
      <p className="text-gray-600">
        Vælg en sektion i venstre menu (Ordrer eller Menu).
      </p>

      {/* Test-boks der *skal* skifte farve */}
      <div className="p-4 rounded bg-gray-200 dark:bg-blue-800 text-black dark:text-white">
        TEST DARK MODE
      </div>
    </div>
  );
}
