import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  type Vehicle,
  VehicleCategory,
  useAddVehicle,
  useListVehicles,
  useRemoveVehicle,
  useUpdateVehicle,
} from "../hooks/useQueries";

const EMPTY_FORM: Vehicle = {
  name: "",
  model: "",
  year: 2024n,
  price: 0n,
  category: VehicleCategory.new_,
  description: "",
  available: true,
};

export default function AdminInventoryPage() {
  const { data: vehicles, isLoading } = useListVehicles();
  const addVehicle = useAddVehicle();
  const updateVehicle = useUpdateVehicle();
  const removeVehicle = useRemoveVehicle();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [form, setForm] = useState<Vehicle>(EMPTY_FORM);
  const [deleteId, setDeleteId] = useState<bigint | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const openAddModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEditModal = (v: Vehicle, id: bigint) => {
    setEditingId(id);
    setForm({
      name: v.name,
      model: v.model,
      year: v.year,
      price: v.price,
      category: v.category,
      description: v.description,
      available: v.available,
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editingId !== null) {
        await updateVehicle.mutateAsync({ id: editingId, vehicle: form });
        toast.success("Vehicle updated!");
      } else {
        await addVehicle.mutateAsync(form);
        toast.success("Vehicle added!");
      }
      setModalOpen(false);
    } catch {
      toast.error("Failed to save vehicle.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteId === null) return;
    try {
      await removeVehicle.mutateAsync(deleteId);
      toast.success("Vehicle removed.");
    } catch {
      toast.error("Failed to remove vehicle.");
    } finally {
      setDeleteConfirmOpen(false);
      setDeleteId(null);
    }
  };

  const isPending = addVehicle.isPending || updateVehicle.isPending;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl font-bold text-foreground">
            Inventory
          </h1>
          <p className="text-muted-foreground mt-1">Manage vehicle listings</p>
        </div>
        <Button
          onClick={openAddModal}
          className="bg-primary text-primary-foreground"
          data-ocid="inventory.open_modal_button"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Vehicle
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3" data-ocid="inventory.loading_state">
          {["a", "b", "c", "d"].map((k) => (
            <Skeleton key={k} className="h-12 w-full" />
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <Table data-ocid="inventory.table">
            <TableHeader>
              <TableRow className="border-border hover:bg-muted/30">
                <TableHead className="text-muted-foreground">Name</TableHead>
                <TableHead className="text-muted-foreground">Model</TableHead>
                <TableHead className="text-muted-foreground">Year</TableHead>
                <TableHead className="text-muted-foreground">Price</TableHead>
                <TableHead className="text-muted-foreground">
                  Category
                </TableHead>
                <TableHead className="text-muted-foreground">
                  Available
                </TableHead>
                <TableHead className="text-muted-foreground text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {!vehicles || vehicles.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="text-center py-12 text-muted-foreground"
                    data-ocid="inventory.empty_state"
                  >
                    No vehicles in inventory.
                  </TableCell>
                </TableRow>
              ) : (
                vehicles.map((v, i) => {
                  const id = BigInt(i);
                  return (
                    <TableRow
                      key={v.name + v.model}
                      className="border-border hover:bg-muted/20"
                      data-ocid={`inventory.item.${i + 1}`}
                    >
                      <TableCell className="text-foreground font-medium">
                        {v.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {v.model}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {String(v.year)}
                      </TableCell>
                      <TableCell className="text-accent font-medium">
                        ₹{Number(v.price).toLocaleString("en-IN")}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            v.category === VehicleCategory.new_
                              ? "bg-primary/20 text-primary border-primary/30"
                              : "bg-accent/20 text-accent border-accent/30"
                          }
                        >
                          {v.category === VehicleCategory.new_ ? "New" : "Used"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            v.available
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400"
                          }
                        >
                          {v.available ? "Yes" : "No"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditModal(v, id)}
                            data-ocid={`inventory.edit_button.${i + 1}`}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => {
                              setDeleteId(id);
                              setDeleteConfirmOpen(true);
                            }}
                            data-ocid={`inventory.delete_button.${i + 1}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent
          className="bg-card border-border max-w-lg"
          data-ocid="inventory.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-serif text-foreground">
              {editingId !== null ? "Edit Vehicle" : "Add Vehicle"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-foreground">Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, name: e.target.value }))
                  }
                  className="bg-input border-border"
                  data-ocid="inventory.input"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-foreground">Model</Label>
                <Input
                  value={form.model}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, model: e.target.value }))
                  }
                  className="bg-input border-border"
                  data-ocid="inventory.input"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="text-foreground">Year</Label>
                <Input
                  type="number"
                  value={String(form.year)}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      year: BigInt(e.target.value || 2024),
                    }))
                  }
                  className="bg-input border-border"
                  data-ocid="inventory.input"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-foreground">Price (₹)</Label>
                <Input
                  type="number"
                  value={String(form.price)}
                  onChange={(e) =>
                    setForm((p) => ({
                      ...p,
                      price: BigInt(e.target.value || 0),
                    }))
                  }
                  className="bg-input border-border"
                  data-ocid="inventory.input"
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-foreground">Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, category: v as VehicleCategory }))
                }
              >
                <SelectTrigger
                  className="bg-input border-border"
                  data-ocid="inventory.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value={VehicleCategory.new_}>New</SelectItem>
                  <SelectItem value={VehicleCategory.used}>Used</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-foreground">Description</Label>
              <Input
                value={form.description}
                onChange={(e) =>
                  setForm((p) => ({ ...p, description: e.target.value }))
                }
                className="bg-input border-border"
                data-ocid="inventory.input"
              />
            </div>
            <div className="flex items-center gap-3">
              <Switch
                checked={form.available}
                onCheckedChange={(v) =>
                  setForm((p) => ({ ...p, available: v }))
                }
                data-ocid="inventory.switch"
              />
              <Label className="text-foreground">Available</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setModalOpen(false)}
              data-ocid="inventory.cancel_button"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              className="bg-primary text-primary-foreground"
              data-ocid="inventory.save_button"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingId !== null ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent
          className="bg-card border-border max-w-sm"
          data-ocid="inventory.delete.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-serif text-foreground">
              Confirm Delete
            </DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground text-sm">
            Are you sure you want to remove this vehicle? This action cannot be
            undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteConfirmOpen(false)}
              data-ocid="inventory.delete.cancel_button"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={removeVehicle.isPending}
              data-ocid="inventory.delete.confirm_button"
            >
              {removeVehicle.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
