import express from "express";
import { PORT } from "./config";
import deviceRoutes from "../tx/routes/device";
import withdrawRoutes from "../tx/routes/withdraw";

const app = express();
app.use(express.json());

app.use("/api/hardware", deviceRoutes);
app.use("/api/withdraw", withdrawRoutes);

app.listen(PORT, () => {
  console.log(`Hardware integration API running on http://localhost:${PORT}`);
});
