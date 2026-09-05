import { describe, expect, it } from "vitest";
import { APP_DEEP_LINK_SCHEME, ANDROID_BUNDLE_ID, PUBLISHED_API_BASE_URL, buildDeepLinkScheme } from "../shared/auth-config";

describe("auth configuration", () => {
  it("uses the same deep-link scheme derived from the Android package", () => {
    expect(ANDROID_BUNDLE_ID).toBe("com.skagua.gestao");
    expect(buildDeepLinkScheme(ANDROID_BUNDLE_ID)).toBe("manusgestao");
    expect(APP_DEEP_LINK_SCHEME).toBe("manusgestao");
  });

  it("keeps the published API available for standalone native builds", () => {
    expect(PUBLISHED_API_BASE_URL).toBe("https://aguagestao-dmdvuebd.manus.space");
  });
});
