export interface GenerateAnimationParams {
  imageUrl: string;
  prompt: string;
}

export async function generateAnimation(params: GenerateAnimationParams): Promise<string> {
  const { imageUrl, prompt } = params;

  // Use GoAPI Kling API
  const createTaskUrl = "https://api.goapi.ai/api/v1/task";

  // Create payload according to GoAPI Kling API specification
  const payload = {
    model: "kling",
    task_type: "video_generation",
    input: {
      prompt: prompt,
      negative_prompt: "",
      cfg_scale: 0.5,
      duration: 5,
      aspect_ratio: "1:1",
      image_url: imageUrl, // Direct URL to the image
      camera_control: {
        type: "simple",
        config: {
          horizontal: 0,
          vertical: 0,
          pan: 0,
          tilt: 0,
          roll: 0,
          zoom: 0,
        },
      },
      mode: "std",
    },
    config: {
      service_mode: "public",
      webhook_config: {
        endpoint: "",
        secret: "",
      },
    },
  };

  // Make the initial request to create video generation task
  const createResp = await fetch(createTaskUrl, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_KLING_API_KEY,
    },
  });

  if (!createResp.ok) {
    const text = await createResp.text();
    throw new Error(`Task creation failed: ${createResp.status} ${text}`);
  }

  const data = await createResp.json();

  if (data.code !== 200) {
    throw new Error(`API Error: ${data.message || "Unknown error"}`);
  }

  const taskId = data.data.task_id;
  if (!taskId) {
    throw new Error("No task ID received from GoAPI");
  }

  // Poll for task completion
  return await pollForTaskCompletion(taskId);
}

async function pollForTaskCompletion(taskId: string): Promise<string> {
  const getTaskUrl = `https://api.goapi.ai/api/v1/task/${taskId}`;

  const timeoutMs = Number(import.meta.env.VITE_KLING_TIMEOUT_MS ?? 240000); // 4 min default
  const pollIntervalMs = Number(import.meta.env.VITE_KLING_POLL_MS ?? 3000);
  const startedAt = Date.now();

  while (Date.now() - startedAt < timeoutMs) {
    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));

    try {
      const statusResp = await fetch(getTaskUrl, {
        headers: {
          "x-api-key": import.meta.env.VITE_KLING_API_KEY,
        },
      });

      if (!statusResp.ok) {
        console.warn(`Status check failed: ${statusResp.status}`);
        continue;
      }

      const statusData = await statusResp.json();

      if (statusData.code !== 200) {
        console.warn(`API Error: ${statusData.message}`);
        continue;
      }

      const task = statusData.data;
      const status = task.status;

      // Check if task is completed
      if (status === "completed") {
        const output = task.output;
        if (output && output.works && output.works.length > 0) {
          const work = output.works[0];
          if (work.video && work.video.resource_without_watermark) {
            return work.video.resource_without_watermark;
          } else if (work.video && work.video.resource) {
            return work.video.resource;
          }
        }
        throw new Error("Task completed but no video URL found");
      }

      // Check if task failed
      if (status === "failed") {
        const error = task.error;
        throw new Error(error?.message || error?.raw_message || "Task failed");
      }

      // Check if still processing
      if (status === "pending" || status === "processing") {
        console.log(`Task status: ${status}`);
        continue;
      }

      console.warn(`Unknown task status: ${status}`);
    } catch (error) {
      // Continue polling on network errors
      console.warn("Polling error:", error);
      continue;
    }
  }

  throw new Error("Timed out while waiting for video generation");
}
