import { useState } from "react";
import { useData } from "@/contexts/DataContext";
import { Link } from "react-router-dom";
import { Plus, Search, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function Clients() {
  const { clients, addClient } = useData();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    addClient({
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string,
      document: fd.get("document") as string,
      address: fd.get("address") as string,
      city: fd.get("city") as string,
      notes: fd.get("notes") as string,
    });
    toast.success("Cliente cadastrado com sucesso");
    setOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="page-header">Clientes</h1>
          <p className="page-subtitle mt-1">{clients.length} clientes cadastrados</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="h-4 w-4 mr-2" />Novo Cliente</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader><DialogTitle>Cadastrar Cliente</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div><Label>Nome *</Label><Input name="name" required /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>E-mail</Label><Input name="email" type="email" /></div>
                <div><Label>Telefone</Label><Input name="phone" /></div>
              </div>
              <div><Label>CPF/CNPJ</Label><Input name="document" /></div>
              <div><Label>Endereço</Label><Input name="address" /></div>
              <div><Label>Cidade</Label><Input name="city" /></div>
              <div><Label>Observações</Label><Input name="notes" /></div>
              <Button type="submit" className="w-full">Cadastrar</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Buscar por nome..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
      </div>

      {filtered.length === 0 ? (
        <div className="diamond-card p-12 text-center">
          <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">Nenhum cliente encontrado</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map(c => (
            <Link key={c.id} to={`/clientes/${c.id}`} className="diamond-card p-4 flex items-center justify-between group">
              <div>
                <p className="font-medium group-hover:text-foreground/80 transition-colors">{c.name}</p>
                <p className="text-sm text-muted-foreground">{c.city}{c.phone && ` · ${c.phone}`}</p>
              </div>
              <span className="text-xs text-muted-foreground">→</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
