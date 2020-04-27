import { capitalize } from "../"

describe("", () => {
  it("should format and capitalize the first letter of a string", () => {
    expect(capitalize("savory")).toEqual("Savory")
    expect(capitalize("Sweet-and-salty")).toEqual("Sweetandsalty")
    expect(capitalize("  a_-bA __--- c")).toEqual("Abac")
  })
})
