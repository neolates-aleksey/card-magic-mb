import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cors from "cors";
import { HttpsProxyAgent } from "https-proxy-agent";

const app = express();

// Enable CORS for all routes
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

const proxyAgent = new HttpsProxyAgent("http://G5W4QF:4NvyMF@193.7.199.8:8000");

// Create proxy middleware
const proxy = createProxyMiddleware({
  target: "https://api.klingai.com",
  changeOrigin: true,
  secure: false,
  agent: proxyAgent,
  logLevel: "debug",
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[PROXY] ${req.method} ${req.url} → ${proxyReq.path}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[PROXY] Response ${proxyRes.statusCode} for ${req.url}`);
  },
  onError: (err, req, res) => {
    console.error(`[PROXY] Error for ${req.url}:`, err.message);
    if (!res.headersSent) {
      res.status(500).json({
        error: "Proxy error",
        message: err.message,
        url: req.url,
      });
    }
  },
});

// Apply proxy to all routes
app.use("/", proxy);

const PORT = 8099;
app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
  console.log(`📡 Proxying to: https://api.klingai.com`);
  console.log(`🔐 Using proxy: 193.7.199.8:8000 (G5W4QF:4NvyMF)`);
  console.log(`📝 Example: http://localhost:${PORT}/v1/videos/image2video`);
});
