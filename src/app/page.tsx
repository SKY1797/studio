import RotaCalendar from '@/components/rota-calendar';

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-background text-foreground p-4 sm:p-6 md:p-8">
      <header className="w-full max-w-7xl mb-8">
        <h1 className="text-4xl font-bold text-primary font-headline">ShiftMaster Rota</h1>
        <p className="text-muted-foreground mt-2">Your weekly employee shift schedule, updated in real-time.</p>
      </header>
      <main className="w-full max-w-7xl">
        <RotaCalendar />
      </main>
    </div>
  );
}
