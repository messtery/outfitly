import { Fragment, useEffect, useState } from "react"
import type { ComponentProps } from "react"
import { adminFetch } from "@/lib/adminFetch"
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

// ─── Types ────────────────────────────────────────────────────────────────────

type Category = { id: number; name: string }

type Product = {
  id: number
  name: string
  categoryId: number
  price: number
  description: string | null
  image: string | null
  category: Category
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE_OPTIONS = [10, 25, 50] as const
const FILTERABLE_COLS = ["name", "category", "price", "description"] as const
const API = "http://localhost:3000/api"

// ─── Currency Input ───────────────────────────────────────────────────────────

type CurrencyInputProps = Omit<ComponentProps<typeof Input>, "value" | "onChange"> & {
  rawValue: string
  onRawChange: (raw: string) => void
}

function CurrencyInput({ rawValue, onRawChange, ...props }: CurrencyInputProps) {
  const formatted = rawValue ? Number(rawValue).toLocaleString("id-ID") : ""
  return (
    <Input
      value={formatted}
      onChange={(e) => onRawChange(e.target.value.replace(/\D/g, ""))}
      inputMode="numeric"
      placeholder="0"
      {...props}
    />
  )
}

// ─── Category Combobox ────────────────────────────────────────────────────────

type CategoryComboboxProps = {
  categories: Category[]
  value: number | null
  onChange: (id: number) => void
  onAddCategory: (name: string) => Promise<Category>
}

function CategoryCombobox({ categories, value, onChange, onAddCategory }: CategoryComboboxProps) {
  const [search, setSearch] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  const selected = categories.find((c) => c.id === value)
  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )
  const exactMatch = filtered.some(
    (c) => c.name.toLowerCase() === search.trim().toLowerCase()
  )

  const handleSelect = (cat: Category) => {
    onChange(cat.id)
    setSearch(cat.name)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <Input
        value={isOpen ? search : (selected?.name ?? "")}
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => { setSearch(selected?.name ?? ""); setIsOpen(true) }}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)}
        placeholder="Search or select category..."
        autoComplete="off"
      />
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full overflow-y-auto rounded-lg border bg-popover shadow-md max-h-48">
          {filtered.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className="flex w-full items-center px-3 py-2 text-sm text-left hover:bg-accent hover:text-accent-foreground"
              onMouseDown={() => handleSelect(cat)}
            >
              {cat.name}
            </button>
          ))}
          {search.trim() && !exactMatch && (
            <button
              type="button"
              className="flex w-full items-center gap-1.5 px-3 py-2 text-sm font-medium text-left text-primary hover:bg-accent hover:text-accent-foreground"
              onMouseDown={async () => { const c = await onAddCategory(search.trim()); handleSelect(c) }}
            >
              <PlusIcon className="size-3.5" />
              Add &ldquo;{search.trim()}&rdquo;
            </button>
          )}
          {!search.trim() && filtered.length === 0 && (
            <div className="px-3 py-2 text-sm text-muted-foreground">No categories</div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Sort Icon ────────────────────────────────────────────────────────────────

function SortIcon({ direction }: { direction: "asc" | "desc" | false }) {
  if (direction === "asc") return <ChevronUpIcon className="size-3.5" />
  if (direction === "desc") return <ChevronDownIcon className="size-3.5" />
  return <ChevronsUpDownIcon className="size-3.5 text-muted-foreground/60" />
}

// ─── ProductPage ──────────────────────────────────────────────────────────────

export default function ProductPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  // ── Table state (local → URL) ───────────────────────────────────────────────

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

  // ── Debounced filter values (sent to API after 500ms) ──────────────────────

  const debouncedGlobalFilter = useDebounce(globalFilter, 500)
  const debouncedColumnFilters = useDebounce(columnFilters, 500)

  // ── URL sync ────────────────────────────────────────────────────────────────

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

  // ── Server state ────────────────────────────────────────────────────────────

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

  // ── Data fetch ──────────────────────────────────────────────────────────────

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
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
        if (f.value) params.set(f.id === "category" ? "category" : String(f.id), String(f.value))
      })
      const res = await adminFetch(`${API}/admin/products?${params}`)
      const json = await res.json()
      setProducts(json.data ?? [])
      setTotalCount(json.meta?.total ?? 0)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCategories = async () => {
    const res = await fetch(`${API}/categories?limit=1000`)
    const json = await res.json()
    setCategories((json.data as Category[]) ?? [])
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  // Refetch when debounced filters, sorting, or pagination changes
  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
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
    adminFetch(`${API}/admin/products?${params}`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return
        setProducts(json.data ?? [])
        setTotalCount(json.meta?.total ?? 0)
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setIsLoading(false) })
    return () => { cancelled = true }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedGlobalFilter, debouncedColumnFilters, sorting, pageIndex, pageSize])

  // ── Auto-retreat when page becomes empty ────────────────────────────────────

  useEffect(() => {
    if (isLoading || totalCount === 0) return
    const pc = Math.ceil(totalCount / pageSize)
    if (pageIndex >= pc) setPageIndex(Math.max(0, pc - 1))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalCount, isLoading])

  // ── Modal state ─────────────────────────────────────────────────────────────

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formName, setFormName] = useState("")
  const [formCategoryId, setFormCategoryId] = useState<number | null>(null)
  const [formPrice, setFormPrice] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formImageFile, setFormImageFile] = useState<File | null>(null)
  const [formImagePreview, setFormImagePreview] = useState<string | null>(null)
  const [formError, setFormError] = useState("")

  const openCreateModal = () => {
    setIsEditMode(false); setEditingId(null); setFormName("")
    setFormCategoryId(null); setFormPrice(""); setFormDescription("")
    setFormImageFile(null); setFormImagePreview(null); setFormError("")
    setIsModalOpen(true)
  }

  const openEditModal = (p: Product) => {
    setIsEditMode(true); setEditingId(p.id); setFormName(p.name)
    setFormCategoryId(p.categoryId); setFormPrice(String(p.price))
    setFormDescription(p.description ?? "")
    setFormImageFile(null); setFormImagePreview(p.image ?? null); setFormError("")
    setIsModalOpen(true)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setFormImageFile(file)
    if (file) setFormImagePreview(URL.createObjectURL(file))
  }

  // ── Category quick-add ──────────────────────────────────────────────────────

  const handleAddCategory = async (name: string): Promise<Category> => {
    const res = await fetch(`${API}/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })
    const cat = (await res.json()) as Category
    setCategories((prev) => [...prev, cat])
    return cat
  }

  // ── CRUD ────────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault()
    const parsedPrice = Number(formPrice)
    if (!formName.trim() || !formCategoryId || isNaN(parsedPrice) || parsedPrice <= 0) {
      setFormError("Please fill all required fields with valid values.")
      return
    }
    const body = new FormData()
    body.append("name", formName.trim())
    body.append("categoryId", String(formCategoryId))
    body.append("price", String(parsedPrice))
    body.append("description", formDescription.trim())
    if (formImageFile) body.append("image", formImageFile)
    await adminFetch(
      isEditMode ? `${API}/admin/products/${editingId}` : `${API}/admin/products`,
      { method: isEditMode ? "PUT" : "POST", body }
    )
    setIsModalOpen(false)
    fetchProducts()
  }

  const handleDelete = async (id: number) => {
    await adminFetch(`${API}/admin/products/${id}`, { method: "DELETE" })
    fetchProducts()
  }

  const handleBulkDelete = async () => {
    const ids = Object.keys(rowSelection).filter((k) => rowSelection[k]).map(Number)
    if (ids.length === 0) return
    await adminFetch(`${API}/admin/products/bulk`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    })
    setRowSelection({})
    fetchProducts()
  }

  // ── Columns ─────────────────────────────────────────────────────────────────

  const columns: ColumnDef<Product>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ? true
              : table.getIsSomePageRowsSelected() ? "indeterminate" : false
          }
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableColumnFilter: false,
    },
    {
      accessorKey: "image",
      header: "Image",
      enableSorting: false,
      enableColumnFilter: false,
      cell: ({ getValue }) => {
        const url = getValue() as string | null
        return url
          ? <img src={url} alt="product" className="h-10 w-16 rounded object-cover" />
          : <span className="text-xs text-muted-foreground">—</span>
      },
    },
    { accessorKey: "name", header: "Name", enableSorting: true, enableColumnFilter: true },
    {
      id: "category",
      accessorFn: (row) => row.category?.name ?? "",
      header: "Category",
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ getValue }) => `Rp ${(getValue() as number).toLocaleString("id-ID")}`,
      enableSorting: true,
      enableColumnFilter: true,
    },
    {
      accessorKey: "description",
      header: "Description",
      enableSorting: false,
      enableColumnFilter: true,
      cell: ({ getValue }) => (
        <span className="block max-w-[200px] truncate text-muted-foreground">
          {(getValue() as string | null) ?? "—"}
        </span>
      ),
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

  // ── Table (manual server-side mode) ─────────────────────────────────────────

  const pageCount = Math.max(1, Math.ceil(totalCount / pageSize))

  const table = useReactTable({
    data: products,
    columns,
    getRowId: (row) => String(row.id),
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination: { pageIndex, pageSize },
      rowSelection,
    },
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

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="mx-auto w-full space-y-4 p-6">
      <div className="flex items-center justify-between">
        <div className="border-l-2 border-primary pl-3">
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="text-sm text-muted-foreground">Manage your product catalog</p>
        </div>
        <Button onClick={openCreateModal}><PlusIcon /> Add Product</Button>
      </div>

      <div className="rounded-xl border bg-card">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 border-b p-4">
          <Input
            placeholder="Search all columns..."
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

        {/* Table */}
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
                    {columns.map((_, j) => (
                      <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() ? "selected" : undefined}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                    No products found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t px-4 py-3 text-sm text-muted-foreground">
          <span>
            {selectedCount > 0
              ? `${selectedCount} of ${totalCount} row(s) selected`
              : `${totalCount} row(s)`}
          </span>
          <div className="flex items-center gap-2">
            <span>Page {pageIndex + 1} of {pageCount}</span>
            <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditMode ? "Edit Product" : "Add Product"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="form-name">Name *</Label>
              <Input id="form-name" placeholder="Product name" value={formName} onChange={(e) => setFormName(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Category *</Label>
              <CategoryCombobox categories={categories} value={formCategoryId} onChange={setFormCategoryId} onAddCategory={handleAddCategory} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="form-price">Price (Rp) *</Label>
              <CurrencyInput id="form-price" rawValue={formPrice} onRawChange={setFormPrice} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="form-description">Description</Label>
              <Input id="form-description" placeholder="Optional description" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="form-image">Image</Label>
              {formImagePreview && (
                <img src={formImagePreview} alt="preview" className="h-32 w-full rounded-md object-cover" />
              )}
              <Input id="form-image" type="file" accept="image/*" onChange={handleImageChange} className="cursor-pointer" />
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
