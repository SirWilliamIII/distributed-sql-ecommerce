import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createUserAndFetchRegion } from "@/lib/createUserAndFetchRegion";

export default function UserCreationForm({ onUserCreated }) {
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
      const user = await createUserAndFetchRegion(formData);
      setCrdbRegion(user.crdb_region);
      onUserCreated?.(user); // callback if parent wants user ID
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
