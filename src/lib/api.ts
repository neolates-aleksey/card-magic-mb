export interface GenerateAnimationParams {
  imageFile: File;
  prompt: string;
}

export async function generateAnimation(params: GenerateAnimationParams): Promise<string> {
  const { imageFile, prompt } = params;

  // Use proxy in development, direct API in production
  const isDevelopment = import.meta.env.DEV;
  const baseUrl = isDevelopment ? "http://localhost:8099/v1/videos/image2video" : "https://api.klingai.com/v1/videos/image2video";

  // Create form data with the required fields
  const form = new FormData();
  form.append("prompt", prompt);
  form.append("image", imageFile, imageFile.name);

  // Make the initial request to start video generation
  const createResp = await fetch(baseUrl, {
    method: "POST",
    body: form,
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_KLING_API_KEY}`,
      // Don't set Content-Type for FormData - browser will set it automatically with boundary
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
