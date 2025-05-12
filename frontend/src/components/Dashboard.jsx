import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [regionCounts, setRegionCounts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get("http://127.0.0.1:5000/users");
        const prodRes = await axios.get("http://127.0.0.1:5000/products");
        setUsers(userRes.data);
        setProducts(prodRes.data);

        const counts = {};
        userRes.data.forEach((u) => {
          counts[u.crdb_region] = (counts[u.crdb_region] || 0) + 1;
        });
        setRegionCounts(
          Object.entries(counts).map(([region, count]) => ({ region, count }))
        );
      } catch (err) {
        console.error("Failed to load data", err);
      }
    };
    fetchData();
  }, []);

  const regionCoords = {
    "gcp-us-east1": [-79, 35],
    "gcp-us-central1": [-93, 41],
    "gcp-us-west2": [-118, 34],
    "gcp-europe-west1": [4, 50],
    "gcp-asia-southeast1": [103, 1],
  };

  return (
    <div className="p-4 text-white">
      <h1 className="text-3xl font-bold mb-4">🌍 Users by Region</h1>

      <div className="w-full h-96">
        <ComposableMap projectionConfig={{ scale: 200 }}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography key={geo.rsmKey} geography={geo} fill="#2b2b2b" stroke="#444" />
              ))
            }
          </Geographies>
          {Object.entries(regionCoords).map(([region, [lng, lat]]) => {
            const count = regionCounts.find((r) => r.region === region)?.count || 0;
            return (
              <Marker key={region} coordinates={[lng, lat]}>
                <circle r={6} fill="#61dafb" stroke="#fff" strokeWidth={1} />
                <text textAnchor="middle" y={-10} fill="#fff" fontSize={10}>
                  {region} ({count})
                </text>
              </Marker>
            );
          })}
        </ComposableMap>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-2">📦 Product Stock by Region</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={products}>
            <XAxis dataKey="name" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip />
            <Bar dataKey="stock" fill="#61dafb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
