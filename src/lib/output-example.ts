const outputExample = {
  code: 200,
  data: {
    task_id: "c16e5746-c46d-4287-9286-a06063c50a24",
    model: "kling",
    task_type: "video_generation",
    status: "completed",
    config: {
      service_mode: "public",
      webhook_config: {
        endpoint: "",
        secret: "",
      },
    },
    input: {
      aspect_ratio: "1:1",
      camera_control: {
        config: {
          horizontal: 0,
          pan: 0,
          roll: 0,
          tilt: 0,
          vertical: 0,
          zoom: 0,
        },
        type: "simple",
      },
      cfg_scale: 0.5,
      duration: 5,
      image_url: "https://www.nt-nn.com/_data/resources/img/thumbnails/1836.14_9_tif_1000x1000.jpg",
      mode: "std",
      negative_prompt: "",
      prompt: "Пульсирующий эффект привлечения внимания",
    },
    output: {
      video_url: "https://storage.theapi.app/videos/287172438328395.mp4",
      type: "m2v_img2video",
      status: 99,
      works: [
        {
          content_type: "video",
          status: 99,
          type: "m2v_img2video",
          cover: {
            resource:
              "https://s15-kling.klingai.com/kimg/EMXN1y8qgwEKBnVwbG9hZBIOeWxhYi1zdHVudC1zZ3AaaXNlL2FpX3BvcnRhbF9zZ3BfbTJ2X2ltZzJ2aWRlb18xMDgwcF9zdGRfdjE2X2Rpc3RpbGwvM2FmMzQzMjctZTdkMy00MjgyLThjNzItMWQxZDhlZTFhZmQ5X3ZpZGVvX2NvdmVyLmpwZw.origin?x-kcdn-pid=112372",
            resource_without_watermark: "",
            height: 960,
            width: 960,
            duration: 0,
          },
          video: {
            resource:
              "https://v15-kling.klingai.com/bs2/upload-ylab-stunt-sgp/se/ai_portal_sgp_m2v_img2video_1080p_std_v16_distill/ea152b93-1f8a-43a6-8510-a5d549d53641_video.mp4?x-kcdn-pid=112372",
            resource_without_watermark: "https://storage.theapi.app/videos/287172438328395.mp4",
            height: 960,
            width: 960,
            duration: 5100,
          },
        },
      ],
    },
    meta: {
      created_at: "2025-08-14T19:49:02.372147819Z",
      started_at: "2025-08-14T19:49:02.698269221Z",
      ended_at: "2025-08-14T19:50:42.700612434Z",
      usage: {
        type: "point",
        frozen: 2600000,
        consume: 2600000,
      },
      is_using_private_pool: false,
    },
    detail: null,
    logs: null,
    error: {
      code: 0,
      raw_message: "",
      message: "",
      detail: null,
    },
  },
  message: "success",
};
