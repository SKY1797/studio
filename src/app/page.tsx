import RotaCalendar from '@/components/rota-calendar';

export default function Home() {
  return (
    <div className="container mx-auto p-4 sm:p-6 md:p-8">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary font-headline">ShiftMaster Rota</h1>
      </header>
      <main>
        <RotaCalendar />
      </main>
    </div>
  );
}
