import "dotenv/config";
import express from "express";
import chatRoutes from "./src/api/routes/chat.routes.js";
import { observabilityMiddleware } from "./src/api/middleware/observability.js";
import { logger } from "./src/infrastructure/observability/logger.js";
import { getMetrics } from "./src/infrastructure/observability/metrics.js";
import { checkAlerts } from "./src/infrastructure/observability/alerts.js";

const app = express();
const PORT = Number(process.env.PORT || 5000);
app.use(express.json());
app.use(observabilityMiddleware);

app.get("/health",(req,res)=>res.status(200).json({
  status:"ok", requestId:req.requestId, service:"day101-ai-observability"
}));

app.get("/metrics",(req,res)=>{
  const metrics=getMetrics();
  res.status(200).json({metrics,alerts:checkAlerts(metrics)});
});

app.use("/api",chatRoutes);

app.use((err,req,res,next)=>{
  logger.error({event:"unhandled_error",requestId:req.requestId,error:err.message});
  res.status(500).json({error:"Internal server error",requestId:req.requestId});
});

app.listen(PORT,()=>{
  logger.info({event:"server_started",port:PORT,model:process.env.GROQ_MODEL || "openai/gpt-oss-20b"});
  console.log(`Server running on http://localhost:${PORT}`);
});