**geographically-distributed inventory management system** built on top of a **multi-region CockroachDB deployment**



## Core Features

#### **Multi-Region Deployment Visualization**

-   pins show different **GCP regions** (e.g., gcp-us-central1, gcp-asia-southeast1) 

-    pin displays the **product stock** available in that region
-   highlights how *`**regional locality and distribution**`* are managed — a key capability of distributed SQL 

#### **2. 📦** **Inventory Distribution**

-   The **bar chart** provides an overview of **total product stock** per item (e.g., “Telemetry Sensor”, “Rear Wing”, “iPhone”).
-   This helps visually compare demand/supply of products across the entire system.

#### **3. 👥** **User-to-Region Mapping**

##### 	The **table** lists users by region with metadata:

-   Name, email
-   Their **logical region** (e.g., “texas”)
-   The **CockroachDB region** they connect to (e.g., gcp-us-central1)
-   The **products** associated with each user



^This demonstrates how **user data and access patterns** are tied to a **specific region**, reinforcing the **“locality-aware” nature** of the 	deployment (e.g., REGIONAL BY ROW usage).^