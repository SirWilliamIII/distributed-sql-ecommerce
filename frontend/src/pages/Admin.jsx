// Admin Dashboard page for managing users, inventory, and orders with region-aware features.

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

function UserCreationForm({ onUserCreated }) {
  const [formData, setFormData] = useState({ name: "", email: "", region: "" });
  const [crdbRegion, setCrdbRegion] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error("User creation failed");
      setCrdbRegion(data.crdb_region);
      onUserCreated?.(data);
      alert("User created successfully");
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Input name="name" placeholder="Name" onChange={handleChange} />
      <Input name="email" placeholder="Email" onChange={handleChange} />
      <Input
        name="region"
        placeholder="Region (e.g., texas, asia)"
        onChange={handleChange}
      />
      <Button onClick={handleSubmit} disabled={loading}>
        {loading ? "Creating..." : "Create User"}
      </Button>
      {crdbRegion && (
        <div className="text-sm text-muted-foreground">
          🌐 CockroachDB Region: <strong>{crdbRegion}</strong>
        </div>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  const [formData, setFormData] = useState({
    userId: "",
    productId: "",
    quantity: "",
    crdbRegion: "",
  });
  const [products, setProducts] = useState([]);

  const fetchProductsByRegion = async (region) => {
    try {
      const res = await fetch(`/api/products?region=${region}`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      alert("Failed to load products");
    }
  };

  const handleOrderSubmit = async () => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: formData.userId,
          product_id: formData.productId,
          quantity: parseInt(formData.quantity),
        }),
      });
      if (!res.ok) throw new Error("Order creation failed");
      alert("Order placed successfully");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

      {/* Floating Modal for Map Page - Smart Region-Aware User/Order Flow */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="fixed bottom-6 right-6">➕ Quick Add</Button>
        </DialogTrigger>
        <DialogContent className="space-y-4">
          <h2 className="text-lg font-semibold">Quick Create User & Order</h2>
          <UserCreationForm
            onUserCreated={(user) => {
              console.log("User created:", user);
              fetchProductsByRegion(user.crdb_region);
            }}
          />

          {products.length > 0 && (
            <>
              <Select
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, productId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Product" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name} (Stock: {p.stock})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                placeholder="Quantity"
                type="number"
                name="quantity"
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, quantity: e.target.value }))
                }
              />
              <Button onClick={handleOrderSubmit}>Place Order</Button>
            </>
          )}
        </DialogContent>
      </Dialog>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Admin</h1>
      </div>
    </div>
  );
}
