import _ from "lodash"

/**
 * @param {string} input
 */
export const upperCamelCase = (input: string) => {
  return _.flow(_.camelCase, _.upperFirst)(input)
}
