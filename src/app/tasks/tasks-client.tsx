"use client";

import { PageHeader } from "@/components/page-header";
import { StatusBadge } from "@/components/status-badge";
import { StatCard } from "@/components/stat-card";
import { Modal } from "@/components/modal";
import { getInitials, timeAgo } from "@/lib/utils";
import {
  AlertTriangle,
  Clock,
  CheckCircle2,
  User,
  Cpu,
  Wrench,
  Timer,
  Pencil,
  Trash2,
} from "lucide-react";
import { useState, useCallback, useEffect } from "react";

interface Props {
  tasks: any[];
}

const emptyTask = {
  engagementId: "",
  title: "",
  description: "",
  status: "pending",
  priority: "medium",
  assignedTo: "ai",
  slaDeadline: "",
};

export function TasksClient({ tasks: initial }: Props) {
  const [tasks, setTasks] = useState(initial);
  const [filter, setFilter] = useState("all");
  const [assigneeFilter, setAssigneeFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [form, setForm] = useState(emptyTask);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [engagements, setEngagements] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/engagements")
      .then((r) => r.json())
      .then(setEngagements);
  }, []);

  const refreshTasks = useCallback(async () => {
    const res = await fetch("/api/tasks");
    setTasks(await res.json());
  }, []);

  const filtered = tasks
    .filter((t) => filter === "all" || t.status === filter)
    .filter((t) => assigneeFilter === "all" || t.assignedTo === assigneeFilter);

  const urgentCount = tasks.filter(
    (t) => t.priority === "urgent" && t.status !== "completed"
  ).length;
  const overdueCount = tasks.filter(
    (t) =>
      t.slaDeadline &&
      new Date(t.slaDeadline) < new Date() &&
      t.status !== "completed"
  ).length;
  const escalatedCount = tasks.filter((t) => t.autoEscalated).length;

  const capacityUsed = tasks.filter(
    (t) => t.status === "in_progress" || t.status === "pending"
  ).length;
  const maxCapacity = 12;

  const getAssigneeIcon = (assignee: string) => {
    switch (assignee) {
      case "ai":
        return <Cpu className="h-3.5 w-3.5 text-primary-500" />;
      case "operator":
        return <User className="h-3.5 w-3.5 text-blue-500" />;
      case "contractor":
        return <Wrench className="h-3.5 w-3.5 text-amber-500" />;
      default:
        return <User className="h-3.5 w-3.5 text-gray-400" />;
    }
  };

  const openAdd = () => {
    setEditingTask(null);
    setForm(emptyTask);
    setShowForm(true);
  };

  const openEdit = (task: any) => {
    setEditingTask(task);
    setForm({
      engagementId: task.engagementId,
      title: task.title,
      description: task.description || "",
      status: task.status,
      priority: task.priority,
      assignedTo: task.assignedTo,
      slaDeadline: task.slaDeadline
        ? new Date(task.slaDeadline).toISOString().slice(0, 16)
        : "",
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (editingTask) {
        await fetch("/api/tasks", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingTask.id, ...form }),
        });
      } else {
        await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }
      await refreshTasks();
      setShowForm(false);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/tasks?id=${id}`, { method: "DELETE" });
    await refreshTasks();
    setDeleteConfirm(null);
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="p-8 space-y-8">
      <PageHeader
        title="Task Board"
        description="SLA-tracked tasks with auto-escalation and smart prioritization"
        actions={
          <button
            onClick={openAdd}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700"
          >
            New Task
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Urgent Tasks"
          value={String(urgentCount)}
          icon={<AlertTriangle className="h-5 w-5 text-red-500" />}
        />
        <StatCard
          label="Overdue (SLA breach)"
          value={String(overdueCount)}
          icon={<Timer className="h-5 w-5 text-red-500" />}
        />
        <StatCard
          label="Auto-Escalated"
          value={String(escalatedCount)}
          icon={<AlertTriangle className="h-5 w-5 text-amber-500" />}
        />
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm font-medium text-gray-500">Capacity Load</p>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            {capacityUsed}/{maxCapacity}
          </p>
          <div className="mt-3 h-2 w-full rounded-full bg-gray-100">
            <div
              className={`h-2 rounded-full transition-all ${
                capacityUsed / maxCapacity > 0.8
                  ? "bg-red-500"
                  : capacityUsed / maxCapacity > 0.6
                  ? "bg-amber-500"
                  : "bg-emerald-500"
              }`}
              style={{
                width: `${Math.min(100, (capacityUsed / maxCapacity) * 100)}%`,
              }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {maxCapacity - capacityUsed} slots available
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500">Status:</span>
          {["all", "pending", "in_progress", "blocked", "completed"].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  filter === status
                    ? "bg-primary-100 text-primary-700"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                {status === "all"
                  ? "All"
                  : status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </button>
            )
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-500">Assignee:</span>
          {["all", "ai", "operator", "contractor"].map((assignee) => (
            <button
              key={assignee}
              onClick={() => setAssigneeFilter(assignee)}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                assigneeFilter === assignee
                  ? "bg-primary-100 text-primary-700"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {assignee !== "all" && getAssigneeIcon(assignee)}
              {assignee === "all"
                ? "All"
                : assignee.charAt(0).toUpperCase() + assignee.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((task) => {
          const isOverdue =
            task.slaDeadline &&
            new Date(task.slaDeadline) < new Date() &&
            task.status !== "completed";
          const slaTime = task.slaDeadline
            ? new Date(task.slaDeadline)
            : null;
          const hoursLeft = slaTime
            ? (slaTime.getTime() - Date.now()) / 3600000
            : null;

          return (
            <div
              key={task.id}
              className={`rounded-xl border p-5 transition-all hover:shadow-sm ${
                task.autoEscalated
                  ? "border-amber-200 bg-amber-50/50"
                  : isOverdue
                  ? "border-red-200 bg-red-50/30"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="mt-0.5">
                    {task.status === "completed" ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    ) : task.status === "blocked" ? (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {task.title}
                      </h3>
                      {task.autoEscalated && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                          <AlertTriangle className="h-3 w-3" />
                          Auto-escalated
                        </span>
                      )}
                    </div>
                    {task.description && (
                      <p className="mt-1 text-sm text-gray-500">
                        {task.description}
                      </p>
                    )}
                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-500">
                      {task.engagement && (
                        <>
                          <div className="flex items-center gap-1.5">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 text-[10px] font-bold text-gray-600">
                              {getInitials(task.engagement.client.name)}
                            </div>
                            {task.engagement.client.name}
                          </div>
                          <span className="text-gray-300">·</span>
                          <span>{task.engagement.serviceProduct.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => openEdit(task)}
                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(task.id)}
                    className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <div className="flex items-center gap-1.5 text-sm">
                    {getAssigneeIcon(task.assignedTo)}
                    <span className="text-xs font-medium text-gray-600 capitalize">
                      {task.assignedTo}
                    </span>
                  </div>
                  <StatusBadge status={task.priority} />
                  <StatusBadge status={task.status} />
                </div>
              </div>

              {slaTime && task.status !== "completed" && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                  <Timer className="h-3.5 w-3.5 text-gray-400" />
                  <span
                    className={`text-xs font-medium ${
                      isOverdue
                        ? "text-red-600"
                        : hoursLeft !== null && hoursLeft < 4
                        ? "text-amber-600"
                        : "text-gray-600"
                    }`}
                  >
                    SLA:{" "}
                    {isOverdue
                      ? `Breached ${timeAgo(task.slaDeadline)}`
                      : hoursLeft !== null && hoursLeft < 1
                      ? `${Math.round(hoursLeft * 60)}m remaining`
                      : hoursLeft !== null && hoursLeft < 24
                      ? `${Math.round(hoursLeft)}h remaining`
                      : `Due ${new Date(task.slaDeadline).toLocaleDateString()}`}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Modal
        open={showForm}
        onClose={() => setShowForm(false)}
        title={editingTask ? "Edit Task" : "New Task"}
        size="lg"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              placeholder="Task title..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Engagement</label>
            <select
              value={form.engagementId}
              onChange={(e) => updateField("engagementId", e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="">Select engagement...</option>
              {engagements.map((eng: any) => (
                <option key={eng.id} value={eng.id}>
                  {eng.client.name} — {eng.serviceProduct.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              rows={2}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Priority</label>
              <select
                value={form.priority}
                onChange={(e) => updateField("priority", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Assigned To</label>
              <select
                value={form.assignedTo}
                onChange={(e) => updateField("assignedTo", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="ai">AI</option>
                <option value="operator">Operator</option>
                <option value="contractor">Contractor</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                value={form.status}
                onChange={(e) => updateField("status", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="blocked">Blocked</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">SLA Deadline</label>
            <input
              type="datetime-local"
              value={form.slaDeadline}
              onChange={(e) => updateField("slaDeadline", e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={() => setShowForm(false)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !form.title || !form.engagementId}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : editingTask ? "Update Task" : "Create Task"}
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        title="Delete Task"
        size="sm"
      >
        <p className="text-sm text-gray-600">
          Are you sure you want to delete this task?
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={() => setDeleteConfirm(null)}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
            className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
}
