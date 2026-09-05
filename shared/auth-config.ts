export const ANDROID_BUNDLE_ID = "com.skagua.gestao";

export function buildDeepLinkScheme(bundleId: string): string {
  const timestamp = bundleId.split(".").pop()?.replace(/^t/, "") ?? "";
  return `manus${timestamp}`;
}

export const APP_DEEP_LINK_SCHEME = buildDeepLinkScheme(ANDROID_BUNDLE_ID);

export const PUBLISHED_API_BASE_URL = "https://aguagestao-dmdvuebd.manus.space";
