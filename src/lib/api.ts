export interface GenerateAnimationParams {
  imageFile: File;
  prompt: string;
}

// Helper function to convert File to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
}

export async function generateAnimation(params: GenerateAnimationParams): Promise<string> {
  const { imageFile, prompt } = params;

  // Use proxy in development, direct API in production
  const isDevelopment = import.meta.env.DEV;
  const baseUrl = isDevelopment ? "http://localhost:8099/v1/videos/image2video" : "https://api.klingai.com/v1/videos/image2video";

  // Convert image to base64
  const imageBase64 = await fileToBase64(imageFile);

  // Create JSON payload as required by Kling AI API
  const payload = {
    prompt: prompt,
    image: imageBase64,
  };

  // Make the initial request to start video generation
  const createResp = await fetch(baseUrl, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_KLING_API_KEY}`,
    },
  });

  if (!createResp.ok) {
    const text = await createResp.text();
    throw new Error(`Generation request failed: ${createResp.status} ${text}`);
  }

  const data = await createResp.json();

  // Check if we got a direct video URL (synchronous response)
  if (data.videoUrl) {
    return data.videoUrl;
  }

  // Check if we got a job ID for async processing
  if (data.jobId) {
    return await pollForVideoUrl(data.jobId);
  }

  throw new Error("Unexpected response from Kling API (no videoUrl or jobId)");
}

async function pollForVideoUrl(jobId: string): Promise<string> {
  const isDevelopment = import.meta.env.DEV;
  const baseUrl = isDevelopment ? "http://localhost:8099/v1/videos/image2video" : "https://api.klingai.com/v1/videos/image2video";

  const timeoutMs = Number(import.meta.env.VITE_KLING_TIMEOUT_MS ?? 240000); // 4 min default
  const pollIntervalMs = Number(import.meta.env.VITE_KLING_POLL_MS ?? 3000);
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));

    try {
      const statusResp = await fetch(`${baseUrl}?id=${encodeURIComponent(jobId)}`, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_KLING_API_KEY}`,
        },
      });

      if (!statusResp.ok) {
        continue;
      }

      const statusData = await statusResp.json();

      // Check if video is ready
      if (statusData.videoUrl) {
        return statusData.videoUrl;
      }

      // Check if generation failed
      if (statusData.status === "failed") {
        throw new Error(statusData.error || "Video generation failed");
      }

      // Check if still processing
      if (statusData.status === "processing" || statusData.status === "pending") {
        continue;
      }
    } catch (error) {
      // Continue polling on network errors
      console.warn("Polling error:", error);
      continue;
    }
  }

  throw new Error("Timed out while waiting for Kling to generate video");
}
