import { describe, expect, it } from "vitest";
import { canonicalPath, canonicalUrl, escortsPath, urlSlug } from "@/lib/seo";

describe("canonical URL generation", () => {
  it.each([
    ["/", "https://findergirlsnearme.com/"],
    ["/about-us?utm_source=test", "https://findergirlsnearme.com/about-us"],
    ["/escorts/Mumbai?utm_source=test", "https://findergirlsnearme.com/escorts/mumbai/"],
    ["/escorts/Banglore/Gandhi-nagar", "https://findergirlsnearme.com/escorts/bangalore/gandhi-nagar/"],
    ["/escorts/Banglore/B.T.M-Nagar/Minakshi?q=B.T.M#photos", "https://findergirlsnearme.com/escorts/bangalore/btm-nagar/minakshi/"],
  ])("canonicalizes %s", (input, expected) => {
    expect(canonicalUrl(input)).toBe(expected);
  });

  it("removes a non-canonical origin", () => {
    expect(canonicalPath("http://www.findergirlsnearme.com/escorts/bangalore/gandhi-nagar/?ref=old"))
      .toBe("/escorts/bangalore/gandhi-nagar/");
  });
});

describe("escorts paths", () => {
  it("builds lowercase paths with a trailing slash", () => {
    expect(escortsPath("Banglore", "Gandhi-nagar")).toBe("/escorts/bangalore/gandhi-nagar/");
    expect(escortsPath("Navi-mumbai", "cbd-belapur", "Riya Sharma")).toBe("/escorts/navi-mumbai/cbd-belapur/riya-sharma/");
  });

  it("normalizes stored slugs", () => {
    expect(urlSlug("R.T-Nagar")).toBe("rt-nagar");
    expect(urlSlug("Banglore")).toBe("bangalore");
  });
});
