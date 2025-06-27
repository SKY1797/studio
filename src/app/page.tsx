import RotaCalendar from '@/components/rota-calendar';

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <header className="w-full max-w-7xl mb-4">
        <h1 className="text-4xl font-bold text-primary font-headline">ShiftMaster Rota</h1>
      </header>
      <main className="w-full max-w-7xl flex-1 flex flex-col min-h-0">
        <RotaCalendar />
      </main>
    </div>
  );
}
