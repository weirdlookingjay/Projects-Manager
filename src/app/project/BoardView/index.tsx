/* eslint-disable react-hooks/rules-of-hooks */
import { useGetTasksQuery, useUpdateTaskStatusMutation } from '@/state/api';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { task as TaskType } from "@/state/api";
import { EllipsisVertical } from 'lucide-react';

type Props = {
    id: string;
    setIsModalNewTaskOpen: (isOpen: boolean) => void
}

const taskStatus = ["To Do", "Work In Progress", "Under Review", "Completed"];

const index = ({ id, setIsModalNewTaskOpen }: Props) => {
    const { data: tasks, isLoading, error } = useGetTasksQuery({ projectId: Number(id) });

    const [updateTaskStatus] = useUpdateTaskStatusMutation()

    const moveTask = (taskId: number, toStatus: string) => {
        updateTaskStatus({ taskId, status: toStatus })
    }

    if (isLoading) return <div>Loading...</div>
    if (error) return <div>An error occurred while fetching tasks</div>

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
                {taskStatus.map((status) => (
                    <TaskColumn key={status} status={status} tasks={tasks || []} moveTask={moveTask} setIsModalNewTaskOpen={setIsModalNewTaskOpen} />
                ))}
            </div>
        </DndProvider>
    )
}


type TaskColumnProps = {
    status: string
    tasks: TaskType[]
    moveTask: (taskId: number, toStatus: string) => void
    setIsModalNewTaskOpen: (isOpen: boolean) => void
}

const TaskColumn = ({
    status, tasks, moveTask, setIsModalNewTaskOpen
}: TaskColumnProps) => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: "task",
        drop: (item: { id: number }) => moveTask(item.id, status),
        collect: monitor => ({
            isOver: !!monitor.isOver()
        })
    }));

    const tasksCount = tasks.filter((task) => task.status === status).length;

    const statusColor: any = {
        "To Do": "#2563EB",
        "Work In Progress": "#059669",
        "Under Review": "#D97706",
        Completed: "#000000",
    }

    return (
        <div ref={(instance) => {
            drop(instance)
        }} className={`sl:py-4 rounded-lg py-2 xl:px-2 ${isOver ? "bg-blue-100 dark:bg-neutral-950" : ""}`}>
            <div className="mb-3 flex w-full">
                <div className={`w-2 !bg-[${statusColor[status]}] rounded-s-lg`} style={{ backgroundColor: statusColor[status] }} />
                <div className="flex w-full items-center justify-between rounded-e-lg bg-white px-5 py-4 dark:bg-dark-secondary">
                    <h3 className="flex items-center text-lg font-semibold dark:text-white">
                        {status} {" "}
                        <span className="ml-2 inlineblock rounded-full bg-gray-200 p-1 text-center text-sm leading-none dark:bg-dark-tertiary" style={{ width: "1.5rem", height: "1.5rem" }}>{tasksCount}</span>
                    </h3>
                    <div className="flex items-center gap-1">
                        <button className="flex h-6 w-5 items-center justify-center dark:text-neutral-500">
                            <EllipsisVertical size={26} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default index