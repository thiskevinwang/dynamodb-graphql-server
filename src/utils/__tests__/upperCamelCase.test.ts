import { upperCamelCase } from ".."

describe("upperCamelCase", () => {
  it("should upper-camel-case a string", () => {
    expect(upperCamelCase("savory")).toEqual("Savory")
    expect(upperCamelCase("Sweet-and-salty")).toEqual("SweetAndSalty")
    expect(upperCamelCase("  a_-bA __--- c")).toEqual("ABAC")
  })
})
