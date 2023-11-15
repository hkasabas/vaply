import { NodePlayerConfig } from "@player/model";

export const MOCK: NodePlayerConfig = {
  id: "package-1",
  title: "Package 1",

  flow: {
    type: "list",
    list: {
      nodes: ["node-1"],
    },
  },

  nodes: [
    {
      code: "node-1",
      video: {
        type: "file",
        file: { src: "./demo_video_longer.mp4" },
      },
      annotations: [
        {
          code: "annot-1",
          type: "card",
          position: { type: "static", static: { top: "5px", right: "5px" } },
          card: { title: "This is annotation #1" },
          dismissible: true,
        },
        {
          code: "annot-2",
          type: "card",
          blocking: true,
          dismissible: true,
          position: { type: "static", static: { top: "0px", left: "0px" } },
          dimensions: { width: "100%", height: "100%" },
          card: { title: "This is annotation #2" },
        },
        {
          code: "annot-3",
          type: "card",
          blocking: true,
          dismissible: true,
          position: { type: "static", static: { top: "5px", right: "5px", bottom: "5px", left: "5px" } },
          card: { title: "This is annotation #3" },
        },
      ],
      triggers: [
        {
          type: "timeupdate",
          targetCode: "annot-1",
          timeupdate: { start: 1, end: 5 },
        },
        {
          type: "timeupdate",
          targetCode: "annot-2",
          timeupdate: { start: 7 },
        },
        {
          type: "timeupdate",
          targetCode: "annot-3",
          timeupdate: { start: 11 },
        },
      ],
    },
  ],
};
