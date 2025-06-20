import Header from '@/components/Header';
import StatementForm from '@/components/StatementForm';

export default function NewStatement() {
  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <Header />
      <main className="p-4 md:p-8 max-w-3xl mx-auto">
        <h1 className="text-2xl sm:text-3xl mb-4">New Statement</h1>
        <StatementForm />
      </main>
      <script id="statement-template" type="text/x-handlebars-template">
        {{name}} gives the following statement on {{date}} at {{location}}.
        {{description}}
      </script>
    </div>
  );
}
