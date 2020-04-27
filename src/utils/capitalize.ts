import _ from "lodash"

/**
 * This helper will strip white space, underscores, and dashes
 * from a string, lowercase everything, and uppercase the first
 * character.
 *
 * @param {string} input
 */
export const capitalize = (input: string) => {
  const trimmed = _.replace(input, /[_-\s]/g, "")
  return _.flow(_.toLower, _.upperFirst)(trimmed)
}
