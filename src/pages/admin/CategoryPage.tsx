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

type Category = { id: number; name: string }

const PAGE_SIZE_OPTIONS = [10, 25, 50] as const
const FILTERABLE_COLS = ["name"] as const
const API = "http://localhost:3000/api"

function SortIcon({ direction }: { direction: "asc" | "desc" | false }) {
  if (direction === "asc") return <ChevronUpIcon className="size-3.5" />
  if (direction === "desc") return <ChevronDownIcon className="size-3.5" />
  return <ChevronsUpDownIcon className="size-3.5 text-muted-foreground/60" />
}

export default function CategoryPage() {
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

  const [categories, setCategories] = useState<Category[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  const fetchData = () => {
    const params = new URLSearchParams({
      page: String(pageIndex + 1),
      limit: String(pageSize),
    })
    if (debouncedGlobalFilter) params.set("q", debouncedGlobalFilter)
    if (sorting.length > 0) {
      params.set("sort", sorting[0].id)
      params.set("order", sorting[0].desc ? "desc" : "asc")
    }
    debouncedColumnFilters.forEach((f) => {
      if (f.value) params.set(String(f.id), String(f.value))
    })
    return fetch(`${API}/categories?${params}`)
  }

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    fetchData()
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return
        setCategories(json.data ?? [])
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
  const [formError, setFormError] = useState("")

  const openCreateModal = () => {
    setIsEditMode(false); setEditingId(null); setFormName(""); setFormError("")
    setIsModalOpen(true)
  }
  const openEditModal = (c: Category) => {
    setIsEditMode(true); setEditingId(c.id); setFormName(c.name); setFormError("")
    setIsModalOpen(true)
  }

  const refetch = () => {
    setIsLoading(true)
    fetchData()
      .then((r) => r.json())
      .then((json) => { setCategories(json.data ?? []); setTotalCount(json.meta?.total ?? 0) })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    if (!formName.trim()) { setFormError("Name is required."); return }
    await fetch(
      isEditMode ? `${API}/categories/${editingId}` : `${API}/categories`,
      {
        method: isEditMode ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formName.trim() }),
      }
    )
    setIsModalOpen(false)
    refetch()
  }

  const handleDelete = async (id: number) => {
    await fetch(`${API}/categories/${id}`, { method: "DELETE" })
    refetch()
  }

  const handleBulkDelete = async () => {
    const ids = Object.keys(rowSelection).filter((k) => rowSelection[k]).map(Number)
    if (ids.length === 0) return
    await fetch(`${API}/categories/bulk`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    })
    setRowSelection({})
    refetch()
  }

  const columns: ColumnDef<Category>[] = [
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
    { accessorKey: "name", header: "Name", enableSorting: true, enableColumnFilter: true },
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
    data: categories,
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

  return (
    <div className="mx-auto w-full space-y-4 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Categories</h1>
          <p className="text-sm text-muted-foreground">Manage product categories</p>
        </div>
        <Button onClick={openCreateModal}><PlusIcon /> Add Category</Button>
      </div>

      <div className="rounded-xl border bg-card">
        <div className="flex flex-wrap items-center gap-3 border-b p-4">
          <Input
            placeholder="Search categories..."
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
                    No categories found.
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Category" : "Add Category"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="form-name">Name *</Label>
              <Input id="form-name" placeholder="Category name" value={formName} onChange={(e) => setFormName(e.target.value)} />
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
