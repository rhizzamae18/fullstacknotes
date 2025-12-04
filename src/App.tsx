import { useEffect, useState, type FormEvent } from "react";
import { Task } from "./shared/task";
import { remult } from "remult";
import { TasksController } from "./shared/TasksController";

const taskRepo = remult.repo(Task)

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("")

  useEffect(() => {
    return taskRepo
      .liveQuery({
        where: {
          completed: undefined
        }
      }).subscribe(info => setTasks(info.applyChanges))
  }, []);
  async function addTask(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    try {
      await taskRepo.insert({ title: newTaskTitle })
      // setTasks((tasks) => [...tasks, newTask])
      setNewTaskTitle("")
    }
    catch (error: unknown) {
      alert((error as Error).message)
    }
  }

  async function setAllCompleted(completed: boolean) {
    await TasksController.setAllCompleted(completed)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-10 px-4 font-sans text-gray-900">
      <h1 className="text-4xl font-bold text-gray-900 mb-8 tracking-tight">Todos</h1>
      <main className="bg-white shadow-xl rounded-2xl p-4 md:p-6 w-full max-w-lg border border-gray-200">
        {taskRepo.metadata.apiInsertAllowed() && (
          <form onSubmit={e => addTask(e)} className="flex gap-3 mb-6">
            <input
              value={newTaskTitle}
              placeholder="What needs to be done?"
              onChange={(e) => setNewTaskTitle(e.target.value)}
              className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-black focus:ring-0 transition-all placeholder-gray-400"
            />
            <button className="bg-black hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95">
              Add
            </button>
          </form>
        )}
        <div className="space-y-2">
          {tasks.map((task) => {
            async function deleteTask() {
              try {
                await taskRepo.delete(task)
                setTasks((tasks) => tasks.filter((t) => t !== task));
              }
              catch (error: unknown) {
                alert((error as Error).message)
              }
            }
            function setTask(value: Task) {
              setTasks((tasks) => tasks.map((t) => (t === task ? value : t)))
            }
            async function setCompleted(completed: boolean) {
              setTask(await taskRepo.save({ ...task, completed }))
            }
            function setTitle(title: string) {
              setTask({ ...task, title })
            }

            async function doSaveTask() {
              try {
                setTask(await taskRepo.save(task));
              } catch (error: unknown) {
                alert((error as Error).message)
              }
            }

            return (
              <div key={task.id} className="group flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-200">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={e => setCompleted(e.target.checked)}
                  className="w-5 h-5 text-black rounded focus:ring-black border-gray-300 cursor-pointer accent-black"
                />
                <input
                  value={task.title}
                  onChange={e => setTitle(e.target.value)}
                  className={`flex-1 bg-transparent focus:outline-none text-lg ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900'}`}
                />
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => doSaveTask()} className="text-sm text-gray-500 hover:text-black font-medium px-2 py-1 rounded hover:bg-gray-100 transition-colors">
                    Save
                  </button>
                  {taskRepo.metadata.apiDeleteAllowed() && (
                    <button onClick={() => deleteTask()} className="text-sm text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors">
                      Delete
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col sm:flex-row justify-between mt-8 pt-6 border-t border-gray-100 gap-4 sm:gap-0">
          <button onClick={() => setAllCompleted(true)} className="text-sm text-gray-500 hover:text-black font-medium transition-colors hover:underline text-center sm:text-left">
            Set all completed
          </button>
          <button onClick={() => setAllCompleted(false)} className="text-sm text-gray-500 hover:text-black font-medium transition-colors hover:underline text-center sm:text-right">
            Set all uncompleted
          </button>
        </div>
      </main>
    </div>
  );
}

export default App
