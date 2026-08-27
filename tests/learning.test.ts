import { describe, expect, it } from "vitest";
import { getLearningProgress, getNextTrack, learningTracks } from "../shared/learning";

describe("learning tracks", () => {
  it("starts with the first lesson when there is no progress", () => {
    expect(getNextTrack([]).id).toBe(learningTracks[0].id);
    expect(getLearningProgress([])).toBe(0);
  });

  it("returns the next incomplete lesson and percentage", () => {
    const completed = [learningTracks[0].id, learningTracks[1].id];
    expect(getNextTrack(completed).id).toBe(learningTracks[2].id);
    expect(getLearningProgress(completed)).toBe(29);
  });

  it("caps progress at the complete state", () => {
    const completed = learningTracks.map((track) => track.id);
    expect(getNextTrack(completed).id).toBe(learningTracks[learningTracks.length - 1].id);
    expect(getLearningProgress(completed)).toBe(100);
  });
});
