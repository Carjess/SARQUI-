import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface Destination {
  id: string;
  name: string;
  price: number;
  estado: string;
  categoria: string;
  empresa_id: string | null;
}

interface Empresa {
  id: string;
  nombre: string;
  descripcion: string;
  logo: string | null;
  contacto: string;
}

interface Purchase {
  id: string;
  full_name: string;
  email: string;
  total_amount: number;
  status: string;
  referencia_bancaria: string | null;
  created_at: string;
  destinations: { name: string } | null;
}

export default function Admin() {
  const { user } = useAuth();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  // Estados para edición de destinos
  const [editingDestination, setEditingDestination] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ price: 0, estado: "", categoria: "" });

  // Estados para nueva empresa
  const [newEmpresa, setNewEmpresa] = useState({
    nombre: "",
    descripcion: "",
    logo: "",
    contacto: "",
  });

  useEffect(() => {
    if (!roleLoading && !isAdmin) {
      toast.error("No tienes permisos para acceder a esta página");
      navigate("/");
    }
  }, [isAdmin, roleLoading, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [destData, empData, purData] = await Promise.all([
        (supabase as any).from("destinations").select("id, name, price, estado, categoria, empresa_id"),
        (supabase as any).from("empresas").select("*"),
        (supabase as any).from("purchases").select("*, destinations(name)"),
      ]);

      if (destData.error) throw destData.error;
      if (empData.error) throw empData.error;
      if (purData.error) throw purData.error;

      setDestinations(destData.data || []);
      setEmpresas(empData.data || []);
      setPurchases(purData.data || []);
    } catch (error: any) {
      toast.error("Error al cargar datos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateDestination = async (id: string) => {
    try {
      const { error } = await (supabase as any)
        .from("destinations")
        .update({
          price: editForm.price,
          estado: editForm.estado,
          categoria: editForm.categoria,
        })
        .eq("id", id);

      if (error) throw error;

      toast.success("Destino actualizado");
      setEditingDestination(null);
      fetchData();
    } catch (error: any) {
      toast.error("Error al actualizar destino");
      console.error(error);
    }
  };

  const handleCreateEmpresa = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await (supabase as any).from("empresas").insert([newEmpresa]);

      if (error) throw error;

      toast.success("Empresa creada exitosamente");
      setNewEmpresa({ nombre: "", descripcion: "", logo: "", contacto: "" });
      fetchData();
    } catch (error: any) {
      toast.error("Error al crear empresa");
      console.error(error);
    }
  };

  const handleUpdatePurchaseStatus = async (id: string, status: string) => {
    try {
      const { error } = await (supabase as any).from("purchases").update({ status }).eq("id", id);

      if (error) throw error;

      toast.success(`Pago ${status === "confirmado" ? "confirmado" : "actualizado"}`);
      fetchData();
    } catch (error: any) {
      toast.error("Error al actualizar pago");
      console.error(error);
    }
  };

  if (roleLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-lg text-muted-foreground">Cargando...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-20">
        <section className="section">
          <div className="container">
            <h1 className="text-4xl font-bold mb-8">Panel de Administración</h1>

            <Tabs defaultValue="destinos" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="destinos">Destinos</TabsTrigger>
                <TabsTrigger value="empresas">Empresas</TabsTrigger>
                <TabsTrigger value="pagos">Pagos</TabsTrigger>
              </TabsList>

              <TabsContent value="destinos" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Gestión de Destinos</CardTitle>
                    <CardDescription>Edita precios y estado de los planes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {destinations.map((dest) => (
                        <div key={dest.id} className="border p-4 rounded-lg">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">{dest.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                Precio: ${dest.price} | Estado: {dest.estado} | Categoría: {dest.categoria}
                              </p>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setEditingDestination(dest.id);
                                setEditForm({
                                  price: dest.price,
                                  estado: dest.estado,
                                  categoria: dest.categoria,
                                });
                              }}
                            >
                              Editar
                            </Button>
                          </div>

                          {editingDestination === dest.id && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                              <div>
                                <Label>Precio</Label>
                                <Input
                                  type="number"
                                  value={editForm.price}
                                  onChange={(e) =>
                                    setEditForm({ ...editForm, price: parseFloat(e.target.value) })
                                  }
                                />
                              </div>
                              <div>
                                <Label>Estado</Label>
                                <Select
                                  value={editForm.estado}
                                  onValueChange={(value) => setEditForm({ ...editForm, estado: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="activo">Activo</SelectItem>
                                    <SelectItem value="inactivo">Inactivo</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label>Categoría</Label>
                                <Select
                                  value={editForm.categoria}
                                  onValueChange={(value) => setEditForm({ ...editForm, categoria: value })}
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="playa">Playa</SelectItem>
                                    <SelectItem value="montaña">Montaña</SelectItem>
                                    <SelectItem value="gastronómico">Gastronómico</SelectItem>
                                    <SelectItem value="cultural">Cultural</SelectItem>
                                    <SelectItem value="otro">Otro</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="md:col-span-3 flex gap-2">
                                <Button onClick={() => handleUpdateDestination(dest.id)}>
                                  Guardar Cambios
                                </Button>
                                <Button variant="outline" onClick={() => setEditingDestination(null)}>
                                  Cancelar
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="empresas" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Gestión de Empresas</CardTitle>
                    <CardDescription>Agregar y gestionar empresas turísticas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleCreateEmpresa} className="space-y-4 mb-6 p-4 border rounded-lg">
                      <h3 className="font-semibold">Nueva Empresa</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Nombre</Label>
                          <Input
                            required
                            value={newEmpresa.nombre}
                            onChange={(e) => setNewEmpresa({ ...newEmpresa, nombre: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Contacto</Label>
                          <Input
                            required
                            value={newEmpresa.contacto}
                            onChange={(e) => setNewEmpresa({ ...newEmpresa, contacto: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label>Logo URL</Label>
                          <Input
                            value={newEmpresa.logo}
                            onChange={(e) => setNewEmpresa({ ...newEmpresa, logo: e.target.value })}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Label>Descripción</Label>
                          <Textarea
                            required
                            value={newEmpresa.descripcion}
                            onChange={(e) => setNewEmpresa({ ...newEmpresa, descripcion: e.target.value })}
                          />
                        </div>
                      </div>
                      <Button type="submit">Crear Empresa</Button>
                    </form>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Empresas Registradas</h3>
                      {empresas.map((emp) => (
                        <div key={emp.id} className="border p-4 rounded-lg">
                          <h4 className="font-semibold">{emp.nombre}</h4>
                          <p className="text-sm text-muted-foreground">{emp.descripcion}</p>
                          <p className="text-sm mt-2">Contacto: {emp.contacto}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="pagos" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Control de Pagos</CardTitle>
                    <CardDescription>Gestiona y confirma pagos de clientes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {purchases.map((purchase) => (
                        <div key={purchase.id} className="border p-4 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold">{purchase.full_name}</h4>
                              <p className="text-sm text-muted-foreground">{purchase.email}</p>
                              <p className="text-sm">
                                Destino: {purchase.destinations?.name || "N/A"}
                              </p>
                              <p className="text-sm">Monto: ${purchase.total_amount}</p>
                              <p className="text-sm">
                                Referencia: {purchase.referencia_bancaria || "Sin referencia"}
                              </p>
                              <p className="text-sm">
                                Estado: <span className="font-semibold">{purchase.status}</span>
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Select
                                value={purchase.status}
                                onValueChange={(value) => handleUpdatePurchaseStatus(purchase.id, value)}
                              >
                                <SelectTrigger className="w-40">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pendiente">Pendiente</SelectItem>
                                  <SelectItem value="confirmado">Confirmado</SelectItem>
                                  <SelectItem value="pagado">Pagado</SelectItem>
                                  <SelectItem value="rechazado">Rechazado</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
