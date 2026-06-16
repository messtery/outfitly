import { Fragment, useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table"
import { useDebounce } from "@/hooks/useDebounce"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronsUpDownIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react"

type Role = { id: number; name: string; description: string | null; permissions: string[] }

const PAGE_SIZE_OPTIONS = [10, 25, 50] as const
const FILTERABLE_COLS = ["name", "description"] as const
const API = "http://localhost:3000/api"

const PERMISSION_GROUPS: { group: string; items: { key: string; label: string }[] }[] = [
  {
    group: "Products",
    items: [
      { key: "products.view", label: "View" },
      { key: "products.create", label: "Create" },
      { key: "products.update", label: "Update" },
      { key: "products.delete", label: "Delete" },
    ],
  },
  {
    group: "Categories",
    items: [
      { key: "categories.view", label: "View" },
      { key: "categories.create", label: "Create" },
      { key: "categories.update", label: "Update" },
      { key: "categories.delete", label: "Delete" },
    ],
  },
  {
    group: "Orders",
    items: [
      { key: "orders.view", label: "View" },
      { key: "orders.update", label: "Update" },
      { key: "orders.delete", label: "Delete" },
    ],
  },
  {
    group: "Customers",
    items: [
      { key: "customers.view", label: "View" },
      { key: "customers.update", label: "Update" },
      { key: "customers.delete", label: "Delete" },
    ],
  },
  {
    group: "Roles",
    items: [
      { key: "roles.view", label: "View" },
      { key: "roles.create", label: "Create" },
      { key: "roles.update", label: "Update" },
      { key: "roles.delete", label: "Delete" },
    ],
  },
  {
    group: "Users",
    items: [
      { key: "users.view", label: "View" },
      { key: "users.create", label: "Create" },
      { key: "users.update", label: "Update" },
      { key: "users.delete", label: "Delete" },
    ],
  },
]

const ALL_PERMISSION_KEYS = PERMISSION_GROUPS.flatMap((g) => g.items.map((i) => i.key))

function SortIcon({ direction }: { direction: "asc" | "desc" | false }) {
  if (direction === "asc") return <ChevronUpIcon className="size-3.5" />
  if (direction === "desc") return <ChevronDownIcon className="size-3.5" />
  return <ChevronsUpDownIcon className="size-3.5 text-muted-foreground/60" />
}

export default function RolePage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [globalFilter, setGlobalFilter] = useState<string>(
    () => searchParams.get("q") ?? ""
  )
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() =>
    FILTERABLE_COLS.flatMap((col) => {
      const val = searchParams.get(`f_${col}`)
      return val ? [{ id: col, value: val }] : []
    })
  )
  const [sorting, setSorting] = useState<SortingState>(() => {
    const s = searchParams.get("sort") ?? ""
    return s.includes(":") ? [{ id: s.split(":")[0], desc: s.split(":")[1] === "desc" }] : []
  })
  const [pageIndex, setPageIndex] = useState<number>(() =>
    Math.max(0, (parseInt(searchParams.get("page") ?? "1") || 1) - 1)
  )
  const [pageSize, setPageSize] = useState<number>(() => {
    const ps = parseInt(searchParams.get("size") ?? "10")
    return (PAGE_SIZE_OPTIONS as readonly number[]).includes(ps) ? ps : 10
  })

  const debouncedGlobalFilter = useDebounce(globalFilter, 500)
  const debouncedColumnFilters = useDebounce(columnFilters, 500)

  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        if (globalFilter) next.set("q", globalFilter); else next.delete("q")
        if (pageIndex > 0) next.set("page", String(pageIndex + 1)); else next.delete("page")
        if (pageSize !== 10) next.set("size", String(pageSize)); else next.delete("size")
        if (sorting.length > 0)
          next.set("sort", `${sorting[0].id}:${sorting[0].desc ? "desc" : "asc"}`)
        else next.delete("sort")
        FILTERABLE_COLS.forEach((col) => {
          const f = columnFilters.find((x) => x.id === col)
          if (f) next.set(`f_${col}`, String(f.value)); else next.delete(`f_${col}`)
        })
        return next
      },
      { replace: true }
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalFilter, columnFilters, sorting, pageIndex, pageSize])

  const [roles, setRoles] = useState<Role[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const buildParams = () => {
    const params = new URLSearchParams({ page: String(pageIndex + 1), limit: String(pageSize) })
    if (debouncedGlobalFilter) params.set("q", debouncedGlobalFilter)
    if (sorting.length > 0) {
      params.set("sort", sorting[0].id)
      params.set("order", sorting[0].desc ? "desc" : "asc")
    }
    debouncedColumnFilters.forEach((f) => {
      if (f.value) params.set(String(f.id), String(f.value))
    })
    return params
  }

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    fetch(`${API}/admin/roles?${buildParams()}`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return
        setRoles(json.data ?? [])
        setTotalCount(json.meta?.total ?? 0)
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setIsLoading(false) })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedGlobalFilter, debouncedColumnFilters, sorting, pageIndex, pageSize])

  useEffect(() => {
    if (isLoading || totalCount === 0) return
    const pc = Math.ceil(totalCount / pageSize)
    if (pageIndex >= pc) setPageIndex(Math.max(0, pc - 1))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalCount, isLoading])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formName, setFormName] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formPermissions, setFormPermissions] = useState<string[]>([])
  const [formError, setFormError] = useState("")

  const openCreateModal = () => {
    setIsEditMode(false); setEditingId(null)
    setFormName(""); setFormDescription(""); setFormPermissions([]); setFormError("")
    setIsModalOpen(true)
  }
  const openEditModal = (r: Role) => {
    setIsEditMode(true); setEditingId(r.id)
    setFormName(r.name); setFormDescription(r.description ?? "")
    setFormPermissions(Array.isArray(r.permissions) ? r.permissions : [])
    setFormError("")
    setIsModalOpen(true)
  }

  const togglePermission = (key: string) => {
    setFormPermissions((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    )
  }

  const toggleGroupPermissions = (groupKeys: string[]) => {
    const allSelected = groupKeys.every((k) => formPermissions.includes(k))
    setFormPermissions((prev) =>
      allSelected
        ? prev.filter((k) => !groupKeys.includes(k))
        : [...new Set([...prev, ...groupKeys])]
    )
  }

  const toggleAllPermissions = () => {
    const allSelected = ALL_PERMISSION_KEYS.every((k) => formPermissions.includes(k))
    setFormPermissions(allSelected ? [] : [...ALL_PERMISSION_KEYS])
  }

  const refetch = () => {
    setIsLoading(true)
    fetch(`${API}/admin/roles?${buildParams()}`)
      .then((r) => r.json())
      .then((json) => { setRoles(json.data ?? []); setTotalCount(json.meta?.total ?? 0) })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    if (!formName.trim()) { setFormError("Name is required."); return }
    const res = await fetch(
      isEditMode ? `${API}/admin/roles/${editingId}` : `${API}/admin/roles`,
      {
        method: isEditMode ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formName.trim(),
          description: formDescription.trim() || null,
          permissions: formPermissions,
        }),
      }
    )
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setFormError(data.message ?? "Something went wrong.")
      return
    }
    setIsModalOpen(false)
    refetch()
  }

  const handleDelete = async (id: number) => {
    await fetch(`${API}/admin/roles/${id}`, { method: "DELETE" })
    refetch()
  }

  const handleBulkDelete = async () => {
    const ids = Object.keys(rowSelection).filter((k) => rowSelection[k]).map(Number)
    if (ids.length === 0) return
    await fetch(`${API}/admin/roles/bulk`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    })
    setRowSelection({})
    refetch()
  }

  const columns: ColumnDef<Role>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() ? true : table.getIsSomePageRowsSelected() ? "indeterminate" : false}
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox checked={row.getIsSelected()} onCheckedChange={(v) => row.toggleSelected(!!v)} aria-label="Select row" />
      ),
      enableSorting: false,
      enableColumnFilter: false,
    },
    { accessorKey: "id", header: "ID", enableSorting: true, enableColumnFilter: false },
    { accessorKey: "name", header: "Name", enableSorting: true, enableColumnFilter: true },
    {
      accessorKey: "description",
      header: "Description",
      enableSorting: true,
      enableColumnFilter: true,
      cell: ({ getValue }) => (getValue() as string | null) ?? <span className="text-muted-foreground/50">—</span>,
    },
    {
      id: "permissions",
      header: "Permissions",
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ row }) => {
        const perms: string[] = Array.isArray(row.original.permissions) ? row.original.permissions : []
        if (perms.length === 0) return <span className="text-muted-foreground/50">—</span>
        return (
          <Badge variant="secondary">{perms.length} / {ALL_PERMISSION_KEYS.length}</Badge>
        )
      },
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex gap-1.5">
          <Button variant="outline" size="icon-sm" onClick={() => openEditModal(row.original)}>
            <PencilIcon />
          </Button>
          <Button variant="destructive" size="icon-sm" onClick={() => handleDelete(row.original.id)}>
            <Trash2Icon />
          </Button>
        </div>
      ),
      enableSorting: false,
      enableColumnFilter: false,
    },
  ]

  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize))

  const table = useReactTable({
    data: roles,
    columns,
    getRowId: (row) => String(row.id),
    state: { sorting, columnFilters, globalFilter, pagination: { pageIndex, pageSize }, rowSelection },
    manualFiltering: true,
    manualSorting: true,
    manualPagination: true,
    pageCount,
    onSortingChange: (u) => { setSorting(u); setPageIndex(0) },
    onColumnFiltersChange: (u) => { setColumnFilters(u); setPageIndex(0) },
    onGlobalFilterChange: (v: string) => { setGlobalFilter(v); setPageIndex(0) },
    onPaginationChange: (u) => {
      const next = typeof u === "function" ? u({ pageIndex, pageSize }) : u
      if (next.pageSize !== pageSize) { setPageSize(next.pageSize); setPageIndex(0) }
      else setPageIndex(next.pageIndex)
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    enableRowSelection: true,
  })

  const selectedCount = Object.values(rowSelection).filter(Boolean).length
  const allSelected = ALL_PERMISSION_KEYS.every((k) => formPermissions.includes(k))

  return (
    <div className="mx-auto w-full space-y-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Roles</h1>
          <p className="text-sm text-muted-foreground">Manage system roles and permissions</p>
        </div>
        <Button onClick={openCreateModal}><PlusIcon /> Add Role</Button>
      </div>

      <div className="rounded-xl border bg-card">
        <div className="flex flex-wrap items-center gap-3 border-b p-4">
          <Input
            placeholder="Search roles..."
            value={globalFilter}
            onChange={(e) => { setGlobalFilter(e.target.value); setPageIndex(0) }}
            className="max-w-xs"
          />
          {selectedCount > 0 && (
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
              <Trash2Icon /> Delete {selectedCount} selected
            </Button>
          )}
          <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
            Rows per page:
            <select
              className="h-8 rounded-md border border-input bg-transparent px-2 text-sm outline-none focus:border-ring"
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setPageIndex(0) }}
            >
              {PAGE_SIZE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((hg) => (
                <Fragment key={hg.id}>
                  <TableRow>
                    {hg.headers.map((h) => (
                      <TableHead key={h.id} className="whitespace-nowrap">
                        {h.isPlaceholder ? null : (
                          <div
                            className={h.column.getCanSort() ? "flex cursor-pointer select-none items-center gap-1" : "flex items-center"}
                            onClick={h.column.getCanSort() ? h.column.getToggleSortingHandler() : undefined}
                          >
                            {flexRender(h.column.columnDef.header, h.getContext())}
                            {h.column.getCanSort() && <SortIcon direction={h.column.getIsSorted()} />}
                          </div>
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    {hg.headers.map((h) => (
                      <TableHead key={`${h.id}-f`} className="py-1.5">
                        {h.column.getCanFilter() ? (
                          <Input
                            value={(h.column.getFilterValue() as string) ?? ""}
                            onChange={(e) => h.column.setFilterValue(e.target.value)}
                            placeholder="Filter…"
                            className="h-7 text-xs"
                          />
                        ) : null}
                      </TableHead>
                    ))}
                  </TableRow>
                </Fragment>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {columns.map((_, j) => <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>)}
                  </TableRow>
                ))
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                    No roles found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm text-muted-foreground">
          <span>{selectedCount > 0 ? `${selectedCount} of ${totalCount} row(s) selected` : `${totalCount} row(s)`}</span>
          <div className="flex items-center gap-2">
            <span>Page {pageIndex + 1} of {pageCount}</span>
            <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>Previous</Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next</Button>
          </div>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Role" : "Add Role"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="form-name">Name *</Label>
              <Input id="form-name" placeholder="e.g. Admin" value={formName} onChange={(e) => setFormName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="form-desc">Description</Label>
              <Input id="form-desc" placeholder="Optional description" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} />
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Permissions</Label>
                <button
                  type="button"
                  onClick={toggleAllPermissions}
                  className="text-xs text-muted-foreground underline-offset-2 hover:underline"
                >
                  {allSelected ? "Deselect all" : "Select all"}
                </button>
              </div>
              <div className="max-h-64 overflow-y-auto rounded-md border p-3 space-y-4">
                {PERMISSION_GROUPS.map((group) => {
                  const groupKeys = group.items.map((i) => i.key)
                  const allGroupSelected = groupKeys.every((k) => formPermissions.includes(k))
                  const someGroupSelected = groupKeys.some((k) => formPermissions.includes(k))
                  return (
                    <div key={group.group}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Checkbox
                          id={`group-${group.group}`}
                          checked={allGroupSelected ? true : someGroupSelected ? "indeterminate" : false}
                          onCheckedChange={() => toggleGroupPermissions(groupKeys)}
                        />
                        <label htmlFor={`group-${group.group}`} className="text-sm font-medium cursor-pointer">
                          {group.group}
                        </label>
                      </div>
                      <div className="ml-6 grid grid-cols-2 gap-1.5">
                        {group.items.map((item) => (
                          <div key={item.key} className="flex items-center gap-2">
                            <Checkbox
                              id={item.key}
                              checked={formPermissions.includes(item.key)}
                              onCheckedChange={() => togglePermission(item.key)}
                            />
                            <label htmlFor={item.key} className="text-sm cursor-pointer">{item.label}</label>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
              <p className="text-xs text-muted-foreground">{formPermissions.length} of {ALL_PERMISSION_KEYS.length} permissions selected</p>
            </div>

            {formError && <p className="text-sm text-destructive" role="alert">{formError}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit">{isEditMode ? "Update" : "Create"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
