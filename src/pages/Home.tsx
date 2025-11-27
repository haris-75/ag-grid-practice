import { Link } from "react-router-dom";

const tasks = [
  {
    id: "01",
    title: "Task 1",
    description: "Work with the data overview grid and explore its features.",
    href: "task-1",
  },
  {
    id: "02",
    title: "Task 2",
    description: "Head to the second task page for the next exercise.",
    href: "task-2",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-14">
      <div className="max-w-4xl w-full space-y-12 text-center">
        <header className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
            AG Grid Practice
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900">
            Choose a task to get started
          </h1>
          <p className="text-sm md:text-base text-slate-600">
            Jump straight into the exercises below. Each card takes you to a
            different task so you can try things out quickly.
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 text-left">
          {tasks.map((task) => (
            <Link
              key={task.id}
              to={task.href}
              className="group block rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-slate-900">
                    {task.title}
                  </h2>
                  <p className="text-sm text-slate-600">{task.description}</p>
                </div>
                <span className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-sky-50 text-sm font-semibold text-sky-600">
                  {task.id}
                </span>
              </div>
              <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-600">
                <span>Open task</span>
                <span className="transition group-hover:translate-x-1">{"->"}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
