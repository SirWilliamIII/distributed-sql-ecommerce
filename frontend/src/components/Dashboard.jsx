import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [regionCounts, setRegionCounts] = useState([]);
  const [stockByRegion, setStockByRegion] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get("/users");
        const prodRes = await axios.get("/products");
        const stockRes = await axios.get("/stock-by-region");

        setUsers(userRes.data);
        setProducts(prodRes.data);
        setStockByRegion(stockRes.data);

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

  const getStockText = (region) => {
    const match = stockByRegion.find((r) => r.region === region);
    if (!match) return "";
    return Object.entries(match.stock_by_product)
      .map(([product, qty]) => `${product}: ${qty}`)
      .join(" | ");
  };

  return (
    <div className="p-4 text-white">
      <div className="w-full h-96">
        <ComposableMap projectionConfig={{ scale: 200 }}>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill="#2b2b2b"
                  stroke="#444"
                />
              ))
            }
          </Geographies>
          {Object.entries(regionCoords).map(([region, [lng, lat]]) => {
            const count =
              regionCounts.find((r) => r.region === region)?.count || 0;
            const stockLines = getStockText(region).split(" | ");
            return (
              <Marker key={region} coordinates={[lng, lat]}>
                <circle r={6} fill="#61dafb" stroke="#fff" strokeWidth={1} />
                <text textAnchor="middle" y={-10} fill="#fff" fontSize={10}>
                  {region} ({count})
                </text>
                {stockLines.map((line, i) => (
                  <text
                    key={i}
                    textAnchor="middle"
                    y={10 + i * 12}
                    fill="#ccc"
                    fontSize={9}
                  >
                    {line}
                  </text>
                ))}
              </Marker>
            );
          })}
        </ComposableMap>
      </div>
      <br />
      <div className="mt-10">
        <h2 className="text-2xl font-semibold mb-2">📦 Product Stock</h2>
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
