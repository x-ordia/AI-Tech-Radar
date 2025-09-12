export const TAB_CONFIG = {
  TECH: {
    label: "Tech",
    domains: [
      "AI Developer Tools",
      "Generative AI Frameworks",
      "Machine Learning Research",
      "Large Language Models",
      "Open Source AI Projects",
      "AI Model Optimization",
      "Computer Vision",
      "Natural Language Processing",
    ],
  },
  NVIDIA: {
    label: "NVIDIA",
    domains: [
      "NVIDIA CUDA & SDKs",
      "NVIDIA GPU Technology",
      "NVIDIA AI Enterprise",
      "NVIDIA Omniverse",
      "Deep Learning Super Sampling (DLSS)",
    ],
  },
  CUSTOM: {
    label: "Custom",
  },
};

export type TabKey = keyof typeof TAB_CONFIG;
