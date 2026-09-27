import { describe, expect, it } from "vitest";
import { canonicalPath, canonicalUrl } from "@/lib/seo";

describe("canonical URL generation", () => {
  it.each([
    ["/", "https://findergirlsnearme.com/"],
    ["/Mumbai?utm_source=test", "https://findergirlsnearme.com/Mumbai"],
    ["/Banglore/B.T.M-Nagar/", "https://findergirlsnearme.com/Banglore/B.T.M-Nagar"],
    ["/Banglore/B.T.M-Nagar/Minakshi?q=B.T.M#photos", "https://findergirlsnearme.com/Banglore/B.T.M-Nagar/Minakshi"],
  ])("canonicalizes %s", (input, expected) => {
    expect(canonicalUrl(input)).toBe(expected);
  });

  it("removes a non-canonical origin without changing slug case or dots", () => {
    expect(canonicalPath("http://www.findergirlsnearme.com/Banglore/B.T.M-Nagar?ref=old"))
      .toBe("/Banglore/B.T.M-Nagar");
  });
});

