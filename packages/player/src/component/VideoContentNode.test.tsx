import { fireEvent, render, waitFor } from "@testing-library/preact";

import { VideoContentNode } from "@player/component/VideoContentNode";
import { VideoContentConfig } from "@player/model";
import { NODE_ROUTE_NEXT_NODE, NODE_ROUTE_NODE_END, NODE_ROUTE_NODE_START, NODE_ROUTE_PREVIOUS_NODE } from "@player/util/router";

describe("video content node", () => {
  const VIDEO: VideoContentConfig = {
    type: "file",
    file: { src: "./demo_video_longer.mp4" },
  };
  const MOCK_VIDEO_DURATION = 100;

  beforeAll(() => {
    mockVideo(MOCK_VIDEO_DURATION);
  });
  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("renders", () => {
    // render
    const result1 = render(<VideoContentNode config={VIDEO} />);
    expect(result1.container).toMatchSnapshot();
  });

  it('should start/stop video when "blocked" property changes', async () => {
    const result = render(<VideoContentNode config={VIDEO} />);
    const video = result.getByTestId("video-el") as HTMLVideoElement;

    // "play" video and move time manually since it cannot really run
    video.play();
    video.currentTime = 10;

    result.rerender(<VideoContentNode config={VIDEO} blocked />);

    expect(video.paused).toBeTruthy();

    result.rerender(<VideoContentNode config={VIDEO} blocked={false} />);

    expect(video.paused).toBeFalsy();
  });

  it("should start video on config change", async () => {
    const result = render(<VideoContentNode config={VIDEO} />);
    const video = result.getByTestId("video-el") as HTMLVideoElement;

    expect(video.paused).toBeTruthy();

    // rerender with new config object
    result.rerender(<VideoContentNode config={{ ...VIDEO }} />);

    expect(video.paused).toBeFalsy();
  });

  it("should position video to start on NODE_START", async () => {
    const result = render(<VideoContentNode config={VIDEO} />);
    const video = result.getByTestId("video-el") as HTMLVideoElement;

    // initial time
    video.currentTime = 10;

    // set position to NODE_START
    result.rerender(<VideoContentNode config={VIDEO} currentPosition={{ value: NODE_ROUTE_NODE_START }} />);

    expect(video.currentTime).toBe(0);
  });

  it("should position video to start on NODE_END", async () => {
    const result = render(<VideoContentNode config={VIDEO} />);
    const video = result.getByTestId("video-el") as HTMLVideoElement;

    // initial time
    video.currentTime = 10;

    // set position to NODE_END
    result.rerender(<VideoContentNode config={VIDEO} currentPosition={{ value: NODE_ROUTE_NODE_END }} />);

    expect(video.currentTime).toBe(MOCK_VIDEO_DURATION);
  });

  it("should position video to the start on PREVIOUS_NODE", async () => {
    const result = render(<VideoContentNode config={VIDEO} />);
    const video = result.getByTestId("video-el") as HTMLVideoElement;

    // initial time
    video.currentTime = 10;

    // set position to PREVIOUS_NODE
    result.rerender(<VideoContentNode config={VIDEO} currentPosition={{ value: NODE_ROUTE_PREVIOUS_NODE }} />);

    expect(video.currentTime).toBe(0);
  });

  it("should position video to the start on NEXT_NODE", async () => {
    const result = render(<VideoContentNode config={VIDEO} />);
    const video = result.getByTestId("video-el") as HTMLVideoElement;

    // initial time
    video.currentTime = 10;

    // set position to NEXT_NODE
    result.rerender(<VideoContentNode config={VIDEO} currentPosition={{ value: NODE_ROUTE_NEXT_NODE }} />);

    expect(video.currentTime).toBe(0);
  });

  it("should position video to specified time", async () => {
    const result = render(<VideoContentNode config={VIDEO} />);
    const video = result.getByTestId("video-el") as HTMLVideoElement;

    // initial time
    video.currentTime = 10;

    // set position to NEXT_NODE
    result.rerender(<VideoContentNode config={VIDEO} currentPosition={{ value: "56" }} />);

    expect(video.currentTime).toBe(56);
  });

  it("should listen to events", async () => {
    const onReadyFn = jest.fn();
    const onPlayFn = jest.fn();
    const onPauseFn = jest.fn();
    const onEndFn = jest.fn();
    const onTimeUpdateFn = jest.fn();

    const result = render(
      <VideoContentNode config={VIDEO} onReady={onReadyFn} onPlay={onPlayFn} onPause={onPauseFn} onEnd={onEndFn} onTimeUpdate={onTimeUpdateFn} />
    );
    const video = result.getByTestId("video-el") as HTMLVideoElement;

    fireEvent.canPlay(video);
    fireEvent.play(video);
    fireEvent.pause(video);
    fireEvent.ended(video);
    video.currentTime = 10;
    fireEvent.seeked(video);
    video.currentTime = 12;
    fireEvent.timeUpdate(video);

    expect(onReadyFn).toHaveBeenCalledTimes(1);
    expect(onPlayFn).toHaveBeenCalledTimes(1);
    expect(onPauseFn).toHaveBeenCalledTimes(1);
    expect(onEndFn).toHaveBeenCalledTimes(1);
    expect(onTimeUpdateFn).toHaveBeenCalledTimes(2);
    expect(onTimeUpdateFn.mock.calls).toEqual([[10], [12]]);
  });

  it('should listen to "play" event', async () => {
    const fn = jest.fn();

    const result = render(<VideoContentNode config={VIDEO} onPlay={fn} />);
    const video = result.getByTestId("video-el") as HTMLVideoElement;

    fireEvent.play(video);

    expect(fn).toHaveBeenCalledTimes(1);
  });
});

function mockVideo(duration: number) {
  // Mocking paused property
  Object.defineProperty(HTMLMediaElement.prototype, "paused", {
    writable: true,
    value: true, // Default paused state
  });

  // Mocking currentTime property
  Object.defineProperty(HTMLMediaElement.prototype, "currentTime", {
    writable: true,
    value: 0, // Default starting time
  });

  // Mocking duration property
  Object.defineProperty(HTMLMediaElement.prototype, "duration", {
    writable: true,
    value: duration, // Default duration
  });

  // Mocking play method
  HTMLMediaElement.prototype.play = jest.fn().mockImplementation(function (this: HTMLMediaElement) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this as any).paused = false; // Update paused state
    return Promise.resolve(); // play() is asynchronous
  });

  // Mocking pause method
  HTMLMediaElement.prototype.pause = jest.fn().mockImplementation(function (this: HTMLMediaElement) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (this as any).paused = true; // Update paused state
  });
}
